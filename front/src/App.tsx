import styled from "styled-components";
import Console from "./emuera/Console";
import Titlebar from "./Titlebar";

const FullscreenApp = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: transparent;
`;

function App() {
  return (
    <FullscreenApp>
      <Titlebar />
      <Console />
    </FullscreenApp>
  );
}

export default App;
