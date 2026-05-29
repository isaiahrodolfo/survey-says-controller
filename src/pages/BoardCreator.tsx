import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryRow } from "../components/CategoryRow";
import { AnswerRow } from "../components/AnswerRow";

export type BoardCreatorQuestion = {
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

const initialQuestions: BoardCreatorQuestion[] = [
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

function createInitialCategory(): BoardCreatorCategory {
  return {
    id: 1,
    category: "",
    count: 0,
    score: 0,
    position: 1,
  };
}

export default function BoardCreator() {
  const [questions, setQuestions] = useState<BoardCreatorQuestion[]>(
    // Add an initial category to each question if not present
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

  const navigate = useNavigate();

  const handleQuestionChange = (newIndex: number) => {
    setSelectedQuestionIndex(newIndex);
    setSelectedCategory(null);
  };

  const updateCategoryName = (id: number, category: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id !== currentQuestion.id) {
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

  const handleStartGame = () => {
    // TODO add checks to make sure no empty fields or empty questions before starting the game
    navigate("/controller", {
      state: {
        // Send over the questions variable without the answers
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          categories: q.categories,
        })),
      },
    });
  };

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

      <button className="start-game-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
}
