import styled from "styled-components";
import type { TextType, TextStyle } from "../../utils/erars/types";

const Line = styled.div<{ textStyle: TextStyle }>`
  flex: 1;
  border-width: 1px;
  border-top-style: solid;
  border-color: rgb(${({ textStyle }) => textStyle.color.join(",")});
  margin: 0.5em 0;
`;

function LinePart({ part }: { part: TextType }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, textStyle] = part;
  return <Line textStyle={textStyle} />;
}

export default LinePart;
