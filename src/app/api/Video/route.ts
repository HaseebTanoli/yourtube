import { NextResponse } from "next/server";
import axios from "axios";

/**
 * In-memory cache (simple, fast)
 * In production → Redis / KV store
 */
const cache = new Map<
  string,
  {
    views: number;
    lastFetched: number;
    rate: number;
  }
>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing video id" }, { status: 400 });
  }

  const cached = cache.get(id);
  const now = Date.now();

  // Return cached value if fetched recently
  if (cached && now - cached.lastFetched < 25_000) {
    return NextResponse.json(cached);
  }

  try {
    const url = `https://www.youtube.com/watch?v=${id}`;

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    /**
     * Extract view count from ytInitialPlayerResponse
     */
    const match = html.match(/"viewCount":"(\d+)"/);

    if (!match) {
      throw new Error("View count not found");
    }

    const views = Number(match[1]);

    let rate = 0;

    // Calculate growth rate
    if (cached) {
      const deltaViews = views - cached.views;
      const deltaTime = (now - cached.lastFetched) / 1000;
      rate = deltaTime > 0 ? deltaViews / deltaTime : 0;
    }

    const payload = {
      views,
      rate,
      lastFetched: now,
    };

    cache.set(id, payload);

    return NextResponse.json(payload);
  } catch (err) {
    console.error("YouTube scrape failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
