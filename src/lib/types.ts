export type Player = "X" | "O";

export type CellState = {
  value?: Player;
  index: number;
};
