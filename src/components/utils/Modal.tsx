import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { cn } from "../../lib/utils/cn";
import { X ,EllipsisVertical } from "lucide-react";

interface Props {
  /** Whether the modal is open or not */
  open: boolean;
  /** Function to set the modal's open state */
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  /** The content to display inside the modal */
  children: React.ReactNode;
  /** Custom class name for the modal wrapper */
  dialogClassName?: string;
  /** Whether to show a close button or not */
  showCloseBtn?: boolean;
  /** Callback function when the close button is clicked */
  onCloseClick?: () => void;
  /** Custom class name for the modal wrapper div */
  modalWrapperClassName?: string;
  /** Custom class name for the close button */
  btnClassName?: string;
  /** Custom class name for the overlay */
  overlayClassName?: string;
  /** Custom class name for the fixed positioning of the modal */
  fixedClassName?: string;
}

/**
 * Modal component that displays content in a centered overlay with an optional close button.
 * It uses React Portal to render the modal in a separate part of the DOM.
 *
 * @param {Props} props The properties of the modal.
 * @returns {JSX.Element | null} The rendered modal or null if not open.
 */
const Modal = (props: Props) => {
  const renderer = document.getElementById("modal-root");
  if (!renderer)
    throw new Error("No modal root found, add this to your index.html file");
  if (!props.open) return null;

  const handleCloseButtonClick = () => {
    if(props.setOpen)  props.setOpen(false);
    if (props.onCloseClick) props.onCloseClick();
  };

  return ReactDOM.createPortal(
    <div
      className={cn(
        "fixed inset-0 grid min-w-screen overflow-y-auto min-h-screen w-full h-full place-items-center z-[99999] p-4 overscroll-contain box-border",
        props.fixedClassName
      )}
    >
      <div
        onClick={handleCloseButtonClick}
        className={cn(
          "fixed w-full h-full min-h-screen bg-black/50 backdrop-blur-md",
          props.overlayClassName
        )}
      ></div>

      <div
        className={cn(
          "z-[999999] rounded-2xl overflow-y-clip fade-down relative bg-white",
          props.modalWrapperClassName
        )}
      >
        {props.showCloseBtn && (
          <button
            type="button"
            className={cn("absolute top-4 right-4 z-10", props.btnClassName)}
            onClick={handleCloseButtonClick}
          >
            <X size={24} />
          </button>
        )}
        {props.children}
      </div>
    </div>,
    renderer
  );
};

export default Modal;