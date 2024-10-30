import { ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalOverlay, ModalWindow } from "./Modal.style";
const modalRootElement: Element = document.querySelector("#portal")!;

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ isOpen, onClose, children }) => {
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
    }
    if (!isOpen) {
      document.body.removeEventListener("keydown", checkKeyEscape);
      document.removeEventListener("mousedown", checkOutside);
    }
    return () => {
      document.body.removeEventListener("keydown", checkKeyEscape);
      document.removeEventListener("mousedown", checkOutside);
    };
  }, [checkKeyEscape, checkOutside, isOpen]);

  return createPortal(
    isOpen ? (
      <ModalOverlay>
        <ModalWindow ref={ref}>{children}</ModalWindow>
      </ModalOverlay>
    ) : null,
    modalRootElement
  );
};
