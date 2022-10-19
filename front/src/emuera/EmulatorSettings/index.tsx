import styled from "styled-components";
import useEmulatorSettings from "../../utils/settings";

const FloatingButton = styled.div`
  position: absolute;
  top: calc(1em + 2em);
  right: 1em;

  padding: 0.5em;
  border-radius: 12px;

  background: lightgrey;
  color: black;
  font-size: 1.5em;
  opacity: 0.5;

  cursor: pointer;

  transition: 500ms;

  &:hover {
    opacity: 1;
  }
`;

function SettingsButton() {
  const emulatorSettings = useEmulatorSettings();
  return (
    <FloatingButton onClick={() => emulatorSettings.dialog(true)}>
      <i className="fa-solid fa-gear" />
    </FloatingButton>
  );
}

export default SettingsButton;
