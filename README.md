# IMMUTABILITY

```ts
function immutabilityConcepts() {
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
}
```

## TypeScript generic types

```ts
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
```

```tsx
{
  splitArrayToMatrix(tableState, 3).map((row, index) => (
    <div key={index} className={classes.cell}>
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
    </div>
  ));
}
```

## Big O Notation

```ts
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
```

## Memory References when working with Arrays and Objects

```ts
const arr = [
  { a: 1, b: { c: 10 } },
  { a: 2, b: { c: 11 } },
  { a: 3, b: { c: 12 } },
];
const aDouble = arr.map((element) => {
  //! a.a = a.a * 2;  NO reassign values -> mai =
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
```
