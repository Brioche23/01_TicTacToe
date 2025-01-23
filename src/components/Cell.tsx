type TableObject = {
  index: number;
  value: string;
};

// Type of properties = NameOfComponentProps
interface CellProps {
  index: number; //VSCode -> F2
  tableValue: string;
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
      <p
        className={isSelected ? " symbol-" + tableValue : ""}
      >{`${tableValue}`}</p>
      <p className="coords">{`${index}`}</p>
    </td>
  );
}
