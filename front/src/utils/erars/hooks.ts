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

    read: async () => {
      const { lines, read } = get();

      // Request after current line number.
      const resp = await bridge.stdout();

      console.log(resp);

      // Trim empty lines.
      const responseLines = resp.lines.filter((line) => {
        return line.parts !== undefined;
      });

      if (resp.rebuild) {
        set({
          ...resp,
          lines: resp.lines,
        });
      } else {
        // Concatenate with existing lines.
        let accLines = lines
          // Deactive existing lines
          .map((line) => ({ ...line, active: false }))
          .concat(
            responseLines
              // Activate new lines
              .map((line) => ({ ...line, active: true }))
          );

        // Slice lines if the length exceeds max line cap.
        if (accLines.length > this.maxLines)
          accLines = accLines.slice(accLines.length - this.maxLines);

        set({
          ...resp,
          lines: accLines,
        });
      }

      read();
    },

    sendInput: async (input = "") => {
      const { lines } = get();
      set({
        lines: lines.concat([
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
        ]),
      });

      await bridge.stdin(input);
    },
  }));
}

const singletonInstance = new Hooks();
export const { useEra } = singletonInstance;
export default singletonInstance;
