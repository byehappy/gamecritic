import { useCallback, useEffect, useState } from "react";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "../assets/icons/toaster";
import uuid4 from "uuid4";
import styled, { keyframes } from "styled-components";
import { TOAST_TIMEOUT } from "./constans";

type MessageType = "error" | "info" | "warning" | "success";

const typesIcon: Record<MessageType, JSX.Element> = {
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
  success: <SuccessIcon />,
};

type Toaster = {
  id: string;
  type: MessageType;
  content: string;
};

export const useToaster = () => {
  const [toasters, setToasters] = useState<Toaster[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>();

  useEffect(() => {
    if (toasters.length > 0 && !container) {
      const toasterContainer = document.createElement("div");
      toasterContainer.id = "toaster-container";
      document.body.appendChild(toasterContainer);
      setContainer(toasterContainer);
    }
  }, [container, toasters.length]);

  const addMessage = useCallback((message: string, type: MessageType) => {
    const newToaster: Toaster = { type, content: message, id: uuid4() };
    setToasters((prev) => {
      const newToasters = prev.length >= 10 ? prev.slice(1) : prev;
      return [...newToasters, newToaster];
    });

    setTimeout(() => {
      setToasters((prev) => prev.slice(1));
    }, TOAST_TIMEOUT);
  }, []);

  useEffect(() => {
    if (toasters.length === 0 && container) {
      document.body.removeChild(container);
      setContainer(null);
    }
  }, [toasters, container]);

  return { addMessage, container, toasters };
};

const fadeIn = keyframes`
  from{
    opacity:0;
    transform:translateX(100%);
  }
  to{
    opacity:1;
    transform:translateX(0%);
  }
`;
const fadeOut = keyframes`
  from{
    opacity:1;
    transform:translateX(0%);
  }
  to{
    opacity:1;
    transform:translateX(100%);
  }
`;

const ToasterWrapper = styled.div<{ $isClosing?: boolean }>`
  width: fit-content;
  margin-left:auto;
  white-space: normal;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  padding: 0.5em;
  background: white;
  animation: ${fadeIn} 0.5s ease-in,
    ${fadeOut} 0.5s ease-out ${TOAST_TIMEOUT - 500}ms;
`;

const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  font-size: 1rem;
  svg {
    height: 2.5vh;
  }
`;

const Toaster: React.FC<{
  toaster: Toaster;
}> = ({ toaster }) => {
  const glyph = typesIcon[toaster.type] || null;
  return (
    <ToasterWrapper>
      <StyledMessage>
        {glyph} {toaster.content}
      </StyledMessage>
    </ToasterWrapper>
  );
};

const StyledList = styled.div`
  position: fixed;
  bottom: 10vh;
  right: 1vw;
  z-index: 100;
  border-radius: 5px;
  display: flex;
  gap: 2vh;
  flex-direction: column-reverse;
  max-width: 35vw;
`;

export const ToasterList: React.FC<{
  toasters: Toaster[];
}> = ({ toasters }) => (
  <StyledList id="toaster-list">
    {toasters.map((toaster) => (
      <Toaster key={toaster.id} toaster={toaster} />
    ))}
  </StyledList>
);
