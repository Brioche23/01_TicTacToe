import styles from "./Button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick: () => void; //Function type too generic -> specify function
}

export function Button({ text, disabled, onClick }: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.btn,
        disabled ? styles.disabled : styles.active
      )}
      onClick={() => {
        if (!disabled) onClick();
      }}
    >
      {text}
    </button>
  );
}
