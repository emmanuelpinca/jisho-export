import React from "react";
import ReactDOM from "react-dom/client";

function Popup() {
  return <div>Popup</div>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
