import type { EmueraResponse } from "./types";
import "./neutralino.d.ts";

const COMMON_FLAGS = [`--json`, `--log-level=trace`];
const DEV_FLAGS = [`.\\eraTHYMKR`];
const PROD_FLAGS = [`.`];

const FLAGS = COMMON_FLAGS.concat(
  import.meta.env.DEV ? DEV_FLAGS : PROD_FLAGS
).join(" ");

class ErarsBridge {
  erars: Promise<{ id: number; pid: number }>;
  stdoutBuffer: string;
  stdoutPromise?: Promise<EmueraResponse>;
  stdoutResolve?: (value: EmueraResponse) => void;

  constructor() {
    this.stdoutBuffer = "";

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

      if (e?.detail.id === id) {
        switch (e.detail.action) {
          case "stdOut":
          case "stdErr":
            this.stdoutBuffer += e.detail.data;
            try {
              const json = JSON.parse(this.stdoutBuffer);

              if (!this.stdoutPromise) {
                this.stdoutPromise = Promise.resolve(json);
              } else {
                this.stdoutResolve?.(json);
              }

              this.stdoutBuffer = "";
            } catch (err) {}
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
      (input + "\r\n") as Object
    );
  }

  stdout() {
    if (!this.stdoutPromise) {
      this.stdoutPromise = new Promise((resolve) => {
        this.stdoutResolve = resolve;
      });
    }

    return this.stdoutPromise.then((result) => {
      this.stdoutPromise = undefined;
      return result;
    });
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

  async close(needsCleanup: boolean = true) {
    if (needsCleanup) await this.cleanup();
    await Neutralino.app.exit();
  }
}

const singletonInstance = new ErarsBridge();
export default singletonInstance;
