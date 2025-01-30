import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GameContextProvider } from "./GameContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </>
);
