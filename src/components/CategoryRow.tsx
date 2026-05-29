type CategoryRowProps = {
  id: number;
  answer: string;
  count: number;
  score: number;
  position: number;
  onAnswerChange: (value: string) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
};

export const CategoryRow = ({
  id,
  position,
  answer,
  count,
  score,
  onAnswerChange,
  onSelect,
  isSelected,
}: CategoryRowProps) => (
  <div
    className={`table-row${isSelected ? " selected" : ""}`}
    onClick={() => onSelect(id)}
  >
    <span>{position}</span>

    <input
      className="answer-column"
      value={answer}
      onChange={(e) => {
        onAnswerChange(e.target.value);
      }}
    />

    <span>{count}</span>

    <span>{score}</span>
  </div>
);
