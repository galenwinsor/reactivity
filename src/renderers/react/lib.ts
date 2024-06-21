type Props<P = unknown> = P & {
  onclick?: () => void;
};
type Children = (string | ReactElement | null)[];

class ReactElement<P = unknown> {
  type;
  id;
  ref?: HTMLElement;
  props;
  children;

  constructor(
    type: keyof HTMLElementTagNameMap,
    id: number,
    props: Props<P>,
    children?: Children
  ) {
    this.type = type;
    this.id = id;
    this.props = props;
    this.children = children;
  }

  render(parent: HTMLElement) {
    if (!this.ref) {
      this.ref = document.createElement(this.type);
    }
    parent.appendChild(this.ref);
    if (this.children) {
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child === null) {
          continue;
        } else if (typeof child === "string") {
          const textNode = document.createTextNode(child);
          this.ref.appendChild(textNode);
        } else {
          child.render(this.ref);
        }
      }
    }
  }
}

let root: HTMLElement;
let renderTree: () => ReactElement;
let tree: ReactElement;
let currentID = 0;

let state: Map<number, string> = new Map();

export function createRoot(root: HTMLElement, renderTree: () => ReactElement) {
  root = root;
  renderTree = renderTree;
  tree = renderTree();
  tree.render(root);
}

export function createElement<P>(
  type: keyof HTMLElementTagNameMap,
  props: Props<P>,
  children?: Children
) {
  return new ReactElement(type, currentID, props, children);
}

function updateState(newValue: string, id: number) {
  console.log("Updating state");
  state.set(id, newValue);
  rerender();
}

export function useState(initialValue: string) {
  if (!state.has(currentID)) {
    state.set(currentID, initialValue);
  }

  console.log("Using state:", state.get(currentID));

  return [
    state.get(currentID),
    (newValue: string) => updateState(newValue, currentID),
  ] as const;
}

function rerender() {
  console.log("Rerendering");
  currentID = 0;
  tree = renderTree();
  tree.render(root);
}
