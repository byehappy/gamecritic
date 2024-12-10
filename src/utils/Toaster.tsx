import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "../assets/icons/toaster";
import uuid4 from "uuid4";
import styled, { keyframes } from "styled-components";
import { TOAST_TIMEOUT } from "./constans";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";

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
  cancel?: () => void;
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
const ToasterWrapper = styled.div`
  width: fit-content;
  margin-left: auto;
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
  Button {
    border: none;
  }
`;

const Toaster: React.FC<{
  toaster: Toaster;
}> = ({ toaster }) => {
  const glyph = typesIcon[toaster.type] || null;

  return (
    <ToasterWrapper key={toaster.id}>
      <StyledMessage>
        {glyph} {toaster.content}{" "}
        {toaster.cancel && (
          <Button icon={<RollbackOutlined />} onClick={toaster.cancel} />
        )}
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
  display: flex;
  gap: 2vh;
  flex-direction: column-reverse;
  max-width: 35vw;
`;

export const ToasterList: React.FC<{
  toasters: Toaster[];
}> = ({ toasters }) => {
  return (
    <StyledList id="toaster-list">
      {toasters.map((toaster) => (
        <Toaster key={toaster.id} toaster={toaster} />
      ))}
    </StyledList>
  );
};

export const ToasterContext = createContext<{
  toasters: Toaster[];
  addMessage: (message: string, type: MessageType) => void;
  addCancelable: (cancel: () => void) => void;
} | null>(null);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasters, setToasters] = useState<Toaster[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>();

  useEffect(() => {
    if (
      toasters.length > 0 &&
      !container &&
      !document.querySelector("#toaster-container")
    ) {
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
      setToasters((prev) =>
        prev.filter((toaster) => toaster.id !== newToaster.id)
      );
    }, TOAST_TIMEOUT);
  }, []);

  const addCancelable = useCallback((cancel: () => void) => {
    const newToaster: Toaster = {
      type: "warning",
      content: "Отменить действие?",
      cancel: cancel,
      id: uuid4(),
    };

    setToasters((prev) => {
      const newToasters = prev.length >= 10 ? prev.slice(1) : prev;
      return [...newToasters, newToaster];
    });
    setTimeout(() => {
      setToasters((prev) =>
        prev.filter((toaster) => toaster.id !== newToaster.id)
      );
    }, TOAST_TIMEOUT);
  }, []);
  const ToasterProperties = useMemo(
    () => ({ toasters, addMessage, addCancelable }),
    [addCancelable, addMessage, toasters]
  );
  useEffect(() => {
    if (toasters.length === 0 && container) {
      document.body.removeChild(container);
      setContainer(null);
    }
  }, [toasters, container]);
  return (
    <ToasterContext.Provider value={ToasterProperties}>
      {children}
      {container &&
        createPortal(<ToasterList toasters={toasters} />, container)}
    </ToasterContext.Provider>
  );
};
