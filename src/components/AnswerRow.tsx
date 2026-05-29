type AnswerRowProps = {
  id: number;
  answer: string;
  count: number;
  category: number | null;
  selectedCategory: number | null;
  onAnswerRowClick: (id: number) => void;
};

export const AnswerRow = ({
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
