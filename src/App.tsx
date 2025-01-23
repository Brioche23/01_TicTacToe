import { cloneElement, ReactElement, useState } from "react";
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
  const row: T[] = [];
  const matrix: T[][] = [];
  // TODO Da fare con REDUCE
  startArray.forEach((value, index) => {
    row.push(value);
    if ((index + 1) % n === 0) {
      matrix.push([...row]);
      row.length = 0;
    }
  });

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

  // const table = [
  //   { index: 1, value: "" },
  //   { index: 2, value: "" },
  //   { index: 3, value: "" },
  //   { index: 4, value: "" },
  //   { index: 5, value: "" },
  //   { index: 6, value: "" },
  //   { index: 7, value: "" },
  //   { index: 8, value: "" },
  //   { index: 9, value: "" },
  // ];

  // const t = _.range(9); //Array da 1 parametro -> (0,8)

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

  // function countMoves() {
  //   /**
  //    *  let movesMade = 0; //let cambia nel tempo -> usa funzioni pure
  //    * tableState.forEach((cell) => {
  //    * if (cell.value == "") movesMade++;
  //    * });
  //    */
  //   //let cambia nel tempo -> usa funzioni pure
  //   // ! QUA
  //   return movesMade.length;
  // }

  function handleCellClick(index: number) {
    updateTable(index);
    checkWinner();
    switchPlayer();
  }

  function switchPlayer() {
    // ! QUA
    setActivePlayer(activePlayer == "X" ? "O" : "X");
  }

  function updateTable(cellIndex: number) {
    // ! QUA!!
    // const newTableState = tableState.map((obj, index) => ); NAHHH

    const newTableState = [...tableState];
    newTableState[cellIndex].value = activePlayer;
    setTableState(newTableState);
  }

  function resetGame() {
    setTableState(createInitialTableState()); //Con parentesi -> perché altrimenti prende come prop lo stato precedente
    setActivePlayer("X");
  }

  function checkWinner() {
    // Da fare solo dopo la 5 mossa
    // let victoryCondition = false;
    // normalizedWinArrays.forEach((combo) => {
    //   if (
    //     tableState[combo[0]].value == tableState[combo[1]].value &&
    //     tableState[combo[0]].value == tableState[combo[2]].value &&
    //     tableState[combo[0]].value != ""
    //   ) {
    //     victoryCondition = true;
    //   }
    // });

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

  function populateTable() {
    const matrix = splitArrayToMatrix(tableState, 3);

    return matrix.map((row) =>
      row.map((value) => (
        <Cell
          key={value.index - 1}
          index={value.index - 1}
          tableValue={tableState}
          onPlayerClick={handleCellClick}
        />
      ))
    );

    // tableState.forEach((_cell, index) => {
    //   // console.log(index);

    //   cellArray.push(
    //     <Cell
    //       key={index}
    //       index={index}
    //       tableValue={tableState}
    //       onPlayerClick={handleCellClick}
    //     />
    //   );
    //   // console.log("Length after push: " + cellArray.length);

    //   if ((index + 1) % 3 == 0) {
    //     rowsArray.push([...cellArray]);
    //     cellArray.length = 0;
    //   }
    // });
    // console.log(rowsArray);
  }

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <div className="board">
        <table>
          <tbody>
            {populateTable().map((row) => (
              <tr>{row}</tr>
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
