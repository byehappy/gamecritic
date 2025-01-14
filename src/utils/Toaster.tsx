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
} from "@/public/assets/icons/toaster/index";
import uuid4 from "uuid4";
import styled, { keyframes } from "styled-components";
import { TOAST_TIMEOUT } from "./constans";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import { useTheme } from "./hooks/useTheme";

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
  timeoutId: NodeJS.Timeout | null;
  remaining: number;
  start: number;
  callback: (toasterId: string) => void;
  resume?: () => void;
  pause?: () => void;
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
    opacity:0;
    transform:translateX(200%);
  }
`;
const progressBar = keyframes`
  from{
    width:100%;
  }
  to{
    width:0%;
  }
`;
const ProgressBar = styled.div`
  position: absolute;
  bottom: 1%;
  left: 0;
  height: 0.15em;
  background-color: #ab5ef1;
  animation: ${progressBar} ${TOAST_TIMEOUT - 500}ms linear 0s;
  border-radius: 1em;
`;
const ToasterWrapper = styled.div<{
  $backColor: string;
  $textColor: string;
  $fontSize: string;
}>`
  width: fit-content;
  margin-left: auto;
  white-space: normal;
  border-radius: 0.25em;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  padding: 0.5em;
  background: ${(props) => props.$backColor};
  color: ${(props) => props.$textColor};
  font-size: ${(props) => props.$fontSize};
  animation: ${fadeIn} 0.5s ease-in,
    ${fadeOut} 0.5s ease-out ${TOAST_TIMEOUT - 500}ms;
  &:hover {
    animation-play-state: paused;
    ${ProgressBar} {
      animation-play-state: paused;
    }
  }
  @media (max-width: 425px) {
    margin-left: unset;
  }
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
  const { theme } = useTheme();
  const glyph = typesIcon[toaster.type] || null;
  const handleMouseEnter = (toaster: Toaster) => {
    if (toaster.pause) toaster.pause();
    if (toaster.timeoutId) clearTimeout(toaster.timeoutId);
    toaster.timeoutId = null;
    toaster.remaining -= Date.now() - toaster.start;
  };
  const handleMouseLeave = (toaster: Toaster) => {
    if (toaster.timeoutId) return;
    toaster.start = Date.now();
    toaster.timeoutId = setTimeout(() => {
      toaster.callback(toaster.id);
    }, toaster.remaining);
    if (toaster.resume) toaster.resume();
  };
  return (
    <ToasterWrapper
      $backColor={theme.colors.bg}
      $textColor={theme.colors.font}
      $fontSize={theme.fontSizes.adaptivSmallText}
      key={toaster.id}
      onMouseEnter={() => handleMouseEnter(toaster)}
      onMouseLeave={() => handleMouseLeave(toaster)}
    >
      <StyledMessage>
        {glyph} {toaster.content}{" "}
        {toaster.cancel && (
          <Button
            icon={<RollbackOutlined />}
            onClick={toaster.cancel}
            style={{ background: theme.colors.bg, color: theme.colors.font }}
          />
        )}
      </StyledMessage>
      {toaster.cancel && <ProgressBar />}
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
  @media (max-width: 425px) {
    bottom: 5vh;
    right: 0;
    max-width:none;
    width:100%;
    align-items: center;
  }
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
  delToasterTierId: (tierId: string) => void;
  addMessage: (message: string, type: MessageType) => void;
  addCancelable: (
    cancel: () => void,
    resume: () => void,
    pause: () => void,
    message?: string,
    tierId?: string
  ) => void;
  reqIds: string[];
  setReqIds: React.Dispatch<React.SetStateAction<string[]>>;
} | null>(null);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasters, setToasters] = useState<Toaster[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>();
  const [reqIds, setReqIds] = useState<string[]>([]);

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
    const timeoutId = setTimeout(() => {
      setToasters((prev) =>
        prev.filter((toaster) => toaster.id !== newToaster.id)
      );
    }, TOAST_TIMEOUT);
    const newToaster: Toaster = {
      type,
      content: message,
      id: uuid4(),
      remaining: TOAST_TIMEOUT,
      timeoutId,
      start: Date.now(),
      callback: (toasterId: string) => {
        setToasters((prev) =>
          prev.filter((toaster) => toaster.id !== toasterId)
        );
      },
    };
    setToasters((prev) => {
      const newToasters = prev.length >= 10 ? prev.slice(1) : prev;
      return [...newToasters, newToaster];
    });
  }, []);

  const addCancelable = useCallback(
    (
      cancel: () => void,
      resume: () => void,
      pause: () => void,
      message?: string,
      tierId?: string
    ) => {
      const timeoutId = setTimeout(() => {
        setToasters((prev) =>
          prev.filter((toaster) => toaster.id !== newToaster.id)
        );
      }, TOAST_TIMEOUT);
      const newToaster: Toaster = {
        type: "warning",
        content: message ?? "Отменить действие?",
        cancel: () => {
          cancel();
          setToasters((prev) =>
            prev.filter((toaster) => toaster.id !== newToaster.id)
          );
        },
        id: tierId ?? uuid4(),
        remaining: TOAST_TIMEOUT,
        timeoutId,
        start: Date.now(),
        callback: (toasterId: string) => {
          setToasters((prev) =>
            prev.filter((toaster) => toaster.id !== toasterId)
          );
        },
        resume,
        pause,
      };

      setToasters((prev) => {
        const newToasters = prev.length >= 10 ? prev.slice(1) : prev;
        return [...newToasters, newToaster];
      });
    },
    []
  );
  const delToasterTierId = useCallback((tierId: string) => {
    setToasters((prev) => prev.filter((toaster) => toaster.id !== tierId));
  }, []);

  const ToasterProperties = useMemo(
    () => ({
      toasters,
      addMessage,
      addCancelable,
      reqIds,
      setReqIds,
      delToasterTierId,
    }),
    [addCancelable, addMessage, reqIds, toasters, delToasterTierId]
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
