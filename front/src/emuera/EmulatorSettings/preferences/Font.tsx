import useEmulatorSettings from "../../../utils/settings";
import PreferencesDiv, { PreferencesCheck, PreferencesText } from "./Common";

function FontPreferences() {
  const emulatorSettings = useEmulatorSettings();

  return (
    <PreferencesDiv>
      Font Family
      <PreferencesText
        value={emulatorSettings.fontFamily}
        onChange={({ target }) => emulatorSettings.setFontFamily(target.value)}
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
