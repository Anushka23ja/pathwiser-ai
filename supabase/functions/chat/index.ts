import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a personalized system prompt from the user's profile
    let systemPrompt = `You are Pathwise AI Advisor — a friendly, knowledgeable career and education counselor. You give clear, actionable advice about college, careers, majors, financial aid, and professional development.

Keep responses concise (2-4 paragraphs max). Use bullet points when listing options. Be encouraging but realistic. Always tailor your advice to the user's specific situation.`;

    if (userProfile) {
      const parts: string[] = [];
      if (userProfile.educationLevel) parts.push(`Education level: ${userProfile.educationLevel}`);
      if (userProfile.levelDetails?.length) parts.push(`Current focus areas: ${userProfile.levelDetails.join(", ")}`);
      if (userProfile.careerInterests?.length) parts.push(`Career interests: ${userProfile.careerInterests.join(", ")}`);
      if (userProfile.whyUsing?.length) parts.push(`Goals: ${userProfile.whyUsing.join(", ")}`);
      if (userProfile.schoolName) parts.push(`School/Company: ${userProfile.schoolName}`);

      if (parts.length > 0) {
        systemPrompt += `\n\nUser Profile:\n${parts.join("\n")}

IMPORTANT: Always personalize your responses based on this profile. Reference their education level, interests, and goals when relevant. For example, if they're a high school student interested in Running Start, proactively mention dual enrollment options. If they're a first-gen student, highlight support programs and scholarships.`;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
