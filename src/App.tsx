import { useState } from "react";
import "./App.css";
import { Cell } from "./components/Cell";

import { range } from "lodash";

function createInitialTableState() {
  const table = range(1, 10).map((index) => ({ index, value: "" }));
  return table;
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

  console.log(matrix);

  return matrix;
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

  const winArrays = [
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
  const normalizedWinArrays = winArrays.map((a) => a.map((b) => b - 1));

  const maxMoves = 9;
  const [activePlayer, setActivePlayer] = useState("X");
  const [tableState, setTableState] = useState(createInitialTableState);
  const movesMade = tableState.filter((a) => a.value !== "").length;

  function handleCellClick(index: number) {
    updateTable(index);
    checkWinner();
    switchPlayer();
  }

  function switchPlayer() {
    setActivePlayer(activePlayer == "X" ? "O" : "X");
  }

  function updateTable(cellIndex: number) {
    const newTableState = [...tableState];
    newTableState[cellIndex].value = activePlayer;
    setTableState(newTableState);
  }

  function resetGame() {
    setTableState(createInitialTableState()); //Con parentesi -> perché altrimenti prende come prop lo stato precedente
    setActivePlayer("X");
  }

  function checkWinner() {
    if (movesMade > 4) {
      const winCombo = normalizedWinArrays.filter(
        (combo) =>
          tableState[combo[0]].value == tableState[combo[1]].value &&
          tableState[combo[0]].value == tableState[combo[2]].value &&
          tableState[combo[0]].value != ""
      );
      console.log(winCombo);

      // Usa il filter, se lenght è maggiore di 0 è vittoria
      if (winCombo.length > 0) alert("The winner was: " + activePlayer);
    }
  }

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <div className="board">
        <table>
          <tbody>
            {splitArrayToMatrix(tableState, 3).map((row, index) => (
              <tr key={index}>
                {row.map((value) => (
                  <Cell
                    key={value.index - 1}
                    index={value.index - 1}
                    tableValue={tableState}
                    onPlayerClick={handleCellClick}
                  />
                ))}
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
          <p>{maxMoves - movesMade}</p>
        </div>
      </section>
      <div>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </>
  );
}

export default App;
