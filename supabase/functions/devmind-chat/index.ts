import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode, language, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (mode === "code") {
      systemPrompt = `You are DevMind, an expert coding assistant. Generate clean, well-commented ${language || "JavaScript"} code with explanations. Follow these guidelines:

1. Write production-ready code with proper error handling
2. Include detailed comments explaining complex logic
3. Follow language-specific best practices and conventions
4. Add type hints/annotations where applicable
5. Include usage examples when helpful

Format your response as code with comments. Be concise but thorough.`;
    } else if (mode === "image") {
      systemPrompt = `You are DevMind, a technical AI assistant. The user wants to generate an image. Acknowledge their request briefly and mention that image generation is being processed. Keep responses under 20 words.`;
    } else {
      systemPrompt = `You are DevMind, a professional AI coding assistant. You help developers with:
- Technical explanations and documentation
- Code review and best practices
- Architecture and design patterns
- Debugging and optimization
- Technology recommendations

Be concise, accurate, and professional. Use technical terminology appropriately.`;
    }

    // For image mode, we'll use the image generation model
    if (mode === "image") {
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: `Create a vibrant, colorful illustration: ${message}. Style: playful, dynamic, animated feel, modern and fun.`
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Image generation error:", errorText);
        throw new Error("Failed to generate image");
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      return new Response(
        JSON.stringify({
          response: "I've generated that image for you.",
          imageUrl: imageUrl || null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For text and code modes
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: mode === "code" ? aiResponse : aiResponse,
        code: mode === "code" ? aiResponse : undefined
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in devmind-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});