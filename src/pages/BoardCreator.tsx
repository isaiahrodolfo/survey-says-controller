import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryRow } from "../components/CategoryRow";
import { AnswerRow } from "../components/AnswerRow";
import {
  fetchAnswers,
  fetchQuestions,
  updateBoardStateQuestionCategories,
  writeBoardState,
} from "../services/api";
import type { Answer, Question } from "../services/api";

export type BoardCreatorData = {
  id: number;
  question: string;
  answers: BoardCreatorAnswer[];
  categories?: BoardCreatorCategory[];
};

export type BoardCreatorCategory = {
  id: number;
  category: string;
  count: number;
  score: number;
  position: number;
};

type BoardCreatorAnswer = {
  id: number;
  answer: string;
  count: number;
  category: number | null;
};

function createInitialCategory(): BoardCreatorCategory {
  return {
    id: 1,
    category: "",
    count: 0,
    score: 0,
    position: 1,
  };
}

const addAnswersToData = (
  answers: Answer[],
  questions: Question[],
): BoardCreatorData[] => {
  const questionMap = new Map<number, Map<string, number>>();

  for (const answer of answers) {
    // Create an empty map for the question if it doesn't exist
    if (!questionMap.has(answer.question_id)) {
      questionMap.set(answer.question_id, new Map());
    }

    const answerCounts = questionMap.get(answer.question_id)!;

    // Increment the count for this answer text
    answerCounts.set(
      answer.answer_text,
      (answerCounts.get(answer.answer_text) ?? 0) + 1,
    );
  }

  return Array.from(questionMap.entries()).map(
    ([questionId, answerCounts]) => ({
      id: questionId,
      question: questions.find((q) => q.id === questionId)?.question || "", // fill this if you have question text elsewhere
      categories: [createInitialCategory()],
      answers: Array.from(answerCounts.entries()).map(
        ([answerText, count], index) => ({
          id: index + 1,
          answer: answerText,
          count,
          category: null,
        }),
      ),
    }),
  );
};

