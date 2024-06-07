type Props<P = unknown> = P & {
  children?: (string | ReactElement)[];
  onclick?: () => void;
};

type ReactElement<P = unknown> = {
  type: keyof HTMLElementTagNameMap;
  props: Props<P>;
};

export function createElement<P = unknown>(
  type: keyof HTMLElementTagNameMap,
  props: Props<P>,
  children?: (string | ReactElement)[]
): ReactElement {
  return {
    type,
    props: { children, ...props },
  };
}

function renderElement(parent: HTMLElement, { type, props }: ReactElement) {
  const newElement = document.createElement(type);
  for (const [prop, value] of Object.entries(props)) {
    if (prop === "children") {
      continue;
    } else if (prop === "onclick" && props.onclick) {
      newElement.addEventListener("click", props.onclick);
    } else if (typeof value === "string") {
      newElement.setAttribute(prop, value);
    }
  }
  parent.appendChild(newElement);
  if (props.children) {
    for (const child of props.children) {
      if (typeof child === "string") {
        newElement.appendChild(document.createTextNode(child));
      } else {
        renderElement(newElement, child);
      }
    }
  }
}

let state: string[] = [];
let stateIndex = 0;

let root: HTMLElement;
let render: () => ReactElement;

export function createRoot(
  newRoot: HTMLElement,
  renderTree: () => ReactElement
) {
  root = newRoot;
  render = renderTree;
  renderElement(root, render());
}

export function rerender() {
  root.innerHTML = "";
  renderElement(root, render());
}

function updateState(newValue: string, currentIndex: number) {
  state[currentIndex] = newValue;
  stateIndex = 0;
  rerender();
}

export function useState(initialValue: string) {
  console.log("Using state", root);
  const currentIndex = stateIndex;

  if (state.length <= currentIndex) {
    state.push(initialValue);
  }

  const value = state[currentIndex];
  stateIndex++;

  return [
    value,
    (newValue: string) => updateState(newValue, currentIndex),
  ] as const;
}
