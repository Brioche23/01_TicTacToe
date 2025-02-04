# IMMUTABILITY

```js
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

```js
const newHistory = moveHistory.concat(newMove);
// IS EQUAL TO
const newHistory = [...moveHistory, newMove];
```

Also

```js
array.splice();
```

is used to crate a copy of an array

## TypeScript generic types

```js
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

```jsx
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

```js
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
  const outputTable =
    CELL_INDEXES.map <
    CellState >
    ((tIndex) => {
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

```js
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

```js
const tupla = [1, "2"] as const;
console.log(tupla);
const [s, d] = tupla; //
```

## Null and Undefined Check

isNil() is a cool lodash func that returns true if variable is === null || === undefined

```js
if (isNil(getLS)) {
  return initialValue;
}
```

The ?? operator applies boolean on left element and if null, undefined or empty, returns the value on the right

```js
const a = potentiallyNullViariable ?? "Other Value";
```

## Custom Hooks & localStorage

```js
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

```js
instanceof
typeof
is
in
```

# Context in React

To “teleport” data to the components in the tree that need it without passing props? With React’s context feature. Avoiding _Prop dirlling_.

1. Create a context. (You can call it LevelContext, since it’s for the heading level.)

```js
import { createContext } from "react";
export const LevelContext = createContext(1);
```

2. Use that context from the component that needs the data. (Heading will use LevelContext.)

```jsx
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

```jsx
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

```jsx
createRoot(document.getElementById("root")!).render(
  <>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </>
);
```

## Three Ways to do do conditional logic

```js
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

---

# MobX State Tree (MST)

MobX-State-Tree (MST) is a batteries included state management library.
MST is a state container that combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

Central to MST is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with run-time type information. In other words; each tree has a shape (type information) and state (data). From this living tree, immutable and structurally shared snapshots are generated automatically.

We need to describe to MST how our attributes are shaped.
Providing sample data will be used as defaults for the model and Type will be automatically inferred.

MST nodes are type-enriched -> providing a value (number) of the wrong type (expected boolean) will make MST throw an error.

## So...

Another way to look at mobx-state-tree is to consider it, as argued by Daniel Earwicker, to be "React, but for data". Like React, MST consists of composable components, called models, which captures a small piece of state. They are instantiated from props (snapshots) and after that manage and protect their own internal state (using actions). Moreover, when applying snapshots, tree nodes are reconciled as much as possible. There is even a context-like mechanism, called environments, to pass information to deep descendants.

## Syntax

### Tree Creation

```js
import { types, getSnapshot } from "mobx-state-tree";

const Todo = types.model({
  name: "",
  done: false,
});

const User = types.model({
  name: "",
});

const john = User.create();
const eat = Todo.create();

console.log("John:", getSnapshot(john));
console.log("Eat TODO:", getSnapshot(eat));
```

> To be honest with you, I lied when I told you how to define models. The syntax you used was only a shortcut for the following syntax:

BRO SAID NGL... AND THEN HE BE LYING

```js
const Todo = types.model({
  name: types.optional(types.string, ""),
  done: types.optional(types.boolean, false),
});

const User = types.model({
  name: types.optional(types.string, ""),
});
```

### Actions()

MST tree nodes (model instances) can be modified using actions. Actions are collocated with your model and can easily be defined by declaring .actions over your model and passing it a function that accepts the model instance and returns an object with the functions that modify that tree node.

```js
const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },

    toggle() {
      self.done = !self.done;
    },
  }));

