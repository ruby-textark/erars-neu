/** Input Request Type */
type InputRequest = {
  generation: number;
  ty: "AnyKey" | "EnterKey" | "Int" | "Str";
  timeout?: number;
  is_one: boolean;
};

/** Console Line Types */
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
  align?: "Center" | "Left" | "Right";
  parts: ConsoleLinePart[];
  /** @description true if this line was included in the last response. */
  active?: boolean;
};

/** Emuera State Types */
type EmueraLineState = {
  bg_color: Color;
  hl_color: Color;
  lines: ConsoleLine[];
  last_line?: ConsoleLine;
};
type EmueraInputState = {
  current_req: InputRequest;
};

/** Emuera Response Types */
type EmueraLineResponse = {
  rebuild: boolean;
} & EmueraLineState;
type EmueraInputResponse = InputRequest;

type EmueraResponse = Partial<EmueraLineResponse> &
  Partial<EmueraInputResponse>;

type EmueraStore = {
  maxLines: number;
  read: () => Promise<void>;
  sendInput: (input?: string) => void;
} & EmueraLineState &
  EmueraInputState;

export { FontStyleBit };

export type {
  Color,
  ConsoleLine,
  TextType,
  LineType,
  ButtonType,
  TextStyle,
  EmueraLineResponse,
  EmueraInputResponse,
  EmueraResponse,
  EmueraStore,
};
