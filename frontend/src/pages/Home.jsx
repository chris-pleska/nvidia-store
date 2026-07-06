import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-nvidia">Chris's Silicon Supply Co.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-neutral-400">
        We sell real NVIDIA hardware, from single consumer GPUs to full
        datacenter racks. If you're not sure what you need, we'll help you
        figure out the right hardware to run specific open-source AI models,
        with guided recommendations built for startups and mid-size companies
        alike.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/shop"
          className="rounded-md bg-nvidia px-5 py-2.5 font-semibold text-neutral-950 transition-opacity hover:opacity-90"
        >
          Browse the Shop
        </Link>
        <Link
          to="/help-me-choose"
          className="rounded-md border border-nvidia/40 px-5 py-2.5 font-medium text-nvidia transition-colors hover:bg-nvidia/10"
        >
          Help Me Choose
        </Link>
      </div>
    </main>
  );
}
