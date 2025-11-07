import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await req.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "user@example.com" && password === "password") {
    return new Response("Login successful", { status: 200 });
  }

  return new Response("Invalid credentials", { status: 401 });
}
