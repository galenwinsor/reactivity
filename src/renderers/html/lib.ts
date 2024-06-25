export type Props<P = unknown> = P & {
  onclick?: () => void;
};

export type DOMElement<P = unknown> = {
  type: keyof HTMLElementTagNameMap;
  ref?: HTMLElement;
  props: Props<P>;
  children?: (string | DOMElement)[];
};

export function createElement<P = unknown>(
  type: keyof HTMLElementTagNameMap,
  props: Props<P>,
  children?: (string | DOMElement)[]
): DOMElement {
  return {
    type,
    props,
    children,
  };
}
