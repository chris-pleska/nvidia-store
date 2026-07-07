import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

const HEALTH_URL = `${API_BASE_URL}/api/health`;

export default function BackendStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetch(HEALTH_URL)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => setIsOffline(data.status !== "ok"))
      .catch(() => setIsOffline(true));
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      backend offline
    </div>
  );
}
