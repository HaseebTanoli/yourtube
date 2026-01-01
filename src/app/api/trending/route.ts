import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { title: "Music Video 1", views: 15000000 },
    { title: "Gaming Stream", views: 9200000 },
    { title: "Podcast Clip", views: 7300000 },
  ]);
}
