import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BotIcon from "./icons/BotIcon.jsx";
import HelpWidgetGuide from "./HelpWidgetGuide.jsx";

const NUDGE_DELAY_MS = 20000;

export default function HelpWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  useEffect(() => {
    if (nudgeDismissed || isOpen) return undefined;

    const timer = setTimeout(() => {
      setNudgeVisible(true);
    }, NUDGE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [nudgeDismissed, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setNudgeVisible(false);
      setNudgeDismissed(true);
    }
  }, [isOpen]);

  function dismissNudge() {
    setNudgeVisible(false);
    setNudgeDismissed(true);
  }

  const showNudge =
    nudgeVisible && !isOpen && location.pathname !== "/requests";

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
          <div className="min-h-[160px] p-4">
            <HelpWidgetGuide onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {showNudge && (
        <div className="relative max-w-[220px] rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 pr-6 shadow-lg">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-left text-sm text-neutral-100"
          >
            Not sure where to start? I can help you choose 👋
          </button>
          <button
            type="button"
            onClick={dismissNudge}
            aria-label="Dismiss"
            className="absolute right-1.5 top-1.5 text-xs leading-none text-neutral-500 transition-colors hover:text-neutral-300"
          >
            ✕
          </button>
          <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-neutral-800 bg-neutral-900" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Need help choosing?"
        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-nvidia bg-neutral-900 text-nvidia shadow-lg transition-transform hover:scale-105 ${
          showNudge ? "animate-nudge-bounce" : ""
        }`}
      >
        <BotIcon size={28} />
      </button>
    </div>
  );
}
