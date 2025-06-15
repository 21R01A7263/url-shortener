import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./src/styles.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
