import { ReactElement, useState } from "react";
import "./App.css";
import { Cell } from "./components/Cell";

type MatrixRow = ReactElement[];

function App() {
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
  console.log(filterReduce);

  const table = [
    { index: 1, value: "" },
    { index: 2, value: "" },
    { index: 3, value: "" },
    { index: 4, value: "" },
    { index: 5, value: "" },
    { index: 6, value: "" },
    { index: 7, value: "" },
    { index: 8, value: "" },
    { index: 9, value: "" },
  ];

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

  // const maxMoves = 9;
  const [activePlayer, setActivePlayer] = useState("X");
  const [tableState, setTableState] = useState(table);

  function countMoves() {
    let movesMade = 0; //let cambia nel tempo -> usa funzioni pure
    tableState.forEach((cell) => {
      //
      if (cell.value == "") movesMade++;
    });
    return movesMade;
  }

  function handleCellClick(index: number) {
    updateTable(index);
    checkWinner();
    switchPlayer();
  }

  function switchPlayer() {
    let newPlayer = activePlayer == "X" ? "O" : "X";
    setActivePlayer(newPlayer);
  }

  function updateTable(index: number) {
    let newTableState = [...tableState];
    newTableState[index].value = activePlayer;
    setTableState(newTableState);
  }

  function checkWinner() {
    // Da fare solo dopo la 5 mossa
    let victoryCondition = false;
    winArrays.forEach((combo) => {
      if (
        tableState[combo[0]].value == tableState[combo[1]].value &&
        tableState[combo[0]].value == tableState[combo[2]].value &&
        tableState[combo[0]].value != ""
      ) {
        victoryCondition = true;
      }
    });
    console.log(victoryCondition);
  }

  function populateTable() {
    const cellArray: MatrixRow = [];
    const rowsArray: MatrixRow[] = [];

    table.forEach((cell, index) => {
      console.log(index);

      cellArray.push(
        <Cell
          key={index}
          index={index}
          value={activePlayer}
          tableValue={tableState}
          onPlayerClick={handleCellClick}
        />
      );
      console.log("Length after push: " + cellArray.length);

      if ((index + 1) % 3 == 0) {
        rowsArray.push([...cellArray]);
        cellArray.length = 0;
      }
    });
    console.log(rowsArray);

    return rowsArray;
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
          <p>{countMoves()}</p>
        </div>
      </section>
    </>
  );
}

export default App;
