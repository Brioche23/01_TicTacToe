import { isNil } from "lodash";
import { useState } from "react";

export function useLocalStorage<T>(initialKey: string, initialValue: T) {
  const [moveHistory, setTableHistory] = useState<T>(() => getLocalStorage());

  function setLocalStorage(value: T) {
    setTableHistory(value);
    localStorage.setItem(initialKey, JSON.stringify(value));
  }

  function getLocalStorage() {
    const getLS = localStorage.getItem(initialKey);

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

  return [moveHistory, setLocalStorage] as const;
}
