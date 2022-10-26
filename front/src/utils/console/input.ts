import { useCallback, useEffect } from "preact/hooks";
import { useEra } from "../erars/hooks";
import useEmulatorSettings from "../settings";

function useInput() {
  const era = useEra();
  const emulatorSettings = useEmulatorSettings();

  const arrowCallback = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
          era.sendInput("4");
          break;
        case "ArrowRight":
          era.sendInput("6");
          break;
        case "ArrowUp":
          era.sendInput("8");
          break;
        case "ArrowDown":
          era.sendInput("2");
          break;
      }
    },
    [era]
  );

  useEffect(() => {
    if (emulatorSettings.arrowInput) {
      window.addEventListener("keydown", arrowCallback);
    }
    return () => window.removeEventListener("keydown", arrowCallback);
  }, [emulatorSettings]);
}

export { useInput };
