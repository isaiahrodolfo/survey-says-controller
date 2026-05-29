type ControllerCategoryRowProps = {
  id: number;
  category: string;
  isHidden: boolean;
  position: number | null;
  onClick: (id: number, isHidden: boolean) => void;
};

export const ControllerCategoryRow = ({
  id,
  category,
  isHidden,
  position,
  onClick,
}: ControllerCategoryRowProps) => (
  <div
    className={`table-row answers-row`}
    onClick={() => onClick(id, isHidden)}
  >
    <span>{position}</span>

    <span className="answer-column">{category}</span>

    <span>{`${isHidden ? "X" : "O"}`}</span>
  </div>
);
