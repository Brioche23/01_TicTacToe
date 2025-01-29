import { useState, useLayoutEffect, useEffect } from "react";

// 1 file -> 1 css
import styles from "./App.module.css";

import { Cell } from "./components/Cell";
import { Board } from "./components/Board";
import { Button } from "./components/Button";
import { range, keyBy, isNil } from "lodash";
import { CellState, Player } from "./lib/types";

import classNames from "classnames";

type Move = {
  player: Player;
  index: number;
};

const NORMALIZED_WIN_ARRAY = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
].map((a) => a.map((b) => b - 1));
const MAX_MOVES = 9;
const CELL_INDEXES = range(9);

function populateTable(moveHistory: Move[]) {
  const movesByIndex = keyBy(moveHistory, (move) => {
    return move.index;
  });

  const outputTable = CELL_INDEXES.map<CellState>((tIndex) => {
    const matchingMove = movesByIndex[tIndex];
    return { value: matchingMove?.player, index: tIndex };
  });

  return outputTable;
}

function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

function areValuesEquals<S>(values: S[], empty?: S) {
  return (
    values[0] === values[1] && values[0] === values[2] && values[0] !== empty
  );
}

function useMoveHistoryLocalStorage(initialValue: Move[]) {
  const key = "history";
  const [moveHistory, setTableHistory] = useState<Move[]>(() =>
    getMoveHistoryInLocalStorage()
  );

  function setMoveHistoryInLocalStorage(value: Move[]) {
    setTableHistory(value);
    localStorage.setItem(key, JSON.stringify(value));
    // const getLS = localStorage.getItem(key) ?? "[]";
    // console.log("LS", JSON.parse(getLS));
  }

  function getMoveHistoryInLocalStorage() {
    const getLS = localStorage.getItem(key);

    if (isNil(getLS)) {
      return initialValue;
    }

    try {
      return JSON.parse(getLS) as Move[];
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }

  // return { moveHistory, setMoveHistoryInLocalStorage };
  return [moveHistory, setMoveHistoryInLocalStorage] as const;
}

const tupla = [1, "2"] as const;
console.log(tupla);
const [s, d] = tupla;

function App() {
  const [moveHistory, setMoveHistoryInLocalStorage] =
    useMoveHistoryLocalStorage([]);
  // const { moveHistory: nomeVariabile, setMoveHistoryInLocalStorage } =
  //   useMoveHistoryLocalStorage<Move[]>([]);
  const movesMade = moveHistory.length;
  const tableState = populateTable(moveHistory);
  const activePlayer: Player = movesMade % 2 === 0 ? "X" : "O";

  useLayoutEffect(() => {
    if (
      movesMade > 4 &&
      NORMALIZED_WIN_ARRAY.filter((combo) =>
        areValuesEquals(
          // [
          //   tableState[combo[0]].value,
          //   tableState[combo[1]].value,
          //   tableState[combo[2]].value,
          // ],
          combo.map((c) => tableState[c].value)
        )
      ).length > 0
    ) {
      const winnerPlayer = getOpponent(activePlayer);
      console.log("The winner was: " + winnerPlayer);
      alert("The winner was: " + winnerPlayer);
      resetGame(); //Loop
    } else if (movesMade === 9) {
      console.log("It's a tie!!");
      alert("It's a tie!!");
      resetGame(); //Loop
    }
  }, [movesMade, tableState, activePlayer]);

  function handleCellClick(index: number) {
    updateState(index);
  }

  function updateState(cellIndex: number) {
    const newMove: Move = { player: activePlayer, index: cellIndex };
    // const newHistory = moveHistory.concat(newMove)
    const newHistory = [...moveHistory, newMove];

    setMoveHistoryInLocalStorage(newHistory);
    // setTableHistory(newHistory);
    // localStorage.setItem( "history",JSON.stringify(newHistory));
    // const getLS = localStorage.getItem("history") ?? "[]";
    // console.log("LS", JSON.parse(getLS));
  }

  function goBack() {
    const newHistory = moveHistory.slice(0, -1);
    setMoveHistoryInLocalStorage(newHistory);
  }

  function resetGame() {
    setMoveHistoryInLocalStorage([]);
  }

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
                  handleCellClick(index);
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
          <Button
            text="Back"
            disabled={moveHistory.length === 0}
            onClick={goBack}
          />
        </div>
        <div>
          <Button
            text="Reset Game"
            disabled={moveHistory.length === 0}
            onClick={resetGame}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
