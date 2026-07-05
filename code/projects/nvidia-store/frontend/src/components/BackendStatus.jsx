import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

const HEALTH_URL = `${API_BASE_URL}/api/health`;

export default function BackendStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch(HEALTH_URL)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => setStatus(data.status === "ok" ? "connected" : "error"))
      .catch(() => setStatus("disconnected"));
  }, []);

  const dotColor =
    status === "connected"
      ? "bg-nvidia"
      : status === "checking"
        ? "bg-neutral-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-400">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      backend: {status}
    </div>
  );
}
