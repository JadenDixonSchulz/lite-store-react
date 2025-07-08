import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import "./index.css";
import { Counter } from "../examples/counter/Counter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Counter />
    {/* <Todo /> */}
  </StrictMode>
);
