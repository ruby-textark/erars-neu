import { useEffect, useRef, useState } from "preact/hooks";
import styled from "styled-components";
import { useEra } from "../utils/erars/hooks";
import useEmulatorSettings from "../utils/settings";
import ConsoleLineElement from "./ConsoleLine";
import EmueraInput from "./Input";
import type { EmulatorSettings } from "../utils/settings/types";
import EmulatorSettingsDialog from "./EmulatorSettings/Dialog";
import { useInput } from "../utils/console/input";

const EmueraBackground = styled.div<{
  bg_color: [number, number, number];
  emulatorSettings: EmulatorSettings;
}>`
  flex: 1;
  background-color: rgb(${({ bg_color }) => bg_color.join(",")});
  padding-left: 1em;
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow-y: auto;

  font-size: ${({ emulatorSettings }) => emulatorSettings.fontSize}px;
  font-family: "${({ emulatorSettings }) => emulatorSettings.fontFamily}",
    monospace, ui-monospace;
  & p {
    margin: 0;
  }

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 1.5em;
    border-radius: 1em;
    background-clip: padding-box;
    border: 0.5em solid transparent;
    color: #ffffffaa;
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }

  transition: color 0.5s ease;

  & > *:first-child {
    margin-top: auto;
  }
`;

function Console() {
  const era = useEra();
  const emulatorSettings = useEmulatorSettings();
  const displayRef = useRef<HTMLDivElement>(null);
  const [skipFlag, setSkipFlag] = useState(false);

  console.log(era.lines);
  useInput();

  useEffect(() => {
    era.read();
  }, []);

  useEffect(() => {
    displayRef.current?.scrollTo({
      behavior: "auto",
      top: displayRef.current?.scrollHeight,
    });
  }, [era.lines]);

  useEffect(() => {
    if (era.current_req?.ty === "Int" || era.current_req?.ty === "Str") {
      setSkipFlag(false);
    } else if (skipFlag) {
      era.sendInput().then(() => setSkipFlag(true));
    }
  }, [era.current_req, skipFlag]);

  return (
    <>
      <EmueraBackground
        ref={displayRef}
        bg_color={era.bg_color}
        emulatorSettings={emulatorSettings}
        onClick={() => {
          if (
            era.current_req?.ty === "AnyKey" ||
            era.current_req?.ty === "EnterKey"
          ) {
            era.sendInput();
          }
        }}
        onContextMenu={(e) => {
          setSkipFlag(true);
          e.preventDefault();
        }}
      >
        {era.lines.map((line, idx) => {
          const lineNo = idx;
          return <ConsoleLineElement key={lineNo} line={line} />;
        })}
        <EmueraInput />
      </EmueraBackground>
      <EmulatorSettingsDialog />
    </>
  );
}

export default Console;
