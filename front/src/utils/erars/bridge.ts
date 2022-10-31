import { EmueraResponse } from "./types";
import "./neutralino.ts";
import JsonStream from "./stream";

const COMMON_FLAGS = [`--json`];
const DEV_FLAGS = [`.\\eraTHYMKR`, `--log-level=trace`];
const PROD_FLAGS = [`.`];

const FLAGS = COMMON_FLAGS.concat(
  import.meta.env.DEV ? DEV_FLAGS : PROD_FLAGS
).join(" ");

declare global {
  interface Window {
    NL_PORT: number;
    NL_TOKEN: string;
    NL_ARGS: string[];
  }
}

class ErarsBridge {
  erars: Promise<{ id: number; pid: number }>;
  stdoutStream: JsonStream<EmueraResponse>;

  constructor() {
    this.stdoutStream = new JsonStream();

    if (import.meta.env.DEV) {
      /**
       * See Neutralinojs Issue #902
       * {@link https://github.com/neutralinojs/neutralinojs/issues/902}
       */
      const authInfo = new XMLHttpRequest();
      authInfo.open("GET", "/auth_info", false);
      authInfo.send();

      if (!Object.hasOwn(window, "NL_PORT")) {
        const { port, accessToken } = JSON.parse(authInfo.response);

        window.NL_PORT = port;
        window.NL_TOKEN = accessToken;
        window.NL_ARGS = [
          `--load-dir-res`,
          `--path=.`,
          `--export-auth-info`,
          `--neu-dev-extension`,
          `--url=http://localhost:5173/`,
        ];
      }
    }

    Neutralino.init();
    Neutralino.window.setSize({ resizable: true });
    this.erars = this.launch();
  }

  async launch() {
    const { name } = await Neutralino.computer.getOSInfo();
    const executable = name.includes("Windows")
      ? "erars-stdio.exe"
      : "erars-stdio";

    const { id, pid } = await Neutralino.os.spawnProcess(
      `${executable} ${FLAGS}`
    );

    Neutralino.events.on("spawnedProcess", (e) => {
      if (!e) return;

      if (e.detail.id === id) {
        switch (e.detail.action) {
          case "stdOut":
            this.stdoutStream.write(e.detail.data);
            break;
          case "stdErr":
            console.error(e.detail.data);
            break;
          case "exit":
            this.erars = Promise.resolve({ id: -1, pid: -1 });
            break;
        }
      }
    });

    window.addEventListener("keydown", (e) => {
      const { key, altKey } = e;
      if (key === "F4" && altKey) {
        this.close();
      }
    });
    Neutralino.events.on("windowClose", () => {
      this.close();
    });

    console.log(id);

    return { id, pid };
  }

  async stdin(input: string) {
    const { id } = await this.erars;
    console.log(input + "\n");

    await Neutralino.os.updateSpawnedProcess(
      id,
      "stdIn",
      (input + "\r\n") as unknown as object
    );
  }

  stdout() {
    return this.stdoutStream.read();
  }

  setDraggableRegion = (element: HTMLElement) => {
    return Neutralino.window.setDraggableRegion(element);
  };
  unsetDraggableRegion = (element: HTMLElement) => {
    return Neutralino.window.unsetDraggableRegion(element);
  };

  isMaximized = () => {
    return Neutralino.window.isMaximized();
  };

  async toggleMaximize() {
    const maximized = await this.isMaximized();
    switch (maximized) {
      case true:
        Neutralino.window.unmaximize();
        break;
      case false:
        Neutralino.window.maximize();
        break;
    }
  }

  minimize() {
    return Neutralino.window.minimize();
  }

  async cleanup() {
    const { id } = await this.erars;
    if (id >= 0) await Neutralino.os.updateSpawnedProcess(id, "exit");
  }

  async close(needsCleanup = true) {
    if (needsCleanup) await this.cleanup();
    await Neutralino.app.exit();
  }
}

const singletonInstance = new ErarsBridge();
export default singletonInstance;
