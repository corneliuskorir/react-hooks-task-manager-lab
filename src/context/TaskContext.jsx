import React, { createContext, useEffect, useState } from "react";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6001/tasks")
      .then((r) => r.json())
      .then((data) => setTasks(data));
  }, []);

  const toggleComplete = (task) => {
    fetch(`http://localhost:6001/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((r) => r.json())
      .then((data) =>
        setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t))),
      )
      .catch(console.log);
  };

  const addTask = (newTask) => {
    fetch("http://localhost:6001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((r) => r.json())
      .then((data) => setTasks((prev) => [...prev, data]))
      .catch(console.log);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, toggleComplete, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}
