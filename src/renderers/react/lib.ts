import { DOMElement } from "../html/lib";

/**
 * Given a parent element and a {@link DOMElement}, renders the element in the DOM if it doesn't exist,
 * or updates its properties if it does.
 * @param parent The parent DOM element, which should exist in the DOM already.
 * @param element An object representation of the new element.
 */
function renderElement(
  parent: HTMLElement,
  { type, children, props }: DOMElement
) {
  const currentRenderIndex = renderIndex;
  renderIndex++;
  if (!refs[currentRenderIndex]) {
    const newElement = document.createElement(type);
    refs.push(newElement);
    parent.appendChild(newElement);
  }
  let element = refs[currentRenderIndex];
  for (const [prop, value] of Object.entries(props)) {
    if (prop === "children") {
      continue;
    } else if (prop === "onclick" && props.onclick) {
      // TODO: Not sure how to avoid adding two click listeners.
      const oldElement = element;
      element = refs[currentRenderIndex] = document.createElement(type);
      element.addEventListener("click", props.onclick);
      oldElement.replaceWith(element);
    } else if (typeof value === "string") {
      if (element.getAttribute(prop) === value) {
        continue;
      }
      element.setAttribute(prop, value);
    }
  }
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child === "string") {
        const childNode = element.childNodes[i];
        if (!childNode) {
          element.appendChild(document.createTextNode(child));
        } else if (childNode.nodeType !== 3) {
          throw new Error("Not a text node");
        } else if (childNode.textContent !== child) {
          childNode.textContent = child;
        }
      } else {
        renderElement(element, child);
      }
    }
  }
}

/**
 * An array of state values; you can think of this as an object mapping state variable ID to value,
 * where the ID is the index in the array.
 */
let state: unknown[] = [];
/** The index of the state variable that's being resolved. */
let stateIndex = 0;

/** The root HTML element of the app. */
let root: HTMLElement;
/** The root component of the app. */
let render: () => DOMElement;

/**
 * All HTML elements rendered by the app. The order stays the same so that iterating through each element
 * resolves the same way on each render.
 */
let refs: HTMLElement[] = [];
/** The index of the element currently rendering. */
let renderIndex = 0;

/**
 * Initializes the app, setting {@link root} and {@link render} and then rendering the tree to the DOM.
 * @param newRoot The new root `HTMLElement`.
 * @param renderTree The root component of the app.
 */
export function createRoot(newRoot: HTMLElement, renderTree: () => DOMElement) {
  root = newRoot;
  render = renderTree;
  renderElement(root, render());
}

/** Resets the rendering iteration, updating all elements with new state values. */
export function rerender() {
  renderIndex = 0;
  renderElement(root, render());
}

/**
 * Updates a state value, triggering a rerender.
 * @param newValue The new state value.
 * @param currentIndex The index in the state array of the state variable to update.
 */
function updateState<T>(newValue: T, currentIndex: number) {
  state[currentIndex] = newValue;
  stateIndex = 0;
  rerender();
}

/**
 * Access the state variable at the current state index.
 * @param initialValue The initial value to set if the state variable doesn't already exist.
 * @returns An array: the first item is the current value and the second is a function to update the
 * value.
 */
export function useState<T>(initialValue: T) {
  const currentIndex = stateIndex;

  if (state.length <= currentIndex) {
    state.push(initialValue);
  }

  const value = state[currentIndex];
  stateIndex++;

  return [
    value as T,
    (newValue: T) => updateState(newValue, currentIndex),
  ] as const;
}
