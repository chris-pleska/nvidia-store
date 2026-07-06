import { useEffect, useState } from "react";
import ModelCard from "../components/ModelCard.jsx";
import { API_BASE_URL } from "../config.js";

const MODELS_URL = `${API_BASE_URL}/api/models`;

export default function ModelAdvisor() {
  const [models, setModels] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(MODELS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setModels(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Model <span className="text-nvidia">Advisor</span>
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-neutral-400">Loading models...</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-red-400">
          Couldn't reach the backend. Is the Flask server running?
        </p>
      )}

      {status === "loaded" && models.length === 0 && (
        <p className="mt-6 text-neutral-400">No models available yet.</p>
      )}

      {status === "loaded" && models.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </main>
  );
}
