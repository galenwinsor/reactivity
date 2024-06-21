import { createElement, createRoot, useState } from "./lib";

function Counter() {
  const [count, setCount] = useState("0");

  return createElement("div", {}, [
    createElement("p", {}, ["Count: ", count + " "]),
    createElement(
      "button",
      { onclick: () => setCount(`${Number(count) + 1}`) },
      ["Increment"]
    ),
    OnOff(),
  ]);
}

function OnOff() {
  const [on, setOn] = useState("");

  return createElement("div", {}, [
    createElement("p", {}, [Boolean(on) ? "On" : "Off"]),
    createElement("button", { onclick: () => setOn(on === "" ? "on" : "") }, [
      "Toggle",
    ]),
  ]);
}

export default function reactRender() {
  createRoot(document.querySelector("#app")!, Counter);
}
