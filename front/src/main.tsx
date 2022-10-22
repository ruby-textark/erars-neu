import { render } from "preact";
import App from "./App";
import "./index.css";

import "./assets/fontawesome/css/fontawesome.css";
import "./assets/fontawesome/css/brands.css";
import "./assets/fontawesome/css/solid.css";

render(<App />, document.querySelector("#root") as HTMLElement);
