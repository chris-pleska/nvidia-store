import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

const REQUESTS_URL = `${API_BASE_URL}/api/quote-requests`;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(REQUESTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Quote <span className="text-nvidia">Requests</span>
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-neutral-400">Loading requests...</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-red-400">
          Couldn't reach the backend. Is the Flask server running?
        </p>
      )}

      {status === "loaded" && requests.length === 0 && (
        <p className="mt-6 text-neutral-400">No requests submitted yet.</p>
      )}

      {status === "loaded" && requests.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-500">
                <th className="px-4 py-3 font-medium">Request #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Build</th>
                <th className="px-4 py-3 font-medium">Total Price</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-neutral-800 bg-neutral-900/50 last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-nvidia">
                    {req.request_number}
                  </td>
                  <td className="px-4 py-3 text-neutral-100">
                    {req.customer_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {req.customer_contact}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {req.build_description}
                  </td>
                  <td className="px-4 py-3 text-neutral-100">
                    {currencyFormatter.format(req.total_price_usd)}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {formatDate(req.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
