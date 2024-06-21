type Props<P = unknown> = P & {
  onclick?: () => void;
};

type ReactElement<P = unknown> = {
  type: keyof HTMLElementTagNameMap;
  ref?: HTMLElement;
  props: Props<P>;
  children?: (string | ReactElement)[];
};

export function createElement<P = unknown>(
  type: keyof HTMLElementTagNameMap,
  props: Props<P>,
  children?: (string | ReactElement)[]
): ReactElement {
  return {
    type,
    props,
    children,
  };
}

function renderElement(
  parent: HTMLElement,
  { type, children, props }: ReactElement
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
      // Not sure how to avoid adding two click listeners.
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

let state: string[] = [];
let stateIndex = 0;

let root: HTMLElement;
let render: () => ReactElement;

let refs: HTMLElement[] = [];
let renderIndex = 0;

export function createRoot(
  newRoot: HTMLElement,
  renderTree: () => ReactElement
) {
  root = newRoot;
  render = renderTree;
  renderElement(root, render());
}

export function rerender() {
  renderIndex = 0;
  renderElement(root, render());
}

function updateState(newValue: string, currentIndex: number) {
  state[currentIndex] = newValue;
  stateIndex = 0;
  rerender();
}

export function useState(initialValue: string) {
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
