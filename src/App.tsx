import { useLayoutEffect, useContext } from "react";

import { GameContext, useGameContext } from "./GameContextProvider";

// 1 file -> 1 css
import styles from "./App.module.css";

import { Cell } from "./components/Cell";
import { Board } from "./components/Board";
import { Button } from "./components/Button";
import { Player } from "./lib/types";

import classNames from "classnames";

export type Move = {
  player: Player;
  index: number;
};

const MAX_MOVES = 9;

function App() {
  const {
    movesMade,
    tableState,
    activePlayer,
    winner,
    updateState,
    goBack,
    resetGame,
  } = useGameContext();

  useLayoutEffect(() => {
    switch (winner) {
      case "tie":
        console.log("It's a tie!!");
        alert("It's a tie!!");
        resetGame();
        break;

      case "X":
      case "O":
        console.log("The winner was: " + winner);
        alert("The winner was: " + winner);
        resetGame();
        break;
      default:
        break;
    }

    // const messages = {
    //   tie: "pareggio",
    //   X: "ha vinto il primo",
    //   O: "havinto il secondo",
    // };

    // if (!isNil(winner)) {
    //   const message = messages[winner]
    //   alert(message)
    //   resetGame()
    // }
    // if (winner === "tie") {
    //   console.log("It's a tie!!");
    //   alert("It's a tie!!");
    //   resetGame();
    // } else if (!isNil(winner)) {
    //   console.log("The winner was: " + winner);
    //   alert("The winner was: " + winner);
    //   resetGame();
    // }
  }, [winner]);

  return (
    <main className={styles.container}>
      <h1>Tic Tac Toe</h1>
      <Board>
        {tableState.map((cell) => {
          const index = cell.index;
          const isSelected = cell.value !== undefined;
          return (
            <Cell
              key={index}
              index={index}
              tableValue={cell.value}
              onPlayerClick={() => {
                if (!isSelected) {
                  updateState(index);
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
                activePlayer === "X" ? styles["symbol-X"] : styles["symbol-O"]
              )}
            >
              {activePlayer}
            </span>
          </div>
        </div>
        <div>
          <h2>Remaining moves</h2>
          <div className={styles.infoBox}>
            <span className={styles.label}>{MAX_MOVES - movesMade}</span>
          </div>
        </div>
      </section>
      <section className={styles.controls}>
        <div>
          <Button text="Back" disabled={movesMade === 0} onClick={goBack} />
        </div>
        <div>
          <Button
            text="Reset Game"
            disabled={movesMade === 0}
            onClick={resetGame}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
