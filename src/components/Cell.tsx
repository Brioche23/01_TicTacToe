type TableObject = {
  index: number;
  value: string;
};

// Type of properties = NameOfComponentProps
interface CellProps {
  index: number; //VSCode -> F2
  value: string;
  tableValue: TableObject[];
  onPlayerClick: Function;
}
export function Cell({ index, value, tableValue, onPlayerClick }: CellProps) {
  let isSelected = tableValue[index].value == "" ? false : true;
  let symbolClass = "";

  return (
    <td
      className="cell"
      onClick={(e) => {
        if (!isSelected) {
          console.log("clicked " + index);
          onPlayerClick(index);
          symbolClass = " symbol-" + value;
        }
      }}
    >
      <p className={symbolClass}>{`${tableValue[index].value}`}</p>
      <p className="coords">{`${index}`}</p>
    </td>
  );
}
