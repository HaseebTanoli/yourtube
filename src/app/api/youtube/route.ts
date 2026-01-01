import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "US";

  if (!API_KEY) {
    return NextResponse.json([], { status: 200 });
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=${country}&key=${API_KEY}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();

    // ✅ ALWAYS return array
    return NextResponse.json(Array.isArray(data.items) ? data.items : []);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
