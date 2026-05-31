import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ControllerCategoryRow } from "../components/ControllerCategoryRow";
// import type { BoardCreatorCategory, BoardCreatorData } from "./BoardCreator";
import {
  fetchQuestions,
  toggleShownHidden,
  writeCurrentQuestion,
} from "../services/api";
import { supabase } from "../utils/supabase";

type ControllerCategoryRow = {
  id: number;
  category: string;
  count: number;
  score: number;
  position: number;
  isHidden: boolean;
};

type ControllerQuestion = {
  id: number;
  question: string;
  categories?: ControllerCategoryRow[];
};

export default function Controller() {
  const location = useLocation();

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0); // default to first question, adjust if navigation state provides a current question
  const [questions, setQuestions] = useState<ControllerQuestion[]>([]);

  const currentQuestion = questions[selectedQuestionIndex];

  const controllerCategories = currentQuestion?.categories ?? [];

  useEffect(() => {
    const load = async () => {
      try {
        let baseQuestions: ControllerQuestion[] = [];

        // 1. Use navigation state if available
        if (location.state?.data) {
          baseQuestions = location.state.data;
        } else {
          baseQuestions = await fetchQuestions();
        }

        // 2. Enrich each question with categories
        const enriched = await Promise.all(
          baseQuestions.map(async (question) => {
            const { data, error } = await supabase
              .from("board_state")
              .select("*")
              .eq("question_id", question.id)
              .order("count", { ascending: false });

            if (error) throw error;

            const categories: ControllerCategoryRow[] = (data ?? []).map(
              (row, index) => ({
                id: row.id,
                category: row.category,
                count: row.count,
                score: 0,
                position: index + 1,
                isHidden: row.is_hidden,
              }),
            );

            return {
              ...question,
              categories,
            };
          }),
        );

        setQuestions(enriched);

        // 3. Set selected question index based on navigation state or default to 0
        if (location.state?.currentQuestionIndex) {
          setSelectedQuestionIndex(location.state.currentQuestionIndex);
        } else {
          setSelectedQuestionIndex(0);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    load();
  }, [location.state]);

  function handleToggleIsHidden(id: number, isHidden: boolean) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== currentQuestion?.id) return q;

        const updatedCategories = q.categories?.map((cat) => {
          if (cat.id !== id) return cat;

          toggleShownHidden(q.id, cat.category, !isHidden).catch(console.error);

          return {
            ...cat,
            isHidden: !isHidden,
          };
        });

        return {
          ...q,
          categories: updatedCategories,
        };
      }),
    );
  }

  function handleQuestionChange(newIndex: number) {
    writeCurrentQuestion(newIndex + 1).catch(console.error); // +1 because question IDs are 1-indexed
    setSelectedQuestionIndex(newIndex);
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="controller">
      <div className="question-selector">
        <button
          className="arrow-button"
          onClick={() =>
            handleQuestionChange(Math.max(selectedQuestionIndex - 1, 0))
          }
        >
          ←
        </button>

        <h2 className="question-number">Question #{currentQuestion.id}</h2>

        <button
          className="arrow-button"
          onClick={() =>
            handleQuestionChange(
              Math.min(selectedQuestionIndex + 1, questions.length - 1),
            )
          }
        >
          →
        </button>
      </div>

      <div className="table-container">
        <div className="table-header answers-header">
          <span>position</span>
          <span>answer</span>
          <span>shown/hidden</span>
        </div>

        <div className="table-list">
          {controllerCategories.map((item) => (
            <ControllerCategoryRow
              key={item.id}
              handleClick={handleToggleIsHidden}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
