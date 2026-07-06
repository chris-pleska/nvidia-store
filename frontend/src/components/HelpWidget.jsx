import { useState } from "react";
import BotIcon from "./icons/BotIcon.jsx";

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <h2 className="text-sm font-semibold text-neutral-100">
              Need help choosing?
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-neutral-500 transition-colors hover:text-nvidia"
            >
              ✕
            </button>
          </div>
          <div className="min-h-[160px] p-4" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Need help choosing?"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-nvidia bg-neutral-900 text-nvidia shadow-lg transition-transform hover:scale-105"
      >
        <BotIcon size={28} />
      </button>
    </div>
  );
}
