import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ELEVENLABS_AGENT_ID = "YOUR_AGENT_ID"; // We'll use overrides instead

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const { userProfile } = await req.json().catch(() => ({}));

    // Build a personalized system prompt
    let prompt = `You are Pathwise AI Advisor — a warm, friendly, and knowledgeable career and education counselor. You speak naturally like a real advisor sitting across the table from the student. Keep your answers concise (2-4 sentences max for voice). Be encouraging but realistic. Give specific, actionable advice.`;

    if (userProfile) {
      const parts: string[] = [];
      if (userProfile.educationLevel) parts.push(`Education level: ${userProfile.educationLevel}`);
      if (userProfile.careerInterests?.length) parts.push(`Career interests: ${userProfile.careerInterests.join(", ")}`);
      if (userProfile.longTermGoals?.length) parts.push(`Goals: ${userProfile.longTermGoals.join(", ")}`);
      if (userProfile.schoolName) parts.push(`School: ${userProfile.schoolName}`);
      if (parts.length > 0) {
        prompt += `\n\nUser Profile:\n${parts.join("\n")}\n\nAlways personalize advice based on this profile.`;
      }
    }

    // Create a conversational AI agent on the fly using the ElevenLabs API
    const agentResponse = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Pathwise Advisor",
        conversation_config: {
          agent: {
            prompt: { prompt },
            first_message: "Hey there! I'm your Pathwise advisor. What's on your mind today — career questions, school choices, interview prep, or something else?",
            language: "en",
          },
          tts: {
            voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah - friendly female voice
          },
        },
      }),
    });

    if (!agentResponse.ok) {
      const errText = await agentResponse.text();
      console.error("Agent creation failed:", agentResponse.status, errText);
      throw new Error(`Failed to create agent: ${agentResponse.status}`);
    }

    const agent = await agentResponse.json();
    const agentId = agent.agent_id;

    // Now get a conversation token for this agent
    const tokenResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token generation failed:", tokenResponse.status, errText);
      throw new Error(`Failed to get conversation token: ${tokenResponse.status}`);
    }

    const { token } = await tokenResponse.json();

    return new Response(JSON.stringify({ token, agentId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("elevenlabs-conversation-token error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
