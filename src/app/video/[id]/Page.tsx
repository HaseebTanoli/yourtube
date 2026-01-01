"use client";

import { useEffect, useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";

export default function VideoPage({ params }: { params: { id: string } }) {
  const [views, setViews] = useState(0);
  const [rate, setRate] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/video?id=${params.id}`, {
        cache: "no-store",
      });
      const data = await res.json();

      setViews(data.views);
      setRate(data.rate);
      setLastUpdated(Date.now());
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // API poll
    return () => clearInterval(interval);
  }, [params.id]);

  // Live estimation (per-video polling)
  const liveViews = Math.floor(
    views + rate * ((Date.now() - lastUpdated) / 1000)
  );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-xl">
        <h1 className="text-xl font-semibold mb-4">Live View Count</h1>

        <div className="text-5xl font-bold text-blue-600 mb-2">
          <AnimatedNumber value={liveViews} />
        </div>

        <p className="text-gray-500 text-sm">
          Updating automatically · Estimated live views
        </p>
      </div>
    </main>
  );
}
