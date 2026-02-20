import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, userProfile, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    const profileContext = userProfile
      ? `User Profile:
- Education Level: ${userProfile.educationLevel || "Unknown"}
- Career Interests: ${(userProfile.careerInterests || []).join(", ") || "Not specified"}
- Focus Areas: ${(userProfile.levelDetails || []).join(", ") || "Not specified"}
- Goals: ${(userProfile.whyUsing || []).join(", ") || "Not specified"}
- School/Company: ${userProfile.schoolName || "Not specified"}`
      : "No user profile available.";

    if (action === "generate_plan") {
      const goalTitle = context?.goalTitle || "Career Success";
      systemPrompt = `You are an AI career planning agent. Given a user's profile and a career goal, generate a structured plan.

RESPOND WITH EXACTLY THIS JSON FORMAT (no markdown, no extra text):
{
  "goal": {
    "title": "string - the goal title",
    "description": "string - 1-2 sentence description",
    "category": "career|education|skills|networking|financial",
    "target_date": "string - estimated timeframe like '6 months' or '2 years'"
  },
  "milestones": [
    {
      "title": "string - milestone name",
      "description": "string - what this involves",
      "tasks": [
        {
          "title": "string - specific actionable task",
          "priority": "high|medium|low",
          "category": "string - coursework|internship|project|networking|certification|research|application",
          "description": "string - brief details"
        }
      ]
    }
  ],
  "summary": "string - 2-3 sentence motivational summary of the plan"
}

Generate 3-5 milestones, each with 2-4 tasks. Be specific and actionable. Tailor everything to the user's education level and interests.`;

      userPrompt = `${profileContext}\n\nGoal: ${goalTitle}\n\nGenerate a detailed, personalized plan for this goal.`;
    } else if (action === "pivot_plan") {
      const fromPath = context?.fromPath || "current path";
      const toPath = context?.toPath || "new path";
      systemPrompt = `You are an AI career planning agent helping a user pivot their career direction.

RESPOND WITH EXACTLY THIS JSON FORMAT (no markdown, no extra text):
{
  "updatedGoal": {
    "title": "string - new goal title",
    "description": "string - 1-2 sentence description of the pivot",
    "category": "career|education|skills|networking|financial"
  },
  "removedTasks": ["string - tasks that are no longer relevant"],
  "newMilestones": [
    {
      "title": "string - milestone name",
      "tasks": [
        {
          "title": "string - actionable task",
          "priority": "high|medium|low",
          "category": "string",
          "description": "string"
        }
      ]
    }
  ],
  "updatedSchoolFocus": ["string - types of schools/programs to look at now"],
  "updatedCompanyFocus": ["string - types of companies to target now"],
  "transitionAdvice": "string - 2-3 sentences on how to make this pivot smoothly"
}`;

      userPrompt = `${profileContext}\n\nThe user wants to pivot from "${fromPath}" to "${toPath}". Generate a transition plan.`;
    } else if (action === "suggest_next_actions") {
      const completedTasks = context?.completedTasks || [];
      const currentGoals = context?.currentGoals || [];
      systemPrompt = `You are a proactive AI career advisor. Based on the user's progress, suggest what they should do next. Also identify missed milestones, suggest hidden/unconventional career paths they haven't explored, and explain why recommendations may have changed.

RESPOND WITH EXACTLY THIS JSON FORMAT (no markdown, no extra text):
{
  "suggestions": [
    {
      "title": "string - suggested action",
      "priority": "high|medium|low",
      "category": "string",
      "reasoning": "string - why this is important now"
    }
  ],
  "missedMilestones": [
    {
      "title": "string - overdue or stalling milestone",
      "severity": "warning|critical",
      "suggestion": "string - how to get back on track"
    }
  ],
  "hiddenPaths": [
    {
      "title": "string - unconventional career suggestion",
      "whyRelevant": "string - connection to user's interests"
    }
  ],
  "progressInsight": "string - observation about their progress",
  "shouldRevisePlan": false,
  "revisionReason": "string - only if shouldRevisePlan is true",
  "refreshReason": "string - why these recommendations were generated or changed"
}

Provide 3-5 actionable suggestions. Identify 1-3 missed milestones if any tasks are overdue or goals stalling. Suggest 1-2 hidden career paths based on the user's unique combination of interests.`;

      userPrompt = `${profileContext}\n\nCompleted tasks: ${JSON.stringify(completedTasks)}\nCurrent goals: ${JSON.stringify(currentGoals)}\n\nWhat should they focus on next? Also flag any missed milestones and suggest hidden career paths.`;

      userPrompt = `${profileContext}\n\nCompleted tasks: ${JSON.stringify(completedTasks)}\nCurrent goals: ${JSON.stringify(currentGoals)}\n\nWhat should they focus on next?`;
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from the AI response
    let parsed;
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ action, result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
