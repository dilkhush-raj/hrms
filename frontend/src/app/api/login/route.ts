// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error },
      { status: response.status }
    );
  }

  return NextResponse.json(data, {
    status: 200,
    headers: response.headers,
  });
}
