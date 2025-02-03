import { isNil, keyBy, range } from "lodash";
import { Instance, t } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { areThreeValuesEquals } from "../lib/utils";
import { Move, CellState } from "../lib/types";

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

export const RootModel = t
  .model("RootModel", {
    // moves: t.array(MoveModel), // MM ha solo props, quindi
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
      self.moves = newHistory; //Modify frozen

      console.log("Moves", self.moves);
    },
    goBack() {
      console.log("Go Back");
      const newHistory = self.moves.slice(0, -1);
      self.moves = newHistory;
    },
    resetGame() {
      console.log("Reset");
      self.moves = [];
    },
  }));

export interface RootInstance extends Instance<typeof RootModel> {}

export const rootState = RootModel.create({}); // Come inizializzo correttamente? Con frozen

export const RootStateContext = createContext<RootInstance | null>(null);

export function useMst() {
  const state = useContext(RootStateContext);
  if (isNil(state)) throw new Error("NON HAI USATO IL CONTEXT");

  return state;
}

// Collega local strage dentro reaction -> MobX LifeCycle
