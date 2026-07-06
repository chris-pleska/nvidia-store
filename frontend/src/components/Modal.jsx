import { createPortal } from "react-dom";

export default function Modal({ onClose, children }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="mb-4 text-sm text-neutral-500 transition-colors hover:text-nvidia"
        >
          ✕ Close
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
