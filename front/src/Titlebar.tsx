import { useEffect, useRef, useState } from "preact/hooks";
import styled from "styled-components";
import bridge from "./utils/erars/bridge";

const TitlebarContent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  background-color: #aaaaaacc;

  display: flex;

  transition: 500ms;

  opacity: 0.5;

  user-select: none;

  &:hover {
    opacity: 1;
  }
`;

const TitleText = styled.p`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  margin: 0;
  padding: 0.5em;
  text-align: center;

  color: white;

  transition: 500ms;
`;

const DragArea = styled.div`
  flex: 1;
`;

const TitleButtonArea = styled.div`
  display: flex;

  z-index: 999;
`;

const NormalButton = styled.div`
  padding: 0.5em 1em;
  color: black;
  transition: 500ms;
  &:hover {
    color: white;
    background-color: black;
  }
`;

const CloseButton = styled.div`
  padding: 0.5em 1em;
  color: black;
  transition: 500ms;
  &:hover {
    color: white;
    background-color: red;
  }
`;

function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const titlebarElement = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const dragZone = titlebarElement.current;
    if (dragZone) {
      bridge.setDraggableRegion(dragZone);

      return () => {
        bridge.unsetDraggableRegion(dragZone);
      };
    }

    return () => undefined;
  }, [titlebarElement]);

  return (
    <TitlebarContent
      onDoubleClick={() =>
        bridge
          .toggleMaximize()
          .then(() => bridge.isMaximized())
          .then((isMaximized) => setIsMaximized(isMaximized))
      }
    >
      <DragArea />
      <TitleText ref={titlebarElement}>{document.title}</TitleText>
      <TitleButtonArea>
        <NormalButton onClick={() => bridge.minimize()}>
          <i className="fa-regular fa-window-minimize" />
        </NormalButton>
        <NormalButton
          onClick={() =>
            bridge
              .toggleMaximize()
              .then(() => bridge.isMaximized())
              .then((isMaximized) => setIsMaximized(isMaximized))
          }
        >
          {isMaximized ? (
            <i className="fa-regular fa-window-restore" />
          ) : (
            <i className="fa-regular fa-window-maximize" />
          )}
        </NormalButton>

        <CloseButton onClick={() => bridge.close()}>
          <i className="fa-regular fa-xmark" />
        </CloseButton>
      </TitleButtonArea>
    </TitlebarContent>
  );
}

export default Titlebar;
