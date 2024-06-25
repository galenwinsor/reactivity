import { Observable } from "./lib";

export default function app() {
  document.querySelector("#app")!.innerHTML = /* html */ `
        <div>
            <p id="count"></p>
            <button id="increment">Increment</button>
            <button id="unsubscribe">Unsubscribe</button>
        </div>
        `;
  let count = 0;
  const $count = Observable.fromEvent(
    document.querySelector("#increment")!,
    "click"
  )
    .pipe(() => (count += 1))
    .subscribe({
      next: () =>
        (document.querySelector("#count")!.innerHTML = `Count: ${count}`),
      error: () => {},
      complete: () => console.log("Complete"),
    });
  document
    .querySelector("#unsubscribe")!
    .addEventListener("click", () => $count.unsubscribe());
}
