import type { EmueraResponse } from "./types";

declare global {
  type LaunchState = "init" | "launching" | "ready" | "fail";

  namespace Neutralino {
    namespace app {
      function exit(exitCode?: number): Promise<void>;
    }
    namespace events {
      type Handler<T> = (event?: CustomEvent<T>) => void;

      function on(
        eventName: "spawnedProcess",
        handler: Handler<Neutralino.os.SpawnProcessResult>
      ): Promise<Response>;

      function on(
        eventName: "windowClose",
        handler: Handler<null>
      ): Promise<Response>;
    }
    namespace os {
      function spawnProcess(command: string): Promise<SpawnProcessResult>;
      function updateSpawnedProcess(
        id: number,
        action: "stdIn" | "stdInEnd" | "exit",
        data?: object
      ): Promise<void>;

      interface SpawnProcessResult {
        id: number;
        pid: number;
        action: "stdOut" | "stdErr" | "exit";
        data: string;
      }
    }
    namespace window {
      function setDraggableRegion(domId: string | HTMLElement): Promise<void>;
      function isMaximized(): Promise<boolean>;
      function maximize(): Promise<void>;
      function unmaximize(): Promise<void>;
      function minimize(): Promise<void>;
    }

    function init(): void;
  }

  interface Window {
    NL_PORT: number;
    NL_TOKEN: string;
    NL_ARGS: string[];
  }
}

const BINARY_PATH = `erars-stdio.exe`;
const COMMON_FLAGS = [`--json`];
const DEV_FLAGS = [`.\\eraTHYMKR`, `--log-level=trace`];
const PROD_FLAGS = [`.`];

const FLAGS = COMMON_FLAGS.concat(
  import.meta.env.DEV ? DEV_FLAGS : PROD_FLAGS
).join(" ");

class ErarsBridge {
  erars?: { id: number; pid: number };
  stdoutBuffer: string;
  stdoutPromise?: Promise<EmueraResponse>;
  stdoutResolve?: (value: EmueraResponse) => void;

  constructor() {
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

    this.stdoutBuffer = "";

    Neutralino.init();
  }

  async launch() {
    if (this.erars) return;

    this.erars = { id: -1, pid: -1 };
    this.erars = await Neutralino.os.spawnProcess(`${BINARY_PATH} ${FLAGS}`);

    Neutralino.events.on("spawnedProcess", (e) => {
      if (!e) return;

      if (e?.detail.id === this.erars?.id) {
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
            this.close();
            break;
        }
      }
    });

    Neutralino.events.on("windowClose", () => {
      this.cleanup();
    });

    await this.setupTitlebar();
  }

  async stdin(input: string) {
    if (!this.erars) return;
    console.log(input + "\n");

    await Neutralino.os.updateSpawnedProcess(
      this.erars.id,
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

  setupTitlebar = () => {
    return Neutralino.window.setDraggableRegion("titlebar");
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
    if (this.erars && this.erars.pid > 0)
      await Neutralino.os.updateSpawnedProcess(this.erars.id, "exit");
  }

  async close() {
    if (this.erars) await this.cleanup();
    await Neutralino.app.exit();
  }
}

const singletonInstance = new ErarsBridge();
export default singletonInstance;
