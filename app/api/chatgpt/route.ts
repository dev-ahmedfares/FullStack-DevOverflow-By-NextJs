import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const responseData = await res.json();
    console.log("responseData",responseData)
    const replay = responseData?.choices[0].message.content;

    return NextResponse.json({ replay });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
};
