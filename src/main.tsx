import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import "./index.css";
import { Counter } from "../examples/counter/Counter";
import { Todos } from "../examples/todo/Todo";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Counter />
    <Todos />
  </StrictMode>
);
