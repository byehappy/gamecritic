import { ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalHeader, ModalOverlay, ModalWindow } from "./Modal.style";
import { CloseOutlined } from "@ant-design/icons";
const modalRootElement: Element = document.querySelector("#portal")!;

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  widthMin?: boolean;
}> = ({ isOpen, onClose, children, header, widthMin = false }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const checkKeyEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  const checkOutside = useCallback(
    (event: MouseEvent) => {
      if (
        (event.target as HTMLElement).contains(ref.current) &&
        event.target !== ref.current
      ) {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener("keydown", checkKeyEscape);
      document.addEventListener("mousedown", checkOutside);
      document.body.style.overflow = "hidden";
    }
    if (!isOpen) {
      document.body.removeEventListener("keydown", checkKeyEscape);
      document.removeEventListener("mousedown", checkOutside);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.removeEventListener("keydown", checkKeyEscape);
      document.removeEventListener("mousedown", checkOutside);
      document.body.style.overflow = "unset";
    };
  }, [checkKeyEscape, checkOutside, isOpen]);

  return createPortal(
    isOpen ? (
      <ModalOverlay>
        <ModalWindow ref={ref} $widthMin={widthMin}>
          <ModalHeader $haveHeader={header !== undefined}>
            {header}
            <CloseOutlined onClick={onClose} />
          </ModalHeader>
          {children}
        </ModalWindow>
      </ModalOverlay>
    ) : null,
    modalRootElement
  );
};
