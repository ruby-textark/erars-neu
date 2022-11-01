import { EmueraInputResponse, EmueraStore, FontStyleBit } from "./types";
import bridge from "./bridge";
import create from "zustand";

const useEra = create<EmueraStore>((set, get) => ({
  current_req: {
    generation: 0,
    is_one: false,
    ty: "AnyKey",
  },
  bg_color: [0, 0, 0],
  hl_color: [255, 255, 0],
  lines: [],
  maxLines: 2000,

  rebuild: false,

  read: async () => {
    for (;;) {
      // Request after current line number.
      const resp = await bridge.stdout();
      const { lines, maxLines } = get();

      console.log(resp);

      if (Object.hasOwn(resp, "ty")) {
        set({
          current_req: resp as EmueraInputResponse,
        });
        continue;
      }

      resp.last_line = resp.last_line ?? undefined;

      if (resp.rebuild === true) {
        set(resp);
      } else {
        // Trim empty lines.
        const responseLines =
          resp.lines?.filter(({ parts }) => parts !== undefined) ?? [];

        // Concatenate with existing lines.
        let accLines = lines.concat(
          responseLines
            // Activate new lines
            .map((line) => ({ ...line, active: true }))
        );

        // Slice lines if the length exceeds max line cap.
        if (accLines.length > maxLines)
          accLines = accLines.slice(accLines.length - maxLines);

        set({
          ...resp,
          lines: accLines,
        });
      }
    }
  },

  sendInput: (input = "") => {
    set(({ lines }) => ({
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
    }));

    bridge.stdin(input);
  },
}));

export { useEra };
