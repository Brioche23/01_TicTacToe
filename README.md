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

Concat does not modify the array, creating a new one, and a shorthand can be:

```ts
const newHistory = moveHistory.concat(newMove);
// IS EQUAL TO
const newHistory = [...moveHistory, newMove];
```

Also

```ts
array.splice();
```

is used to crate a copy of an array

## TypeScript generic types

```ts
// <T> -> Generic Type variable
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

We have optimized it by putting it into the TSX

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

## Defining Tuplas

```ts
const tupla = [1, "2"] as const;
console.log(tupla);
const [s, d] = tupla; //
```

## Null and Undefined Check

isNil() is a cool lodash func that returns true if variable is === null || === undefined

```ts
if (isNil(getLS)) {
  return initialValue;
}
```

The ?? operator applies boolean on left element and if null, undefined or empty, returns the value on the right

```ts
const a = potentiallyNullViariable ?? "Other Value";
```

## Custom Hooks & localStorage

```ts
function useLocalStorage<T>(initialKey: string, initialValue: T) {
  const [moveHistory, setTableHistory] = useState<T>(() =>
    getLocalStorage(initialKey)
  );

  function setLocalStorage(key: string, value: T) {
    setTableHistory(value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLocalStorage(key: string) {
    const getLS = localStorage.getItem(key);

    if (isNil(getLS)) {
      return initialValue;
    }

    try {
      return JSON.parse(getLS) as T;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }
```

## TypeScript Type Guards

A type guard is a TypeScript technique used to get information about the type of a variable, usually within a conditional block.
Type guards are typically used for narrowing a type and are quite similar to feature detection, allowing you to detect the correct methods, prototypes, and properties of a value. Therefore, you can easily figure out how to handle that value.

```ts
instanceof
typeof
is
in
```

# Context in React

To “teleport” data to the components in the tree that need it without passing props? With React’s context feature. Avoiding _Prop dirlling_.

1. Create a context. (You can call it LevelContext, since it’s for the heading level.)

```ts
import { createContext } from "react";
export const LevelContext = createContext(1);
```

2. Use that context from the component that needs the data. (Heading will use LevelContext.)

```tsx
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}

<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>;
```

3. Provide that context from the component that specifies the data. (Section will provide LevelContext.)

```tsx
import { LevelContext } from "./LevelContext.js";

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
    </section>
  );
}
```

## Context Placement

Context Provider goes in the UPPER layer to the one we need context

```tsx
createRoot(document.getElementById("root")!).render(
  <>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </>
);
```

## Three Ways to do do conditional logic

```ts
// 01
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

// 02
const messages = {
  tie: "pareggio",
  X: "ha vinto il primo",
  O: "havinto il secondo",
};

// 03
if (!isNil(winner)) {
  const message = messages[winner];
  alert(message);
  resetGame();
}
if (winner === "tie") {
  console.log("It's a tie!!");
  alert("It's a tie!!");
  resetGame();
} else if (!isNil(winner)) {
  console.log("The winner was: " + winner);
  alert("The winner was: " + winner);
  resetGame();
}
```

# MobX State Tree
