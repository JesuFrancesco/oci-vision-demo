import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const queryParams = req.nextUrl.searchParams;

  if (!queryParams.has("data")) {
    return new Response("Missing 'data' query parameter", { status: 400 });
  }

  const camera = queryParams.get("camera");
  const market = queryParams.get("market");
  const imageURL = queryParams.get("imageURL");

  // TODO: get heatmap data from OCI Vision service using the provided parameters

  return NextResponse.json(
    { message: "Heatmap data processed", camera, market, imageURL },
    { status: 200 }
  );
}
