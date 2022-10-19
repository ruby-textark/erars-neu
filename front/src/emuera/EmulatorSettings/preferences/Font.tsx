import Creatable from "react-select/creatable";
import useEmulatorSettings from "../../../utils/settings";
import { BuiltinFontNames } from "../../../utils/settings/types";
import PreferencesDiv, { PreferencesCheck, PreferencesText } from "./Common";

const builtinFonts = BuiltinFontNames.map((fontName) => ({
  value: fontName,
  label: fontName,
}));

function FontPreferences() {
  const emulatorSettings = useEmulatorSettings();

  return (
    <PreferencesDiv>
      Font Family
      <Creatable
        options={builtinFonts}
        defaultValue={{
          value: emulatorSettings.fontFamily,
          label: emulatorSettings.fontFamily,
        }}
        onChange={(value) =>
          emulatorSettings.setFontFamily(
            value?.value ?? emulatorSettings.fontFamily
          )
        }
      />
      Font Size(px)
      <PreferencesText
        type="number"
        min="6"
        max="48"
        value={emulatorSettings.fontSize}
        onInput={({ target }) => {
          const fontSize = +(target as HTMLInputElement).value;
          if (Number.isNaN(fontSize)) {
            emulatorSettings.setFontSize(6);
          } else {
            emulatorSettings.setFontSize(fontSize);
          }
        }}
      />
      <div>
        <PreferencesCheck
          id="faux-render"
          checked={emulatorSettings.fauxRender}
          onChange={({ target }) => {
            emulatorSettings.setFauxRender(target.checked);
          }}
        />
        <label htmlFor="faux-render">Use faux rendering</label>
      </div>
    </PreferencesDiv>
  );
}

export default FontPreferences;
