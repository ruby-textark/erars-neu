type EmulatorSettings = {
  // Font preferences
  fontFamily: string;
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

export type { EmulatorSettings };
