export default function render() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Reactivity Experiment</h1>
    <h2>Naive approach</h2>
    <p id="count"></p>
    <button id="counter">Add one</p>
    <button id="reset">Reset</button>
  </div>
`;

  let count = 0;
  document.querySelector("#count")!.innerHTML = String(count);

  function rerender() {
    document.querySelector("#count")!.innerHTML = String(count);
  }

  function addOne() {
    count += 1;
    rerender();
  }

  function reset() {
    count = 0;
    rerender();
  }

  document.querySelector("#counter")!.addEventListener("click", addOne);

  document.querySelector("#reset")!.addEventListener("click", reset);
}
