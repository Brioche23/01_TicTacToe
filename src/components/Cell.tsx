// Type of properties = NameOfComponentProps

import { observer } from "mobx-react-lite";
import { CellState } from "../lib/types";
import { MoveInstance } from "../state/MoveModel";
import styles from "./Cell.module.css";
import classNames from "classnames";

interface CellProps {
  index: number; //VSCode -> F2
  tableValue: CellState["player"];
  onPlayerClick: () => void; //Function type too generic -> specify function
}

export const Cell = observer(
  ({ index, tableValue, onPlayerClick }: CellProps) => {
    const playerClass = classNames(
      tableValue === "X" ? styles["symbol-X"] : styles["symbol-O"]
    );
    // console.log(useContext(GameContext));
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
);
