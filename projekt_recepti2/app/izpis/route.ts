import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const host = headersList.get("host");

  const response = NextResponse.redirect(
    `http://${host}/`
  );

  // izbrišemo cookie
  response.cookies.set("authToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
