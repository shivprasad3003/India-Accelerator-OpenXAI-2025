import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { reply: "⚠️ Please enter a valid message." },
        { status: 400 }
      );
    }

    // Build messages array for multi-turn context
    const messages = [
      { role: "system", content: "You are a helpful AI financial assistant." },
      ...(history || []), // keep past messages if provided
      { role: "user", content: message },
    ];

    // Call Ollama's chat API
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3", // or "llama3:latest"
        messages,
        stream: false, // change to true for word-by-word streaming
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Ollama API error:", err);
      return NextResponse.json(
        { reply: "⚠️ Failed to connect to Ollama." },
        { status: 500 }
      );
    }

    const data = await response.json();

    const reply =
      data?.message?.content ||
      data?.messages?.[0]?.content ||
      "⚠️ No response from Llama3 model.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Ollama Chat API Error:", error);
    return NextResponse.json(
      { reply: "⚠️ Internal server error in chatbot." },
      { status: 500 }
    );
  }
}
