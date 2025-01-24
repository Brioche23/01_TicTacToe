import { useState, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { Cell } from "./components/Cell";

import { range } from "lodash";
import { CellState, Player } from "./lib/types";

type Move = {
  player: Player;
  index: number;
};

const WIN_ARRAYS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];
//Reducing all by -1
const NORMALIZED_WIN_ARRAY = WIN_ARRAYS.map((a) => a.map((b) => b - 1));
const MAX_MOVES = 9;
const INITIAL_TABLE = createInitialTableState();

function createInitialTableState() {
  const table = range(1, 10).map<CellState>((index) => ({ index }));
  return table;
}

function populateTable(moveHistory: Move[]) {
  // ? Come non generarla tutte le volte?
  // const table = range(1, 10).map<CellState>((index) => ({ index }));

  // ! Logica sbagliata, ma funziona??
  const t2 = INITIAL_TABLE.reduce<CellState[]>((acc, e, redIndex) => {
    e.value = undefined;
    moveHistory.map((move) => {
      if (redIndex === move.index) {
        e.value = move.player;
      }
    });
    acc.push(e);
    return acc;
  }, []);

  // const t2 = table.map((cell, tIndex) => {
  //   const filter = moveHistory.filter((move) => tIndex === move.index);
  //   console.log(filter);
  //   cell.value = filter[0].player;
  // });
  // const t2 = table.map((cell, tIndex) => {
  //     moveHistory.map((move) => {
  //     if (tIndex === move.index) {
  //       cell.value = move.player;
  //       return cell.value;
  //     }
  //   });
  // });

  // console.log("Table: ");
  // console.log(table);
  console.log("T2: ");
  console.log(t2);

  return t2;
}

// TODO Fare versione in cui passo la tabella corrente + la nuova mossa!
function populateTable2(
  lastMove: Move,
  lastTableState: CellState[] = INITIAL_TABLE
) {
  if (lastMove) {
    // const newTableCell:CellState = {value:lastMove.player, index:lastTableState[]}
    const newTableState = lastTableState.splice(lastMove.index, 1, lastMove);
    console.log(newTableState);

    return newTableState;
  } else return lastTableState;
}

function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

//Utils
// <T> -> Type variable
function splitArrayToMatrix<T>(startArray: T[], n: number) {
  const matrix = startArray.reduce<T[][]>((acc, value, index, arr) => {
    if (acc.length === 0) acc.push([]); //At least one element
    const row = acc[acc.length - 1];
    row.push(value);
    if (row.length === n && arr.length - 1 !== index) {
      acc.push([]);
    }
    return acc;
  }, []);

  // console.log(matrix);

  return matrix;
}

function compareThreeValues<S>(a: S, b: S, c: S, empty: S) {
  return a == b && a == c && a != empty;
}

function App() {
  /* IMMUTABILITY
  function immutabilityConcepts(){
  const array = [1, 2, 3, 4, 5];
  console.log(array);

  const array2x = array.map((a) => a * 2);
  console.log(array2x);
  console.log(array);
  console.log(array);

  const arrayEven = array.filter((a) => a % 2 === 0);
  console.log(arrayEven);

  let sum = 0;
  array.forEach((e) => {
    sum += e;
  });

  const sumReduce = array.reduce((acc, e) => {
    acc += e;
    return acc;
  }, 0);
  console.log(sumReduce);

  const filterReduce = array.reduce<number[]>((acc, e) => {
    //Push e pop
    if (e % 2 === 0) acc.push(e);
    return acc;
  }, []);
  console.log(filterReduce);}
  */

  const [moveHistory, setTableHistory] = useState<Move[]>([]);
  // const [tableState, setTableState] = useState(createInitialTableState);
  const movesMade = moveHistory.length;
  const tableState = populateTable(moveHistory);
  const activePlayer: Player = movesMade % 2 === 0 ? "X" : "O";

  console.log(moveHistory);
  console.log(tableState);

  useLayoutEffect(() => {
    if (
      movesMade > 4 &&
      NORMALIZED_WIN_ARRAY.filter((combo) =>
        compareThreeValues(
          tableState[combo[0]].value,
          tableState[combo[1]].value,
          tableState[combo[2]].value,
          undefined
        )
      ).length > 0
    ) {
      const winnerPlayer = getOpponent(activePlayer);
      //! Avviene 2 volte, come mai? -> useEffect
      console.log("The winner was: " + winnerPlayer);
      alert("The winner was: " + winnerPlayer);
      resetGame(); //Loop
    }

    if (movesMade === 9) {
      console.log("It's a tie!!");
      alert("It's a tie!!");
      resetGame(); //Loop
    }
  }, [movesMade, tableState, activePlayer]);

  function handleCellClick(index: number) {
    updateState(index);
  }

  function updateState(cellIndex: number) {
    // const newTableState = [...tableState];
    // newTableState[cellIndex].value = activePlayer;
    // setTableState(newTableState);

    const newMove: Move = { player: activePlayer, index: cellIndex };
    setTableHistory(moveHistory.concat(newMove));
  }

  function goBack() {
    setTableHistory(moveHistory.slice(0, -1));
  }

  function resetGame() {
    setTableHistory([]);
    // setTableState(createInitialTableState()); //Con parentesi -> perché altrimenti prende come prop lo stato precedente
  }

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <div className="board">
        <table>
          <tbody>
            {splitArrayToMatrix(tableState, 3).map((row, index) => (
              <tr key={index}>
                {row.map((cell) => {
                  const index = cell.index - 1;
                  const isSelected = cell.value !== undefined;
                  return (
                    <Cell
                      key={index}
                      index={index}
                      tableValue={cell.value}
                      isSelected={isSelected}
                      onPlayerClick={() => {
                        if (!isSelected) {
                          handleCellClick(index);
                        }
                      }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="info">
        <div>
          <h2>It's the turn of</h2>
          <div className="player-box">
            <span className={activePlayer == "X" ? "symbol-X" : "symbol-O"}>
              {activePlayer}
            </span>
          </div>
        </div>
        <div>
          <h2>Remaining moves</h2>
          <p>{MAX_MOVES - movesMade}</p>
        </div>
      </section>
      <section className="controls">
        <div>
          <button
            onClick={() => {
              if (moveHistory.length > 0) goBack();
            }}
          >
            Back
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (moveHistory.length > 0) resetGame();
            }}
          >
            Reset Game
          </button>
        </div>
      </section>
    </>
  );
}

export default App;
