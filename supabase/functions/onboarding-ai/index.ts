import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";
    // Use fast model for questions, better model for roadmap
    let model = "google/gemini-2.5-flash-lite";

    if (action === "generate_questions") {
      const { educationLevel, stage, previousAnswers } = context;

      systemPrompt = `You are an onboarding assistant for Pathwise, a career/education planning app. Generate personalized options based on the user's stage.

Return JSON only:
{"situationOptions":[{"label":"short title","description":"1 sentence"}],"whyOptions":["reason"],"careerOptions":["field name"]}

Rules:
- 6-8 situationOptions specific to their exact stage
- 6-8 whyOptions reflecting realistic motivations
- 10-12 careerOptions relevant to their stage
- For new grads / college seniors: include job search, interview prep, resume building, salary negotiation, LinkedIn optimization
- For masters applicants: GRE, SOP, fellowships — NOT undergrad topics
- For professionals: advancement, upskilling — NOT college apps
- Match high school options to specific grade level
- Be specific, no generic overlaps`;

      userPrompt = `Education: ${educationLevel}, Stage: ${stage}, School: ${previousAnswers?.schoolName || "N/A"}, Major: ${previousAnswers?.intendedMajor || "N/A"}, Experience: ${previousAnswers?.yearsExperience || "N/A"}, Field: ${previousAnswers?.currentField || "N/A"}, Details: ${JSON.stringify(previousAnswers?.levelDetails || [])}`;

    } else if (action === "generate_roadmap") {
      model = "google/gemini-2.5-flash"; // Better model for roadmap quality
      const { educationLevel, stage, levelDetails, whyUsing, careerInterests, schoolName, intendedMajor, yearsExperience, currentField } = context;

      systemPrompt = `You are an AI career planning expert for Pathwise. Generate a personalized multi-year roadmap.

Return JSON only:
{"stageName":"friendly stage name","summary":"2-3 sentence personalized summary","years":[{"year":"e.g. Year 1","label":"phase name","description":"about this phase","phase":"Exploration|Preparation|Execution|Transition|Growth","months":[{"month":"e.g. January","actions":[{"id":"unique-kebab-id","title":"specific task","description":"how to do it","category":"academics|testing|applications|career|networking|financial|personal|research","urgent":false}]}]}]}

Rules:
- 2-3 years of roadmap (keep it focused, not overwhelming)
- Each year: 3-4 months with 2-3 actions each
- Mark time-sensitive items urgent (FAFSA deadlines, application dates)
- For NEW GRADS and COLLEGE SENIORS: prioritize job search strategy, resume/portfolio building, interview prep (behavioral + technical), LinkedIn/networking, salary negotiation, company research, career fair prep, informational interviews
- For master's applicants: GRE/GMAT prep, SOP writing, program research, funding
- Use real deadlines where applicable
- Every action must be specific to THIS user's career interests
- Each action id must be unique`;

      userPrompt = `Education: ${educationLevel}, Stage: ${stage}, School: ${schoolName || "N/A"}, Major: ${intendedMajor || "N/A"}, Experience: ${yearsExperience || "N/A"}, Field: ${currentField || "N/A"}, Situation: ${JSON.stringify(levelDetails || [])}, Why: ${JSON.stringify(whyUsing || [])}, Careers: ${JSON.stringify(careerInterests || [])}`;

    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ action, result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("onboarding-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
