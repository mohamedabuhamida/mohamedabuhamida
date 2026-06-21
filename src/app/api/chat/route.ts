import { NextResponse } from "next/server";
import { generateGeminiAnswer, generateGeminiEmbedding } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 12;

function cleanMessage(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
}

function cleanHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const role = (item as { role?: unknown }).role;
      const content = cleanMessage((item as { content?: unknown }).content);

      if ((role !== "user" && role !== "assistant") || !content) return null;
      return { role, content };
    })
    .filter((item): item is ChatMessage => Boolean(item));
}

function buildPrompt(profileKnowledge: string, history: ChatMessage[], message: string) {
  const conversation = history
    .map((item) => `${item.role === "user" ? "Visitor" : "Assistant"}: ${item.content}`)
    .join("\n");

  return `You are the AI assistant for Mohamed AbuHamida's portfolio website.

Rules:
- Answer using the Supabase profile knowledge context below as your main source of truth.
- Be warm, concise, and helpful.
- If a fact is not in the profile, say it is not listed yet and suggest contacting Mohamed.
- Do not invent dates, employers, degrees, metrics, or private personal details.
- If the visitor asks how to contact Mohamed, point them to the contact section or the listed public profiles.

Supabase profile knowledge context:
${profileKnowledge}

Recent conversation:
${conversation || "No previous messages."}

Visitor question:
${message}

Assistant answer:`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = cleanMessage(body?.message);
    const history = cleanHistory(body?.history);

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const queryEmbedding = await generateGeminiEmbedding(message, "query");
    const { data: matches, error: matchError } = await supabaseAdmin.rpc("match_profile_knowledge", {
      query_embedding: queryEmbedding,
      match_count: 6,
      match_threshold: 0.28,
    });

    if (matchError) {
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    const profileKnowledge =
      Array.isArray(matches) && matches.length > 0
        ? matches
          .map((item: { title?: string; category?: string; content?: string }, index: number) => {
            const title = item.title || `Knowledge ${index + 1}`;
            const category = item.category ? `Category: ${item.category}` : "Category: general";
            return `### ${title}\n${category}\n${item.content}`;
          })
          .join("\n\n")
        : "No matching profile knowledge was found in Supabase for this question.";

    const prompt = buildPrompt(profileKnowledge, history, message);
    const answer = await generateGeminiAnswer(prompt);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong while answering.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
