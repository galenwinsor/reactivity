import { createElement } from "../html/lib";
import { createRoot, useState } from "./lib";

function Counter() {
  const [count, setCount] = useState(0);

  return createElement("div", {}, [
    createElement("p", {}, ["Count: ", count + " "]),
    createElement("button", { onclick: () => setCount(count + 1) }, [
      "Increment",
    ]),
    OnOff(),
  ]);
}

function OnOff() {
  const [on, setOn] = useState(false);

  return createElement("div", {}, [
    createElement("p", {}, [on ? "On" : "Off"]),
    createElement("button", { onclick: () => setOn(!on) }, ["Toggle"]),
  ]);
}

export default function reactRender() {
  createRoot(document.querySelector("#app")!, Counter);
}
