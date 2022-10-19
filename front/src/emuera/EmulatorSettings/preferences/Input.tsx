import useEmulatorSettings from "../../../utils/settings";
import PreferencesDiv, { PreferencesCheck } from "./Common";

function InputPreferences() {
  const emulatorSettings = useEmulatorSettings();
  return (
    <PreferencesDiv>
      <div>
        <PreferencesCheck
          id="arrow-input"
          checked={emulatorSettings.arrowInput}
          onChange={({ target }) => {
            emulatorSettings.setArrowInput(target.checked);
          }}
        />
        <label htmlFor="arrow-input">Direction Input</label>
      </div>
    </PreferencesDiv>
  );
}

export default InputPreferences;
