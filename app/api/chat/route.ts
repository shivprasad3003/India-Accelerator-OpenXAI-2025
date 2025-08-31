import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Call Ollama (must be running locally at port 11434)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:latest", // or "llama3:latest"
        prompt,
        stream: false,   // prevents streaming → easier to parse
      }),
    });

    const data = await response.json();

    return NextResponse.json({ reply: data.response || data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to connect to Llama3" },
      { status: 500 }
    );
  }
}
