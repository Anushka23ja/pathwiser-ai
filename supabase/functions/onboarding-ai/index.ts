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

    if (action === "generate_questions") {
      const { educationLevel, stage, previousAnswers } = context;

      systemPrompt = `You are an AI onboarding assistant for Pathwise, a career and education planning platform. Based on what the user has already told us, generate the NEXT set of personalized questions/options.

RESPOND WITH EXACTLY THIS JSON FORMAT (no markdown, no extra text):
{
  "situationOptions": [
    { "label": "string - short title", "description": "string - 1-sentence explanation" }
  ],
  "whyOptions": ["string - reason for using the platform"],
  "careerOptions": ["string - career field name"]
}

Rules:
- Generate 6-8 situationOptions that are SPECIFIC to this exact user's stage. For example, a college sophomore should NOT see SAT prep options.
- Generate 6-8 whyOptions that reflect realistic motivations for someone at this exact stage.
- Generate 10-12 careerOptions tailored to what's realistic and relevant for their stage.
- If they're a masters applicant, focus on research, grad programs, fellowships, SOPs — NOT undergrad topics.
- If they're an early professional, focus on advancement, upskilling, leadership — NOT college applications.
- If they're in high school, match options to their specific grade (9th grader vs 12th grader have very different needs).
- Be specific, actionable, and avoid generic/overlapping options.
- Consider their previous answers to avoid redundancy and build on what they've shared.`;

      userPrompt = `User Profile So Far:
- Education Level: ${educationLevel}
- Specific Stage: ${stage}
- School/Company: ${previousAnswers?.schoolName || "Not specified"}
- Intended Major: ${previousAnswers?.intendedMajor || "Not specified"}
- Years of Experience: ${previousAnswers?.yearsExperience || "N/A"}
- Current Field: ${previousAnswers?.currentField || "Not specified"}
- Level Details Already Selected: ${JSON.stringify(previousAnswers?.levelDetails || [])}

Generate personalized question options for this specific user.`;

    } else if (action === "generate_roadmap") {
      const { educationLevel, stage, levelDetails, whyUsing, careerInterests, schoolName, intendedMajor, yearsExperience, currentField } = context;

      systemPrompt = `You are an AI career and education planning expert for Pathwise. Based on everything the user has shared during onboarding, generate a FULLY PERSONALIZED multi-year roadmap.

RESPOND WITH EXACTLY THIS JSON FORMAT (no markdown, no extra text):
{
  "stageName": "string - friendly name for user's current position",
  "summary": "string - 2-3 sentence personalized summary of this roadmap",
  "years": [
    {
      "year": "string - e.g. 'Year 1 (2025-2026)' or 'Next 6 Months'",
      "label": "string - phase name like 'Foundation Building'",
      "description": "string - what this phase is about",
      "phase": "string - one of: Exploration, Preparation, Execution, Transition, Growth",
      "months": [
        {
          "month": "string - e.g. 'January' or 'Month 1-2'",
          "actions": [
            {
              "id": "string - unique kebab-case id",
              "title": "string - specific actionable task",
              "description": "string - brief details on how to do it",
              "category": "string - one of: academics, testing, applications, career, networking, financial, personal, research",
              "urgent": false
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Generate 2-4 years of roadmap depending on stage (high schooler needs 4 years to college graduation, professional needs 1-2 years).
- Each year should have 4-6 months with 2-4 actions each.
- Mark truly time-sensitive items as urgent (deadlines like FAFSA, SAT registration, application deadlines).
- Every action must be SPECIFIC to this user's situation. An 11th grader interested in CS should see "Register for AP Computer Science" not generic "take classes."
- A master's applicant should see GRE prep, SOP drafts, program research — NOT undergrad activities.
- A professional should see industry certifications, networking events, skill-building — NOT college applications.
- Use real deadlines and timelines (e.g., "FAFSA opens October 1", "Common App due January 1").
- Consider their career interests when generating specific tasks.
- Each action id must be unique across the entire roadmap.`;

      userPrompt = `Complete User Profile:
- Education Level: ${educationLevel}
- Specific Stage: ${stage}
- School/Company: ${schoolName || "Not specified"}
- Intended Major: ${intendedMajor || "Not specified"}
- Years of Experience: ${yearsExperience || "N/A"}
- Current Field: ${currentField || "Not specified"}
- Situation Details: ${JSON.stringify(levelDetails || [])}
- Why Using Pathwise: ${JSON.stringify(whyUsing || [])}
- Career Interests: ${JSON.stringify(careerInterests || [])}

Generate a fully personalized, detailed roadmap for this user. Make it feel like it was built specifically for them.`;

    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
