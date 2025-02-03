import { useLayoutEffect } from "react";
import { observer } from "mobx-react-lite";
// 1 file -> 1 css
import styles from "./App.module.css";

import { Cell } from "./components/Cell";
import { Board } from "./components/Board";
import { Button } from "./components/Button";

import classNames from "classnames";
import { useMst } from "./state";

const MAX_MOVES = 9;

const App = observer(() => {
  const mst = useMst();

  console.log("mst", mst.moves.length);
  useLayoutEffect(() => {
    switch (mst.winner) {
      case "tie":
        console.log("It's a tie!!");
        alert("It's a tie!!");
        mst.resetGame();
        break;

      case "X":
      case "O":
        console.log("The winner was: " + mst.winner);
        alert("The winner was: " + mst.winner);
        mst.resetGame();
        break;
      default:
        break;
    }
  }, [mst.winner]);

  return (
    <main className={styles.container}>
      <h1>Tic Tac Toe</h1>
      <Board>
        {mst.tableState.map((cell) => {
          const index = cell.index;
          return (
            <Cell
              key={index}
              index={index}
              tableValue={cell.player}
              onPlayerClick={() => {
                if (!cell.isSelected) {
                  mst.updateState(index);
                }
              }}
            />
          );
        })}
      </Board>
      <section className={styles.info}>
        <div>
          <h2>It's the turn of</h2>
          <div className={styles.infoBox}>
            <span
              className={classNames(
                styles.label,
                mst.activePlayer === "X"
                  ? styles["symbol-X"]
                  : styles["symbol-O"]
              )}
            >
              {mst.activePlayer}
            </span>
          </div>
        </div>
        <div>
          <h2>Remaining moves</h2>
          <div className={styles.infoBox}>
            <span className={styles.label}>{MAX_MOVES - mst.movesMade}</span>
          </div>
        </div>
      </section>
      <section className={styles.controls}>
        <div>
          <Button
            text="Back"
            disabled={mst.movesMade === 0}
            onClick={mst.goBack}
          />
        </div>
        <div>
          <Button
            text="Reset Game"
            disabled={mst.movesMade === 0}
            onClick={mst.resetGame}
          />
        </div>
      </section>
    </main>
  );
});
export default App;
