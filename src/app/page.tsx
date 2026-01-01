"use client";
import SearchBar from "@/components/SearchBar";
import TrendingVideos from "@/components/TrendingVideos";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">YouTube Live View Counter</h1>
        <p className="text-gray-600 mb-8">
          Track video views in near real-time
        </p>
        <SearchBar />
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">Trending Videos</h2>
        <TrendingVideos />
      </section>
    </main>
  );
}
