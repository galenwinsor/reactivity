import { $effect, $signal } from "./lib";

export default function render() {
  const count = $signal(0);

  document.querySelector("#app")!.innerHTML = /* html */ `
        <div>
            <p id="count"></p>
            <button id="increment">Increment</button>
        </div>
        `;
  $effect(() => {
    document.querySelector("#count")!.innerHTML = `Count: ${count.value}`;
  });
  const updateCount = () => {
    count.value += 1;
  };
  document.querySelector("#app")?.addEventListener("click", updateCount);
}
