import styled from "styled-components";
import { useCallback } from "preact/hooks";
import { useEra } from "../../utils/erars/hooks";
import { ButtonType, Color } from "../../utils/erars/types";
import TextPart from "./Text";

const Button = styled.span<{
  hl_color: Color;
}>`
  &.active {
    cursor: pointer;
  }

  &.active span:hover {
    color: rgb(${({ hl_color }) => hl_color.join(",")});
  }
`;

function ButtonPart({
  part,
  active = false,
}: {
  part: ButtonType;
  active?: boolean;
}) {
  const era = useEra();
  const [segements, _, value] = part;

  const buttonCallback = useCallback(() => {
    if (active) era.sendInput((value.Int ?? value.String).toString() ?? "");
  }, [active]);

  return (
    <Button
      className={active ? "active" : ""}
      hl_color={era.hl_color}
      onClick={buttonCallback}
    >
      {segements.map((text, textIdx) => {
        return <TextPart key={textIdx} part={text} />;
      })}
    </Button>
  );
}

export default ButtonPart;
