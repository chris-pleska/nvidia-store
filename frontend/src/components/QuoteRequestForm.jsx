import { useState } from "react";
import { API_BASE_URL } from "../config.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function QuoteRequestForm({ build }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestNumber, setRequestNumber] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    fetch(`${API_BASE_URL}/api/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_contact: contact,
        build_description: build.description,
        total_price_usd: build.totalPrice,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            data?.error || "Something went wrong. Please try again.",
          );
        }
        return data;
      })
      .then((data) => {
        setRequestNumber(data.request_number);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus("error");
      });
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-nvidia/40 bg-neutral-900 p-6">
        <p className="text-lg font-semibold text-nvidia">
          Request submitted! Your reference number is {requestNumber}.
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          We'll reach out to {contact} shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-6"
    >
      <div className="rounded-md border border-neutral-800 bg-neutral-950 p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Build Summary
        </p>
        <p className="mt-1 text-base font-medium text-neutral-100">
          {build.description}
        </p>
        <p className="mt-1 text-lg font-bold text-nvidia">
          {currencyFormatter.format(build.totalPrice)}
        </p>
      </div>

      <div className="mt-4">
        <label
          className="block text-sm text-neutral-400"
          htmlFor="quote-name"
        >
          Name
        </label>
        <input
          id="quote-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-nvidia focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label
          className="block text-sm text-neutral-400"
          htmlFor="quote-contact"
        >
          Email or phone
        </label>
        <input
          id="quote-contact"
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-nvidia focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-md bg-nvidia px-4 py-2 font-semibold text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
