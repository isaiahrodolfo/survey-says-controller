type ControllerCategoryRowProps = {
  id: number;
  category: string;
  isHidden: boolean;
  position: number | null;
  handleClick: (id: number, isHidden: boolean) => void;
};

export const ControllerCategoryRow = ({
  id,
  category,
  isHidden,
  position,
  handleClick,
}: ControllerCategoryRowProps) => {
  return (
    <div
      className="table-row answers-row"
      onClick={() => handleClick(id, isHidden)}
    >
      <span>{position}</span>

      <span className="answer-column">{category}</span>

      <span>{isHidden ? "X" : "O"}</span>
    </div>
  );
};
