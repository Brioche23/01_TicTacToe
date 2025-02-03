// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { GameContextProvider } from "./GameContextProvider.tsx";
import { rootState, RootStateContext } from "./state/index.ts";

createRoot(document.getElementById("root")!).render(
  <>
    <RootStateContext.Provider value={rootState}>
      {/* <GameContextProvider> */}
      <App />
      {/* </GameContextProvider> */}
    </RootStateContext.Provider>
  </>
);
