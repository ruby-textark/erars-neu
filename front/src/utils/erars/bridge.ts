import type { EmueraResponse } from "./types";
import "./neutralino.d.ts";

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

    const { name } = await Neutralino.computer.getOSInfo();
    const executable = name.includes("Windows")
      ? "erars-stdio.exe"
      : "erars-stdio";

    this.erars = await Neutralino.os.spawnProcess(`${executable} ${FLAGS}`);

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
