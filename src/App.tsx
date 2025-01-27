import { useState, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { Cell } from "./components/Cell";

import { range, keyBy } from "lodash";
import { CellState, Player } from "./lib/types";

type Move = {
  player: Player;
  index: number;
};

//Reducing all by -1
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

const arr = [
  { a: 1, b: { c: 10 } },
  { a: 2, b: { c: 11 } },
  { a: 3, b: { c: 12 } },
];
const aDouble = arr.map((element) => {
  //! a.a = a.a * 2;  NO reassign values
  const el2 = {
    ...element,
    a: element.a * 2,
    b: { ...element.b, c: element.b.c * 2 },
  }; // Created a copy with OTHER Refs
  // el2.a *= 2; // Copy of a
  // el2.b.c *= 2; // Not a copy... Only of Parent. c is a reference
  return el2;
});

console.log("aDouble", aDouble);
console.log("arr", arr);

function binarySearchMove(arr: Move[], target: number) {
  var low = 0;
  var high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    console.log("low: " + low);
    console.log("high: " + high);
    console.log("mid: " + mid);
    if (arr[mid].index === target) {
      return mid; // Target found
    } else if (arr[mid].index < target) {
      low = mid + 1; // Discard the left half
    } else {
      high = mid - 1; // Discard the right half
    }
  }
  return -1; // Target not found
}

function populateTable(moveHistory: Move[]) {
  console.log(moveHistory);

  // Dictionary => Object con key as strings
  //! O(N)
  const movesByIndex = keyBy(moveHistory, (move) => {
    return move.index;
  });
  console.log(movesByIndex);

  //?? O(n^2) --> O(M)
  // Cell state is alreday sorted
  //? O(M) -> 9
  const outputTable = CELL_INDEXES.map<CellState>((tIndex) => {
    // Con Lodash -> keyBy / GroupBy
    // Trn moveH into object key:{Move}
    // const matchingMove = moveHistory.find(
    //   /* //? O(n) -> from 0 to 9
    //    * To Achieve o(log(n)) dovrei usare una Binary Search
    //    */
    //   (move) => move.index === tIndex
    // );
    //! O(1)
    const matchingMove = movesByIndex[tIndex];

    // const moveIndex = binarySearchMove(moveHistory, tIndex);
    //   console.log(moveIndex);
    //   const matchingMove = moveIndex !== -1 ? moveHistory[moveIndex];

    console.log("TIndex: ", tIndex);
    console.log("MM", matchingMove);
    return { value: matchingMove?.player, index: tIndex };
  });

  console.log("outputTable: ");
  console.log(outputTable);

  return outputTable;
}

function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

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
  const movesMade = moveHistory.length;
  const tableState = populateTable(moveHistory);
  const activePlayer: Player = movesMade % 2 === 0 ? "X" : "O";

  // console.log(moveHistory);
  // console.log(tableState);

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
    const newMove: Move = { player: activePlayer, index: cellIndex };
    setTableHistory(moveHistory.concat(newMove));
  }

  function goBack() {
    setTableHistory(moveHistory.slice(0, -1));
  }

  function resetGame() {
    setTableHistory([]);
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
                  const index = cell.index;
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
