export type Player = "X" | "O";

export type CellState = {
  player?: Player;
  index: number;
  isSelected: boolean;
};

export type Move = {
  player: Player;
  index: number;
};