const User = types.model({
  name: types.optional(types.string, ""),
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

_self_ is the object being constructed when an instance of your model is created.

## Snapshots

Some interesting properties of snapshots:

- Snapshots are immutable
- Snapshots can be transported
- Snapshots can be used to update models or restore them to a particular state
- Snapshots are automatically converted to models when needed. So, the two following statements are equivalent: store.todos.push(Todo.create({ title: "test" })) and store.todos.push({ title: "test" }).

**Useful methods:**

- getSnapshot(model, applyPostProcess): returns a snapshot representing the current state of the model
- onSnapshot(model, callback): creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
- applySnapshot(model, snapshot): updates the state of the model and all its descendants to the state represented by the snapshot

```js
console.log(getSnapshot(store));
/*
{
    "users": {},
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
}
```

### From Snapshot to model -> applySnapshot()

```js
// 1st
const store = RootStore.create({
  users: {},
  todos: {
    1: {
      name: "Eat a cake",
      done: true,
    },
  },
});

// 2nd -> the contents of the model Instance store are updated with the contents of the snapshot
applySnapshot(store, {
  users: {},
  todos: {
    1: {
      name: "Eat a cake",
      done: true,
    },
  },
});
```

### Time Travel

The ability of getting snapshots and applying them makes implementing time travel really easy in user-land.
Basically you want to save the snapshots in an array of States, so that you can go back and forth with the history by applying the snapshot to the model instance.

## Rendering UI

MST loves MobX, and is fully compatible with it's autorun, reaction, observe and other parts of the API. You can use the mobx-react-lite package to connect a MST store to a React component.
Keep in mind that any view engine could be easily integrated with MST, just listen to onSnapshot and update accordingly!

```jsx
import { observer } from "mobx-react-lite";

const App = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {Array.from(props.store.todos.values()).map((todo) => (
      <div>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={(e) => todo.toggle()}
        />
        <input
          type="text"
          value={todo.name}
          onChange={(e) => todo.setName(e.target.value)}
        />
      </div>
    ))}
  </div>
));
```

### What the HECK is Observe?

```js
observer<P>(baseComponent: FunctionComponent<P>): FunctionComponent<P>
```

The observer converts a component into a reactive component, which tracks which observables are used automatically and re-renders the component when one of these values changes. Can only be used for function components. For class component support see the mobx-react package.

### Rendering Performances

In normal React the entire application will re-render whenever a Todo is toggled or a name is changed.

Thanks to the ability of MobX to emit **granular updates**, fixing that becomes pretty easy! You just need to split the rendering of a Todo into another component to only re-render that component whenever the Todo data changes.

```js
const TodoView = observer((props) => (
  <div>
    <input
      type="checkbox"
      checked={props.todo.done}
      onChange={(e) => props.todo.toggle()}
    />
    <input
      type="text"
      value={props.todo.name}
      onChange={(e) => props.todo.setName(e.target.value)}
    />
  </div>
));

const AppView = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {Array.from(props.store.todos.values()).map((todo) => (
      <TodoView todo={todo} />
    ))}
  </div>
));
```

Each observer declaration will enable the React component to only re-render if any of it's observed data changes. Since our App component was observing everything, it was re-rendering whenever you changed something.

Now that we have split the rendering logic out into a separate observer, the TodoView will re-render only if that Todo changes, and AppView will re-render only if a new Todo is added or removed since it's observing only the length of the todos map.

## Computed Properties -> .view()

We need to count the number of TODOs with done set to false. To do this, we need to modify the RootStore declaration and add a getter property over our model by calling .views that will count how many TODOs are left.
Basically we are making computation right inside the module declaration.

```js
const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .views((self) => ({
    get pendingCount() {
      return Array.from(self.todos.values()).filter((todo) => !todo.done)
        .length;
    },
    get completedCount() {
      return Array.from(self.todos.values()).filter((todo) => todo.done).length;
    },
  }))
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

These properties are called "computed" because they keep track of the changes to the observed attributes and recompute automatically if anything used by that attribute changes. This allows for performance savings; for example changing the `name` of a TODO won't affect the number of pending and completed count, as such it wont trigger a recalculation of those counters.

```jsx
const TodoCounterView = observer((props) => (
  <div>
    {props.store.pendingCount} pending, {props.store.completedCount} completed
  </div>
));

const AppView = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {Array.from(props.store.todos.values()).map((todo) => (
      <TodoView todo={todo} />
    ))}
    <TodoCounterView store={props.store} />
  </div>
));
```

### Model Vews

A model's .views is declared as a function over the properties (first argument) of the model declaration. Model views can accept parameters and only read data from our store. If you try to change your store from a model view, MST will throw an error and prevent you from doing so.

```js
const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .views((self) => ({
    get pendingCount() {
      return Array.from(self.todos.values()).filter((todo) => !todo.done)
        .length;
    },
    get completedCount() {
      return Array.from(self.todos.values()).filter((todo) => todo.done).length;
    },
    getTodosWhereDoneIs(done) {
      return Array.from(self.todos.values()).filter(
        (todo) => todo.done === done
      );
    },
  }))
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

