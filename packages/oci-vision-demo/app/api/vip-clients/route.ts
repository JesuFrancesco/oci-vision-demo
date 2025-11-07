import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const queryParams = req.nextUrl.searchParams;

  if (!queryParams.has("data")) {
    return new Response("Missing 'data' query parameter", { status: 400 });
  }

  const market = queryParams.get("market");

  // TODO: get vip client faces from OCI Vision service using the provided parameters

  return NextResponse.json(
    { message: "VIP client data processed", market },
    { status: 200 }
  );
}
