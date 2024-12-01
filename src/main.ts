import "./style.css";
import naiveRender from "./renderers/imperative";
import signalsRender from "./renderers/signals/app";
import reactRender from "./renderers/react/app";
import observablesRender from "./renderers/observables/app";

// naiveRender();
// reactRender();
// signalsRender();
observablesRender();
