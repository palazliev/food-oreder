import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, children, className = "", onClose }) {
  const modal = useRef();
  useEffect(() => {
    const dialog = modal.current;

    if (open) {
      dialog.showModal();
    }

    return () => dialog.close();
  }, [open]);

  return createPortal(
    <dialog ref={modal} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
