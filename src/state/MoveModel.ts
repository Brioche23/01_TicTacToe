import { Instance, t } from "mobx-state-tree";
export const MoveModel = t.model("MoveModel", {
  player: t.union(t.literal("X"), t.literal("O")),
  index: t.number,
});

export interface MoveInstance extends Instance<typeof MoveModel> {}
