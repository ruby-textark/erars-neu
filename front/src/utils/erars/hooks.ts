import { EmueraState, FontStyleBit } from "./types";
import bridge from "./bridge";
import create from "zustand";

class Hooks {
  maxLines: number;

  constructor() {
    this.maxLines = 2000;
  }

  useEra = create<EmueraState>((set, get) => ({
    current_req: {
      generation: 0,
      is_one: false,
      ty: "AnyKey",
    },
    bg_color: [0, 0, 0],
    hl_color: [255, 255, 0],
    lines: [],

    rebuild: false,

    from: 0,

    read: async () => {
      const { lines, from, read } = get();

      // Request after current line number.
      const resp = await bridge.stdout();

      console.log(resp);

      // Trim empty lines.
      const responseLines = resp.lines.filter((line) => {
        return line.parts !== undefined;
      });

      // Concatenate with existing lines.
      const accLines = lines.concat(
        responseLines
          // Activate new lines
          .map((line) => ({ ...line, active: true }))
      );

      set({
        ...resp,
        lines: accLines,
        from: from + responseLines.length,
      });

      // Slice lines if the length exceeds max line cap.
      if (accLines.length > this.maxLines)
        set({ lines: accLines.slice(accLines.length - this.maxLines) });

      read();
    },

    sendInput: async (input = "") => {
      const { lines } = get();
      set({
        lines: lines
          .concat([
            {
              parts: [
                {
                  Text: [
                    input,
                    {
                      color: [255, 255, 255],
                      font_family: "",
                      font_style: { bits: FontStyleBit.NORMAL },
                    },
                  ],
                },
              ],
            },
          ])
          // Deactive existing lines
          .map((line) => ({ ...line, active: false })),
      });

      await bridge.stdin(input);
    },
  }));
}

const singletonInstance = new Hooks();
export const { useEra } = singletonInstance;
export default singletonInstance;
