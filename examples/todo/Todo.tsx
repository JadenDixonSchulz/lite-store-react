import { useStore } from "../../src/store.react";
import { createStore } from "../../src/store.core";
import { useState } from "react";

type Todo = { id: number; text: string; complete: boolean };

const todoStore = createStore({
  init: () => ({
    todos: [] as Todo[],
    draft: "",
  }),
  derive: (state) => ({
    completedTodos: () => state.todos.filter((todo) => todo.complete),
    completeMark: (index: number) => (state.todos[index].complete ? "✓" : "✗"),
  }),
  act: (state) => ({
    setComplete: (index: number, complete: boolean) => ({
      todos: state.todos.map((todo, i) =>
        i === index ? { ...todo, complete } : todo
      ),
    }),
    updateDraft: (draft: string) => ({
      draft,
    }),
    addTodo: () => ({
      draft: "",
      todos: [
        ...state.todos,
        {
          id: Math.max(0, ...state.todos.map((t) => t.id)) + 1,
          text: state.draft,
          complete: false,
        },
      ],
    }),
  }),
});

export function Todos() {
  const store = useStore(todoStore);
  const [mode, setMode] = useState<"all" | "complete">("all");

  const todos = mode === "all" ? store.todos : store.completedTodos();

  return (
    <div>
      <label htmlFor="show-mode-checkbox">Show Only Complete?</label>
      <input
        type="checkbox"
        onChange={(e) => setMode(() => (e.target.checked ? "complete" : "all"))}
      />
      <div className="todos">
        {todos.map((todo, i) => (
          <div className="todo" key={todo.id}>
            <div className="todo-info">{todo.id}</div>
            <div className="todo-desc">{todo.text}</div>
            <div className="todo-info">{store.completeMark(i)}</div>
            <div className="todo-info">
              <input
                type="checkbox"
                value={store.completeMark(i)}
                onChange={(e) => store.setComplete(i, e.target.checked)}
              />
            </div>
          </div>
        ))}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="new-todo">
        <div className="new-todo-input">
          <label htmlFor="draft">New Todo</label>
          <input
            id="draft"
            value={store.draft}
            onChange={(e) => store.updateDraft(e.target.value)}
          />
        </div>
        <button onClick={store.addTodo}>add todo</button>
      </div>
    </div>
  );
}
