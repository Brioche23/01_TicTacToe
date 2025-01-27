// Type of properties = NameOfComponentProps

import { CellState } from "../lib/types";
interface CellProps {
  index: number; //VSCode -> F2
  tableValue: CellState["value"];
  isSelected: boolean;
  onPlayerClick: () => void; //Function type too generic -> specify function
}

export function Cell({
  index,
  tableValue,
  isSelected,
  onPlayerClick,
}: CellProps) {
  return (
    <td
      className="cell"
      onClick={() => {
        onPlayerClick();
      }}
    >
      <p className={isSelected ? " symbol-" + tableValue : ""}>{tableValue}</p>
      <p className="coords">{`${index}`}</p>
    </td>
  );
}
