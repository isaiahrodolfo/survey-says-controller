import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ControllerCategoryRow } from "../components/ControllerCategoryRow";
import type {
  BoardCreatorCategory,
  BoardCreatorQuestion,
} from "./BoardCreator";

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
  const [questions, setQuestions] = useState<ControllerQuestion[]>(
    // Add a isHidden field to each category
    location.state?.questions.map((question: BoardCreatorQuestion) => ({
      ...question,
      categories: question.categories
        // Filter out empty categories (those with an empty string as the category name)
        ?.filter(
          (category: BoardCreatorCategory) => category.category.trim() !== "",
        )
        .map((category: BoardCreatorCategory) => ({
          ...category,
          isHidden: true,
        })),
    })) || [],
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const currentQuestion = questions[selectedQuestionIndex] ?? questions[0];
  const controllerCategories = currentQuestion.categories ?? [];

  function handleToggleIsHidden(id: number, isHidden: boolean) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id !== currentQuestion.id) {
          return question;
        }

        const categories = question.categories?.map((category) => {
          if (category.id !== id) {
            return category;
          }

          return {
            ...category,
            isHidden: !isHidden, // Toggle the isHidden value
          };
        });

        return {
          ...question,
          categories,
        };
      }),
    );
  }

  function handleQuestionChange(newIndex: number) {
    setSelectedQuestionIndex(newIndex);
  }

  // const controllerCategoryRows = [
  //   {
  //     id: 1,
  //     category: "Category 1",
  //     isHidden: false,
  //     position: 1,
  //   },
  //   {
  //     id: 2,
  //     category: "Category 2",
  //     isHidden: true,
  //     position: 2,
  //   },
  //   {
  //     id: 3,
  //     category: "Category 3",
  //     isHidden: false,
  //     position: null,
  //   },
  // ];

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
              onClick={handleToggleIsHidden}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
