import { useState } from "react";
import { CategoryRow } from "../components/CategoryRow";

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
  category: number | null;
};

type QuestionGroup = {
  id: number;
  question: string;
  answers: AnswerRow[];
  categories?: CategoryRow[];
};

type AnswerRowProps = AnswerRow & {
  selectedCategory: number | null;
  onAnswerRowClick: (id: number) => void;
};

// const initialCategoryData: CategoryRow[] = [
//   {
//     id: 1,
//     answer: "",
//     count: 0,
//     score: 0,
//     position: 1,
//   },
// ];

const initialQuestions: QuestionGroup[] = [
  {
    id: 1,
    question: "What instrument do you want to see?",
    answers: [
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
    ],
  },
  {
    id: 2,
    question: "Where do you want to go next?",
    answers: [
      {
        id: 1,
        answer: "hiking",
        count: 12,
        category: null,
      },
      {
        id: 2,
        answer: "trail",
        count: 8,
        category: null,
      },
      {
        id: 3,
        answer: "bowling",
        count: 6,
        category: null,
      },
      {
        id: 4,
        answer: "camping",
        count: 15,
        category: null,
      },
    ],
  },
];

function createInitialCategory(): CategoryRow {
  return {
    id: 1,
    answer: "",
    count: 0,
    score: 0,
    position: 1,
  };
}

export default function BoardCreator() {
  const [questions, setQuestions] = useState<QuestionGroup[]>(
    initialQuestions.map((question) => ({
      ...question,
      categories: question.categories ?? [createInitialCategory()],
    })),
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const currentQuestion = questions[selectedQuestionIndex] ?? questions[0];
  const answerRows = currentQuestion.answers;
  const categoryRows = currentQuestion.categories ?? [];

  const handleQuestionChange = (newIndex: number) => {
    setSelectedQuestionIndex(newIndex);
    setSelectedCategory(null);
  };

  const updateCategoryAnswer = (id: number, answer: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id !== currentQuestion.id) {
          return question;
        }

        const categories = question.categories ?? [];

        const nextCategories = categories.map((row) =>
          row.id === id ? { ...row, answer } : row,
        );

        const allFilled = nextCategories.every(
          (row) => row.answer.trim() !== "",
        );

        let withAdded = nextCategories;

        if (allFilled) {
          withAdded = [
            ...nextCategories,
            {
              id: nextCategories.length + 1,
              answer: "",
              count: 0,
              score: 0,
              position: nextCategories.length + 1,
            },
          ];
        }

        return {
          ...question,
          categories: recomputeCategories(withAdded, question.answers),
        };
      }),
    );
  };

  function recomputeCategories(
    categories: CategoryRow[],
    answers: AnswerRow[],
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

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id !== currentQuestion.id) {
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

  const AnswerRow = ({
    id,
    answer,
    count,
    category,
    selectedCategory,
    onAnswerRowClick,
  }: AnswerRowProps) => (
    <div
      className={`table-row${category === selectedCategory && selectedCategory !== null ? " selected" : ""} answers-row`}
      onClick={() => onAnswerRowClick(id)}
    >
      <span>{`${category ?? "X"}`}</span>

      <span className="answer-column">{answer}</span>

      <span>{count}</span>
    </div>
  );

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
              Math.min(selectedQuestionIndex + 1, questions.length - 1),
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
                {...item}
                isSelected={selectedCategory === item.id}
                onAnswerChange={(value) => updateCategoryAnswer(item.id, value)}
                onSelect={setSelectedCategory}
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