export default function BoardCreator() {
  const [data, setData] = useState<BoardCreatorData[]>();
  const [isLoading, setIsLoading] = useState(true);

  // Load questions from the API on component mount
  useEffect(() => {
    async function loadQuestions() {
      const answers: Answer[] = await fetchAnswers();
      const questions: Question[] = await fetchQuestions();

      setData(addAnswersToData(answers, questions));
      setIsLoading(false);
    }

    loadQuestions();
  }, []);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const currentQuestion = data?.[selectedQuestionIndex];

  const answerRows = currentQuestion?.answers;
  const categoryRows = currentQuestion?.categories ?? [];

  const navigate = useNavigate();

  const handleQuestionChange = (newIndex: number) => {
    setSelectedQuestionIndex(newIndex);
    setSelectedCategory(null);
  };

  const updateCategoryName = (id: number, category: string) => {
    setData((prevData) =>
      prevData?.map((question) => {
        if (question.id !== currentQuestion?.id) {
          return question;
        }

        const categories = question.categories ?? [];

        const nextCategories = categories.map((row) =>
          row.id === id ? { ...row, category } : row,
        );

        // Check if all categories are filled to decide if we should add a new one
        const allFilled = nextCategories.every(
          (row) => row.category.trim() !== "",
        );

        let withAdded = nextCategories;

        if (allFilled) {
          withAdded = [
            ...nextCategories,
            {
              id: nextCategories.length + 1,
              category: "",
              count: 0,
              score: 0,
              position: nextCategories.length + 1,
            },
          ];
        }

        return {
          ...question,
          categories: withAdded,
        };
      }),
    );
  };

  function recomputeCategories(
    categories: BoardCreatorCategory[],
    answers: BoardCreatorAnswer[],
  ) {
    const totalAssigned = answers.reduce(
      (sum, r) => (r.category !== null ? sum + r.count : sum),
      0,
    );

    const updated = categories.map((cat) => {
      const count = answers
        .filter((a) => a.category === cat.id)
        .reduce((s, r) => s + r.count, 0);

      const score =
        totalAssigned > 0 ? Math.round((count / totalAssigned) * 100) : 0;

      return {
        ...cat,
        count,
        score,
      };
    });

    updated.sort((a, b) => b.count - a.count || a.id - b.id);

    return updated.map((cat, idx) => ({ ...cat, position: idx + 1 }));
  }

  const updateAnswerRowCategory = (id: number) => {
    if (selectedCategory === null) return;

    setData((prevData) =>
      prevData?.map((question) => {
        if (question.id !== currentQuestion?.id) {
          return question;
        }

        const nextAnswers = question.answers.map((row) => {
          if (row.id !== id) return row;

          return {
            ...row,
            category:
              row.category === selectedCategory ? null : selectedCategory,
          };
        });

        return {
          ...question,
          answers: nextAnswers,
          categories: recomputeCategories(
            question.categories ?? [],
            nextAnswers,
          ),
        };
      }),
    );
  };

  const handleSaveQuestion = async () => {
    if (!currentQuestion) return;

    // Save the current question to the backend here
    await updateBoardStateQuestionCategories(
      currentQuestion.id,
      data!
        .filter((q) => q.id === currentQuestion.id)
        .flatMap(
          (q) =>
            q.categories
              ?.filter((c) => c.category.trim() !== "")
              .map((c) => ({
                question_id: q.id,
                category: c.category,
                count: c.count,
              })) ?? [],
        ),
    );
  };

  const handleStartGameFromThisQuestion = async () => {
    // Add checks to make sure no empty fields or empty questions before starting the game
  };

  const handleSaveAllQuestionsAndStartGame = async () => {
    // TODO add checks to make sure no empty fields or empty questions before starting the game

    // Send over the data variable without the answers
    const controllerData = data?.map((q) => ({
      id: q.id,
      question: q.question,
      categories: q.categories?.filter((c) => c.category.trim() !== ""),
    }));

    console.log("Controller data to be sent to backend:", controllerData);

    // Do not start the game if there are no categories or questions
    if (!controllerData) return;

    // Send the data to the backend here, then navigate to the controller page with the data as state
    await writeBoardState(
      controllerData
        .map(
          (q) =>
            q.categories?.map((c) => ({
              question_id: q.id,
              category: c.category,
              count: c.count,
            })) || [],
        )
        .flat(),
    );

    navigate("/controller", {
      state: {
        data: controllerData,
      },
    });
  };

  // Loading screen while we fetch questions from the API
  if (!currentQuestion || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-creator">
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
              Math.min(selectedQuestionIndex + 1, data.length - 1),
            )
          }
        >
          →
        </button>
      </div>

      <p className="question-text">{currentQuestion.question}</p>

      <div className="bottom-section">
        <div className="table-container">
          <div className="table-header">
            <span>position</span>
            <span>answer</span>
            <span>count</span>
            <span>score</span>
          </div>

          <div className="table-list">
            {categoryRows.map((item) => (
              <CategoryRow
                key={item.id}
                isSelected={selectedCategory === item.id}
                onCategoryChange={(value) => updateCategoryName(item.id, value)}
                onSelect={setSelectedCategory}
                {...item}
              />
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-header answers-header">
            <span>position</span>
            <span>answer</span>
            <span>count</span>
          </div>

          <div className="table-list">
            {answerRows?.map((item) => (
              <AnswerRow
                key={item.id}
                selectedCategory={selectedCategory}
                onAnswerRowClick={updateAnswerRowCategory}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        // Show start game button only on the last question
        className="button"
        onClick={handleSaveQuestion}
      >
        Save Question
      </button>
      <button
        // Show start game button only on the last question
        className="button"
        onClick={handleStartGameFromThisQuestion}
      >
        Start Game from This Question
      </button>
      <button
        // Show start game button only on the last question
        // This saves all questions and starts the game
        className={`button ${selectedQuestionIndex === data.length - 1 ? "" : "hidden"}`}
        onClick={handleSaveAllQuestionsAndStartGame}
      >
        Save All Questions & Start Game
      </button>
    </div>
  );
}