In TypeScript le views danno errore se richiamano metodi della stessa view. Quindi il modo migliore per risolvere è spezzare queste view. Non c'è limite al numero di views e actions.

```js
  .views((self) => ({
    get tableState() {
      return populateTable(self.moves);
    },
    get movesMade() {
      return self.moves.length;
    },
  }))
  .views((self) => ({
    get activePlayer() {
      return self.movesMade % 2 === 0 ? "X" : "O";
    },
  }))
  .views((self) => ({
    get winner() {
      if (
        self.movesMade > 4 &&
        NORMALIZED_WIN_ARRAY.filter((combo) =>
          areThreeValuesEquals(combo.map((c) => self.tableState[c].player))
        ).length > 0
      ) {
        return self.activePlayer === "X" ? "O" : "X";
      } else if (self.movesMade === 9) {
        return "tie";
      }
    },
  }))
```

### Reactions -> An alternative to useEffect()

- `autorun` auto detects dependencies
- `reaction` fine tuning
- `when` just ONCE when condition is true

```js
 .actions((self) => {
    //MobX LifeCycle
    // Local disposers relative to the action
    let disposer1: IReactionDisposer;
    let disposer2: IReactionDisposer;

    return {
      afterCreate() {
        console.log("CREATE");
        const newHistory = getLocalStorage();
        self.moves = newHistory; //Modify frozen

        // Side Effect: when winner changes, print winner
        disposer1 = autorun(() => {
          console.log("AUTORUN");
          switch (self.winner) {
            case "tie":
              console.log("It's a tie!!");
              alert("It's a tie!!");
              self.resetGame();
              break;

            case "X":
            case "O":
              console.log("The winner was: " + self.winner);
              alert("The winner was: " + self.winner);
              self.resetGame();
              break;

            default:
              break;
          }
        });
        // Side Effect: when moves changes, load on LS
        disposer2 = reaction(
          () => self.moves,
          (moves) => {
            console.log("REACTION –> Loading moves:", moves);
            setLocalStorage(moves);
          }
        );
      },
      beforeDestroy() {
        console.log("Destroy");
        disposer1();
        disposer2();
      },
    };
  });
```

## References??? (Approfondire con Ivan)

Now, we want to be able to provide assignees for each of our TODOs.

First, we need to populate the users map. To do so, we will simply pass in some users when creating the users map.

```js
const store = RootStore.create({
  users: {
    1: {
      name: "mweststrate",
    },
    2: {
      name: "mattiamanzati",
    },
    3: {
      name: "johndoe",
    },
  },
  todos: {
    1: {
      name: "Eat a cake",
      done: true,
    },
  },
});
```

# Miscellaneous

### Differenza tra Maybe e Optional

```js
function exampleMaybe(a: number | null) {}
function exampleOptional(b = 0) {}
```

### Perché usare il this. è pericoloso

```js
const testObj = {
  value: 0,
  getValue() {
    return this.value; // this in un methodo non fa ref a testObj, ma all'oggetto che invoca
  },
  getVal2: () => {
    return this.value; // Arrow func funziona ancora diverso. This non fa più ref a oggetto che invoca, ma a quello che ha creato arrow function
  },
};

console.log("Value", testObj.getVal2());

const getVal = testObj.getValue;
console.log("Value", getVal()); //Nessun obj invoca questa funzione -> this === undefined
```
