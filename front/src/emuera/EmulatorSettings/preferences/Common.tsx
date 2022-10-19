import styled from "styled-components";

const PrefWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 1em;
`;

function PreferencesDiv({ children }: { children: any }) {
  return <PrefWrapper>{children}</PrefWrapper>;
}

export default PreferencesDiv;

const PreferencesText = styled.input`
  appearance: none;

  background-color: white;
  color: black;

  border: 1px solid lightgrey;
  border-radius: 4px;

  padding: 0.75em;
  margin-right: 2px;
`;

const PreferencesCheck = styled.input.attrs(() => ({
  type: "checkbox",
}))`
  accent-color: red;

  border: 1px solid lightgrey;
  border-radius: 4px;

  padding: 0.75em;
  margin-right: 2px;

  vertical-align: bottom;
`;

export { PreferencesText, PreferencesCheck };
