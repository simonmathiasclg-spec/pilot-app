import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("🚨 Backend Error: API key is missing. Check your .env.local file.");
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    let payload = {};

    if (body.isAnalysis) {
      payload = {
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: body.pdfBase64 } },
            { text: body.prompt }
          ]
        }],
        // Force strict JSON output
        generationConfig: {
          responseMimeType: "application/json"
        },
        // Turn off safety filters that block behavioral/psychological text
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      };
    } 
    else if (body.isChat) {
      payload = {
        systemInstruction: { parts: [{ text: body.systemInstruction }] },
        contents: body.messages.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // 1. Catch API-level errors from Google (like invalid keys)
    if (data.error) {
      console.error("🚨 Google API Error:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // 2. Extract the text safely
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // 3. Catch safety blocks or empty responses
    if (!aiText) {
      console.error("🚨 Unexpected Empty Gemini Response:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: "Gemini returned an empty response or blocked the content." }, { status: 500 });
    }
    
    return NextResponse.json({ text: aiText });
    
  } catch (error) {
    console.error("🚨 Internal Server Error:", error);
    return NextResponse.json({ error: 'Failed to fetch from Gemini' }, { status: 500 });
  }
}