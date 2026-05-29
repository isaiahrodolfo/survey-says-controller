type CategoryRowProps = {
  id: number;
  category: string;
  count: number;
  score: number;
  position: number;
  onCategoryChange: (value: string) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
};

export const CategoryRow = ({
  id,
  position,
  category,
  count,
  score,
  onCategoryChange,
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
      value={category}
      onChange={(e) => {
        onCategoryChange(e.target.value);
      }}
    />

    <span>{count}</span>

    <span>{score}</span>
  </div>
);
