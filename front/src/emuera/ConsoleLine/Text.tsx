import styled from "styled-components";
import { TextType, TextStyle, FontStyleBit } from "../../utils/erars/types";
import useEmulatorSettings from "../../utils/settings";
import { EmulatorSettings } from "../../utils/settings/types";

function fontStyles(style: TextStyle) {
  const classNames = {
    [FontStyleBit.BOLD]: "bold",
    [FontStyleBit.ITALIC]: "italic",
    [FontStyleBit.STRIKELINE]: "strikeline",
    [FontStyleBit.UNDERLINE]: "underline",
  };

  return Object.entries(classNames)
    .flatMap(([key, value]) => {
      if ((style.font_style?.bits & (+key as FontStyleBit)) !== 0) return value;
      return [];
    })
    .join(" ");
}

const Text = styled.span<{
  textStyle: TextStyle;
  emulatorSettings: EmulatorSettings;
}>`
  color: rgb(${({ textStyle }) => textStyle.color.join(",")});
  font-family: ${({ textStyle }) => textStyle.font_family}, ui-monospace,
    monospace;

  &.bold {
    font-weight: bold;
  }
  &.italic {
    font-style: italic;
  }
  &.strikeline {
    text-decoration: line-through;
  }
  &.underline {
    text-decoration: underline;
  }
  &.strikeline.underline {
    text-decoration: line-through underline;
  }

  &.bold.faux {
    font-weight: normal;
    text-shadow: 1px 0 0 currentColor;
  }
  &.italic.faux {
    transform: skewX(-18deg);
  }

  @media (min-device-pixel-ratio: 1.5), (min-resolution: 120dpi) {
    &.bold.faux {
      font-weight: normal;
      text-shadow: 0.5px 0 0 currentColor, 1px 0 0 currentColor;
    }
  }

  @media (min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
    .bold {
      font-weight: normal;
      text-shadow: 0.333px 0 0 currentColor, 0.666px 0 0 currentColor,
        1px solid currentColor;
    }
  }
`;

function TextPart({ part }: { part: TextType }) {
  const emulatorSettings = useEmulatorSettings();

  const [textContent, textStyle] = part;
  return (
    <Text
      textStyle={textStyle}
      className={
        fontStyles(textStyle) + (emulatorSettings.fauxRender ? " faux" : "")
      }
      emulatorSettings={emulatorSettings}
    >
      {textContent.replace(/ /g, "\u00A0")}
    </Text>
  );
}

export default TextPart;
