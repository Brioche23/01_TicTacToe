import { useLocalStorage } from "./hooks/useLocalStorage";

import { createContext, ReactNode, useContext } from "react";
import { range, keyBy, isNil } from "lodash";
import { CellState, Player, Move } from "./lib/types";

import { areThreeValuesEquals } from "./lib/utils";

const TEST = {
  privateAValue: 0,

  get a() {
    return this.privateAValue;
  },

  set a(value: number) {
    if (value % 2 === 0) {
      this.privateAValue = value;
    } else {
      this.privateAValue = value - 1;
    }
  },

  get doubleA() {
    console.log("getter called");
    return this.a * 2;
  },
};

TEST.a = 9;

console.log("TEST", TEST.a);
console.log("TEST", TEST.doubleA);
console.log("TEST", TEST.doubleA);
console.log("TEST", TEST.doubleA);
console.log("TEST", TEST.doubleA);
interface ContextProps {
  movesMade: number;
  tableState: CellState[];
  activePlayer: Player;
  winner?: Player | "tie";
  updateState: (cellIndex: number) => void;
  goBack: () => void;
  resetGame: () => void;
}
interface ContextProviderProps {
  children?: ReactNode;
}

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

function populateTable(moveHistory: Move[]) {
  const movesByIndex = keyBy(moveHistory, (move) => {
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

function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

function checkWinner(
  movesMade: number,
  tableState: CellState[],
  activePlayer: Player
) {
  if (
    movesMade > 4 &&
    NORMALIZED_WIN_ARRAY.filter((combo) =>
      areThreeValuesEquals(combo.map((c) => tableState[c].player))
    ).length > 0
  ) {
    return getOpponent(activePlayer);
  } else if (movesMade === 9) {
    return "tie";
  }
}

export const GameContext = createContext<ContextProps | null>(null);

export function useGameContext() {
  const context = useContext(GameContext);

  if (isNil(context)) {
    throw new Error("L'è un null!");
  }

  return context;
}

export const GameContextProvider = ({ children }: ContextProviderProps) => {
  const [moveHistory, setMoveHistoryInLocalStorage] = useLocalStorage<Move[]>(
    "history",
    []
  );

  const movesMade = moveHistory.length;
  const tableState = populateTable(moveHistory);
  const activePlayer: Player = movesMade % 2 === 0 ? "X" : "O";

  const winner = checkWinner(movesMade, tableState, activePlayer);

  function updateState(cellIndex: number) {
    const newMove: Move = { player: activePlayer, index: cellIndex };
    const newHistory = [...moveHistory, newMove];
    setMoveHistoryInLocalStorage(newHistory);
  }

  function goBack() {
    const newHistory = moveHistory.slice(0, -1);
    setMoveHistoryInLocalStorage(newHistory);
  }

  function resetGame() {
    setMoveHistoryInLocalStorage([]);
  }

  return (
    <GameContext.Provider
      value={{
        movesMade,
        tableState,
        activePlayer,
        winner,
        updateState,
        goBack,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
