import type { ConsoleLine } from "../../utils/erars/types";
import TextPart from "./Text";
import ButtonPart from "./Button";
import LinePart from "./Line";
import styled from "styled-components";

const Line = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function ConsoleLineElement({ line }: { line: ConsoleLine }) {
  return (
    <Line>
      {line.parts?.map((part, idx) => {
        if (part.Text) {
          return <TextPart key={idx} part={part.Text} />;
        }
        if (part.Line) {
          return <LinePart key={idx} part={part.Line} />;
        }
        if (part.Button) {
          return (
            <ButtonPart key={idx} active={line.active} part={part.Button} />
          );
        }

        return <></>;
      })}
    </Line>
  );
}

export default ConsoleLineElement;
