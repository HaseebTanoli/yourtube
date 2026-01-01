"use client";

import { useEffect, useState } from "react";

export default function TrendingVideos() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/trending")
      .then((res) => res.json())
      .then(setVideos);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((v, i) => (
        <div key={i} className="bg-white p-4 rounded shadow">
          <p className="font-semibold">{v.title}</p>
          <p className="text-sm text-gray-500">
            {v.views.toLocaleString()} views
          </p>
        </div>
      ))}
    </div>
  );
}
