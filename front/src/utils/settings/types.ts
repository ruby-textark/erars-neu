type BuiltinFonts = "Monoplex" | "D2Coding" | "NanumGothicCoding";
export const BuiltinFontNames: BuiltinFonts[] = [
  "Monoplex",
  // "D2Coding",
  // "NanumGothicCoding",
];

type EmulatorSettings = {
  // Font preferences
  fontFamily: BuiltinFonts | string;
  fontSize: number;
  fauxRender: boolean;

  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setFauxRender: (fauxRender: boolean) => void;

  // Input preferences
  arrowInput: boolean;

  setArrowInput: (arrowInput: boolean) => void;

  dialogOpen: boolean;
  dialog: (dialogOpen: boolean) => void;
};

export type { BuiltinFonts, EmulatorSettings };
