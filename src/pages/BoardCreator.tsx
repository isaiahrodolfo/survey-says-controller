import { useState } from "react";

type CategoryRow = {
  id: number;
  answer: string;
  count: number;
  score: number;
  position: number;
};

type AnswerRow = {
  id: number;
  answer: string;
  count: number;
  categoryId: number | null;
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
    position: 1,
  },
];

const initialAnswerData: AnswerRow[] = [
  {
    id: 1,
    answer: "synth",
    count: 10,
    categoryId: null,
  },
  {
    id: 2,
    answer: "synthesizer",
    count: 5,
    categoryId: null,
  },
  {
    id: 3,
    answer: "sax",
    count: 3,
    categoryId: null,
  },
  {
    id: 4,
    answer: "saxophone",
    count: 2,
    categoryId: null,
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

      // Check if all rows are filled, if so add a new empty row
      const allFilled = nextRows.every((row) => row.answer.trim() !== "");
      let withAdded = nextRows;
      if (allFilled) {
        withAdded = [
          ...nextRows,
          {
            id: nextRows.length + 1,
            answer: "",
            count: 0,
            score: 0,
            position: nextRows.length + 1,
          },
        ];
      }

      // Update counts and scores but DO NOT reorder positions while typing to preserve input focus
      const totalAssigned = answerRows.reduce(
        (sum, r) => (r.categoryId !== null ? sum + r.count : sum),
        0,
      );

      const updated = withAdded.map((row) => {
        const count = answerRows
          .filter((a) => a.categoryId === row.id)
          .reduce((s, r) => s + r.count, 0);
        const score =
          totalAssigned > 0 ? Math.round((count / totalAssigned) * 100) : 0;

        return {
          ...row,
          count,
          score,
          position: row.position ?? row.id,
        };
      });

      return updated;
    });
  };

  function recomputeCategories(
    categories: CategoryRow[],
    answers: AnswerRow[],
  ) {
    const totalAssigned = answers.reduce(
      (sum, r) => (r.categoryId !== null ? sum + r.count : sum),
      0,
    );

    const updated = categories.map((cat) => {
      const count = answers
        .filter((a) => a.categoryId === cat.id)
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

    setAnswerRows((prevRows) => {
      const nextRows = prevRows.map((row) => {
        if (row.id !== id) return row;

        // Toggle: if the clicked answer already has the selected category, deselect it
        const newCategory =
          row.categoryId === selectedCategory ? null : selectedCategory;
        return { ...row, categoryId: newCategory };
      });

      // Recalculate category counts based on the sum of `count` on assigned answers
      // Recompute categories (counts, scores, and positions) from updated answers
      setCategoryRows((prevCategoryRows) =>
        recomputeCategories(prevCategoryRows, nextRows),
      );

      return nextRows;
    });
  };

  const CategoryRow = ({
    id,
    position,
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
      <span>{position}</span>

      <input
        className="answer-column"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />

      <span>{count}</span>

      <span>{score}</span>
    </div>
  );

  const AnswerRow = ({
    id,
    answer,
    count,
    categoryId,
    selectedCategory,
    onAnswerRowClick,
  }: AnswerRowProps) => (
    <div
      className={`table-row${categoryId === selectedCategory && selectedCategory !== null ? " selected" : ""}`}
      onClick={() => onAnswerRowClick(id)}
    >
      <span>{`${categoryId ?? "X"}`}</span>

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
