type Props = {
  children?: (string | ReactElement)[];
  onclick?: () => void;
} & Record<string, string>;

type ReactElement = {
  type: keyof HTMLElementTagNameMap;
  props: Props;
};

function createElement(
  type: keyof HTMLElementTagNameMap,
  props: Props,
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
    } else if (prop === "onclick") {
      newElement.addEventListener("click", props.onclick);
    } else {
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

const state: string[] = [];
let currentIndex = 0;

function useState(initialValue: string) {
  const prevIndex = currentIndex;

  if (state.length <= prevIndex) {
    state.push(initialValue);
  }

  const updateState = (newValue: string) => {
    console.log("Updating state:", newValue, state, prevIndex);
    state[prevIndex] = newValue;
    currentIndex = 0;
    rerender();
  };

  const value = state[prevIndex];
  currentIndex++;

  return [value, updateState] as const;
}

function rerender() {
  document.querySelector("#app")!.innerHTML = "";
  reactRender();
}

export default function reactRender() {
  const [myState, setMyState] = useState("Hello, world");
  const [count, setCount] = useState("0");

  const tree = createElement("p", {}, [
    myState,
    count,
    createElement("a", { href: "https://google.com" }, ["Link to something"]),
    createElement("button", { onclick: () => setMyState("blah") }, [
      "Update text",
    ]),
    createElement(
      "button",
      { onclick: () => setCount(String(Number(count) + 1)) },
      ["Increment"]
    ),
  ]);

  renderElement(document.querySelector("#app")!, tree);
}
