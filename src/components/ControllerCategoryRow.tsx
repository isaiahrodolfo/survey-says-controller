import { useState } from "react";

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
  isHidden: initialIsHidden,
  position,
  onClick,
}: ControllerCategoryRowProps) => {
  const [isHidden, setIsHidden] = useState(initialIsHidden);

  const handleClick = () => {
    const next = !isHidden;
    setIsHidden(next);
    onClick(id, next);
  };

  return (
    <div className="table-row answers-row" onClick={handleClick}>
      <span>{position}</span>

      <span className="answer-column">{category}</span>

      <span>{isHidden ? "X" : "O"}</span>
    </div>
  );
};
