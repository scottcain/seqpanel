// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Buffer } from "buffer";

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
