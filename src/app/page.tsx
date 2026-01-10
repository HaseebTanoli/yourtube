"use client";

import React, { useState, useEffect } from "react";
import { Play, TrendingUp, Eye, Loader2 } from "lucide-react";

const YouTubePlaylistTracker = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevRanks, setPrevRanks] = useState({});

  // Replace with your actual YouTube API key
  const API_KEY = "YOUR_YOUTUBE_API_KEY_HERE";

  // Top Pakistani drama playlists from popular channels
  const PLAYLIST_IDS = [
    { id: "PLkSNSLDkNH0W7P8YzJJcW0OJq3hZgxqOW", channel: "ARY Digital HD" }, // Example
    { id: "PLkSNSLDkNH0XYvQ5Z9eQp5VZQ6xYq8Z9Y", channel: "HUM TV" }, // Example
    { id: "PLkSNSLDkNH0Vq8Z5X9eQp5VZQ6xYq8Z9Z", channel: "Har Pal Geo" }, // Example
    // Add more real playlist IDs here
  ];

  const fetchPlaylistData = async (playlistId, channelName) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const playlist = data.items[0];

        // Fetch all videos in the playlist to calculate total views
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
        );

        const videosData = await videosResponse.json();
        const videoIds = videosData.items
          .map((item) => item.contentDetails.videoId)
          .join(",");

        // Fetch video statistics
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
        );

        const statsData = await statsResponse.json();

        // Calculate total views
        const totalViews = statsData.items.reduce((sum, video) => {
          return sum + parseInt(video.statistics.viewCount || 0);
        }, 0);

        return {
          id: playlistId,
          name: playlist.snippet.title,
          channel: channelName,
          views: totalViews,
          thumbnail:
            playlist.snippet.thumbnails.high?.url ||
            playlist.snippet.thumbnails.default.url,
          videoCount: playlist.contentDetails.itemCount,
        };
      }
      return null;
    } catch (err) {
      console.error(`Error fetching playlist ${playlistId}:`, err);
      return null;
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);

      const playlistPromises = PLAYLIST_IDS.map((item) =>
        fetchPlaylistData(item.id, item.channel)
      );

      const results = await Promise.all(playlistPromises);
      const validPlaylists = results.filter((p) => p !== null);

      // Sort by views (descending)
      const sorted = validPlaylists.sort((a, b) => b.views - a.views);
      setPlaylists(sorted);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch playlist data. Please check your API key.");
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  // Refresh data every 60 seconds (to stay within API quota)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllPlaylists();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Track rank changes
  useEffect(() => {
    const newRanks = {};
    playlists.forEach((playlist, index) => {
      newRanks[playlist.id] = index;
    });
    setPrevRanks(newRanks);
  }, [playlists]);

  const formatViews = (views) => {
    if (views >= 1000000000) {
      return `${(views / 1000000000).toFixed(2)}B`;
    }
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(2)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(2)}K`;
    }
    return views.toLocaleString();
  };

  const getRankChange = (playlistId, currentIndex) => {
    const prevRank = prevRanks[playlistId];
    if (prevRank === undefined || prevRank === currentIndex) return null;
    return prevRank > currentIndex ? "up" : "down";
  };

  if (loading && playlists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading playlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllPlaylists}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Play className="text-red-600" size={40} />
            Top Pakistani Drama Playlists
          </h1>
          <p className="text-gray-600 text-lg">
            Live view count tracker • Updates every 60 seconds
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Updates Active
          </div>
        </div>

        {/* Playlist Cards */}
        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No playlists found. Please check your playlist IDs.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {playlists.map((playlist, index) => {
              const rankChange = getRankChange(playlist.id, index);

              return (
                <div
                  key={playlist.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-red-200"
                >
                  <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : index === 2
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                            : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {rankChange && (
                        <div
                          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            rankChange === "up" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <TrendingUp
                            size={14}
                            className={`text-white ${
                              rankChange === "down" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {playlist.channel}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        {playlist.videoCount} videos
                      </p>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 font-semibold">
                        <Eye size={20} />
                        <span className="text-2xl font-bold">
                          {formatViews(playlist.views)}
                        </span>
                        <span className="text-sm text-gray-500">views</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full md:w-auto md:flex-shrink-0">
                      <div className="bg-gray-200 rounded-full h-2 w-full md:w-32">
                        <div
                          className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              (playlist.views / 1500000000) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {((playlist.views / 1500000000) * 100).toFixed(1)}% to
                        1.5B
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Data updates automatically every 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlaylistTracker;
