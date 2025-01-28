// Type of properties = NameOfComponentProps

import { CellState } from "../lib/types";
import styles from "../Cell.module.css";
import classNames from "classnames";

interface CellProps {
  index: number; //VSCode -> F2
  tableValue: CellState["value"];
  onPlayerClick: () => void; //Function type too generic -> specify function
}

export function Cell({ index, tableValue, onPlayerClick }: CellProps) {
  const playerClass = classNames(
    tableValue === "X" ? styles["symbol-X"] : styles["symbol-O"]
  );
  return (
    <div
      className={styles.cell}
      onClick={() => {
        onPlayerClick();
      }}
    >
      <p className={playerClass}>{tableValue}</p>
      <span className={styles.coords}>{`${index}`}</span>
    </div>
  );
}
