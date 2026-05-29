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
      categories: question.categories?.map(
        (category: BoardCreatorCategory) => ({
          ...category,
          isHidden: true,
        }),
      ),
    })) || [],
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const currentQuestion = questions[selectedQuestionIndex] ?? questions[0];
  const controllerCategories = currentQuestion.categories ?? [];

  function handleToggleIsHidden(id: number, isHidden: boolean) {}

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
      <div className="table-container">
        <div className="table-header answers-header">
          <span>position</span>
          <span>answer</span>
          <span>count</span>
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
