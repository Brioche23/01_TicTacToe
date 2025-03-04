import { ReactNode } from "react";
import styles from "./Board.module.css";

interface BoardProps {
  children?: ReactNode;
}

export function Board({ children }: BoardProps) {
  return <div className={styles.board}>{children}</div>;
}
