import styles from "./Button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text: string;
  moves: number;
  onClick: () => void; //Function type too generic -> specify function
}

export function Button({ text, moves, onClick }: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.btn,
        moves > 0 && styles.active,
        moves === 0 && styles.disabled
      )}
      onClick={() => {
        if (moves > 0) onClick();
      }}
    >
      {text}
    </button>
  );
}
