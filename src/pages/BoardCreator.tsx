import { useState } from "react";

type CategoryRow = {
  id: number;
  answer: string;
  count: number;
  score: number;
};

type AnswerRow = {
  id: number;
  answer: string;
  count: number;
  category: number | null;
};

type CategoryRowProps = CategoryRow & {
  onAnswerChange: (value: string) => void;
  isSelected: boolean;
};

type AnswerRowProps = AnswerRow & {
  selectedCategory: number | null;
  onAnswerRowClick: (id: number) => void;
};

const initialCategoryData: CategoryRow[] = [
  {
    id: 1,
    answer: "",
    count: 0,
    score: 0,
  },
];

const initialAnswerData: AnswerRow[] = [
  {
    id: 1,
    answer: "synth",
    count: 10,
    category: null,
  },
  {
    id: 2,
    answer: "synthesizer",
    count: 5,
    category: null,
  },
  {
    id: 3,
    answer: "sax",
    count: 3,
    category: null,
  },
  {
    id: 4,
    answer: "saxophone",
    count: 2,
    category: null,
  },
];

export default function BoardCreator() {
  const [categoryRows, setCategoryRows] =
    useState<CategoryRow[]>(initialCategoryData);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [answerRows, setAnswerRows] = useState<AnswerRow[]>(initialAnswerData);

  const updateCategoryAnswer = (id: number, answer: string) => {
    setCategoryRows((prevRows) => {
      const nextRows = prevRows.map((row) =>
        row.id === id ? { ...row, answer } : row,
      );

      const allFilled = nextRows.every((row) => row.answer.trim() !== "");
      if (allFilled) {
        return [
          ...nextRows,
          {
            id: nextRows.length + 1,
            answer: "",
            count: 0,
            score: 0,
          },
        ];
      }

      return nextRows;
    });
  };

  const updateAnswerRowCategory = (id: number) => {
    if (selectedCategory === null) return;

    setAnswerRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, category: selectedCategory } : row,
      ),
    );
  };

  const CategoryRow = ({
    id,
    answer,
    count,
    score,
    onAnswerChange,
    isSelected,
  }: CategoryRowProps) => (
    <div
      className={`table-row${isSelected ? " selected" : ""}`}
      onClick={() => setSelectedCategory(id)}
    >
      <span>{id}</span>

      <input
        className="answer-column"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
      />

      <span>{count}</span>

      <span>{score}</span>
    </div>
  );

  const AnswerRow = ({
    id,
    answer,
    count,
    category,
    selectedCategory,
    onAnswerRowClick,
  }: AnswerRowProps) => (
    <div
      className={`table-row${category === selectedCategory && selectedCategory !== null ? " selected" : ""}`}
      onClick={() => onAnswerRowClick(id)}
    >
      <span>{id}</span>

      <span className="answer-column">{answer}</span>

      <span>{count}</span>
    </div>
  );

  return (
    <div className="board-creator">
      <div className="question-selector">
        <button className="arrow-button">←</button>

        <h2 className="question-number">Question #1</h2>

        <button className="arrow-button">→</button>
      </div>

      <p className="question-text">What is your favorite Nintendo franchise?</p>

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
                {...item}
                isSelected={selectedCategory === item.id}
                onAnswerChange={(value) => updateCategoryAnswer(item.id, value)}
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
            {answerRows.map((item) => (
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

      <button className="start-game-button">Start Game</button>
    </div>
  );
}
