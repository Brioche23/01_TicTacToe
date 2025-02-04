import { isNil, keyBy, multiply, range } from "lodash";
import { Instance, t } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { areThreeValuesEquals } from "../lib/utils";
import { Move, CellState } from "../lib/types";
import { autorun, IReactionDisposer, reaction } from "mobx";

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
const CELL_INDEXES = range(9);

// HO Func -> HOF
// HOC
const createMultiplier = (n: number) => (n2: number) => n * n2;
const multiplyer = (n: number, m: number) => n * m;
const double = createMultiplier(2);

const arr = [1, 2, 3, 4, 5, 6];
// // const doubles = arr.map((n) => multiplyer(n, 3));
// const doubles = arr.map((n) => double(n));
// const doubles = arr.map(double);
// const doubles = arr.map(createMultiplier(2));
// const doubles = arr.map((n) => createMultiplier(2)(n));
// const doubles = arr.map(createMultiplier(2));
// const doubles = arr.map((n) => createMultiplier(2)(n));

// const doubledNumber = double(10);

const logger =
  <Fn extends (...args: any[]) => any>(func: Fn) =>
  (...args: Parameters<Fn>): ReturnType<Fn> => {
    const val = func(...args);
    console.log("[PARAMS]", args, "[RESULT]", val);
    return val;
  };

const multWithLogs = logger(multiplyer);
const doubles = arr.map((n) => multWithLogs(n, 4));
console.log("doubles", doubles);

function populateTable(moves: Move[]) {
  const movesByIndex = keyBy(moves, (move) => {
    return move.index;
  });

  const outputTable = CELL_INDEXES.map<CellState>((index) => {
    const matchingMove = movesByIndex[index];
    const player = matchingMove?.player;
    return {
      player,
      index,
      isSelected: player !== undefined,
    };
  });

  return outputTable;
}

function setLocalStorage<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key: string) {
  const getLS = localStorage.getItem(key);

  if (isNil(getLS)) return [];

  try {
    return JSON.parse(getLS) as Move[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

const lifeCycle =
  <T>(func: (self: T) => IReactionDisposer | void) =>
  (self: T) => {
    //MobX LifeCycle
    // Local disposers relative to the action

    let disposer: IReactionDisposer | void;
    return {
      afterCreate() {
        disposer = func(self);
      },
      beforeDestroy() {
        console.log("Destroy");
        disposer?.();
      },
    };
  };

export const RootModel = t
  .model("RootModel", {
    moves: t.optional(t.frozen<Move[]>(), []), //use Frozen -> lo trasforma in ReadOnly (error se modifichi) -> t.opt(type, default)
  })
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
  .actions((self) => ({
    updateState(cellIndex: number) {
      const newMove: Move = { player: self.activePlayer, index: cellIndex };
      const newHistory = [...self.moves, newMove];
      self.moves = newHistory;
    },
    goBack() {
      console.log("Go Back");
      const newHistory = self.moves.slice(0, -1);
      self.moves = newHistory;
    },
    resetGame() {
      console.log("Reset");
      self.moves = [];
      //   destroy(self);
    },
  }))
  .actions(
    lifeCycle((self) => {
      console.log("CREATE");
      const newHistory = getLocalStorage("history");
      self.moves = newHistory; //Modify frozen
    })
  )
  .actions(
    lifeCycle((self) =>
      autorun(() => {
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
      })
    )
  )
  .actions(
    lifeCycle((self) =>
      reaction(
        () => self.moves,
        (moves) => {
          console.log("REACTION –> Loading moves:", moves);
          setLocalStorage("history", moves);
        }
      )
    )
  );

export interface RootInstance extends Instance<typeof RootModel> {}

export const rootState = RootModel.create({}); // Come inizializzo correttamente? Con frozen

export const RootStateContext = createContext<RootInstance | null>(null);

export function useMst() {
  const state = useContext(RootStateContext);
  if (isNil(state)) throw new Error("NON HAI USATO IL CONTEXT");

  return state;
}
