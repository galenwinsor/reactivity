import { createElement, createRoot, useState } from "./lib";

function Counter() {
  const [count, setCount] = useState("0");

  return createElement("div", {}, [
    createElement("p", {}, [
      "Count: ",
      count + " ",
      createElement("a", { href: "https://google.com" }, ["A link"]),
    ]),
    createElement(
      "button",
      { onclick: () => setCount(`${Number(count) + 1}`) },
      ["Increment"]
    ),
  ]);
}

export default function reactRender() {
  createRoot(document.querySelector("#app")!, Counter);
}
