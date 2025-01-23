type TableObject = {
  index: number;
  value: string;
};

// Type of properties = NameOfComponentProps
interface CellProps {
  index: number; //VSCode -> F2
  tableValue: TableObject[];
  onPlayerClick: Function;
}
export function Cell({ index, tableValue, onPlayerClick }: CellProps) {
  //! QUA
  const isSelected = tableValue[index].value == "" ? false : true;
  return (
    <td
      className="cell"
      onClick={(e) => {
        if (!isSelected) {
          console.log("clicked " + index);
          onPlayerClick(index);
        }
      }}
    >
      <p
        className={isSelected ? " symbol-" + tableValue[index].value : ""}
      >{`${tableValue[index].value}`}</p>
      <p className="coords">{`${index}`}</p>
    </td>
  );
}
