"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    router.push(`/video/${encodeURIComponent(input)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2">
      <input
        type="text"
        placeholder="Enter YouTube video URL or ID"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Track
      </button>
    </form>
  );
}
