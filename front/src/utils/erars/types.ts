type InputRequest = {
  generation: number;
  ty: "AnyKey" | "EnterKey" | "Int" | "Str";
  timeout?: number;
  is_one: boolean;
};
type Color = [number, number, number];

enum FontStyleBit {
  NORMAL = 0x0,
  BOLD = 0x1,
  ITALIC = 0x2,
  STRIKELINE = 0x4,
  UNDERLINE = 0x8,
}
type FontStyle = { bits: FontStyleBit };

type TextStyle = {
  color: Color;
  font_family: string;
  font_style: FontStyle;
};

type TextType = [string, TextStyle];
type LineType = [string, TextStyle];
type ButtonType = [
  [string, TextStyle][],
  number,
  { Int: number; String: undefined } | { Int: undefined; String: string }
];

type ConsoleLinePart = {
  Text?: TextType;
  Line?: LineType;
  Button?: ButtonType;
};
type ConsoleLine = {
  parts: ConsoleLinePart[];
  /** @description true if this line was included in the last response. */
  active?: boolean;
};

type EmueraResponse = {
  current_req: InputRequest | null;
  rebuild: false;
  bg_color: Color;
  hl_color: Color;
  last_line?: ConsoleLine;
  lines: ConsoleLine[];
};

type EmueraState = {
  read: () => Promise<void>;
  sendInput: (input?: string) => Promise<void>;
} & EmueraResponse;

export { FontStyleBit };

export type {
  Color,
  ConsoleLine,
  TextType,
  LineType,
  ButtonType,
  TextStyle,
  EmueraResponse,
  EmueraState,
};
