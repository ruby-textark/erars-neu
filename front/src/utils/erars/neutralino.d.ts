export declare global {
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
    namespace computer {
      function getOSInfo(): Promise<{
        name: string;
        description: string;
        version: string;
      }>;
    }

    function init(): void;
  }

  interface Window {
    NL_PORT: number;
    NL_TOKEN: string;
    NL_ARGS: string[];
  }
}
