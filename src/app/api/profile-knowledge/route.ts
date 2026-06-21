import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";
import { generateGeminiEmbedding } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: unknown, maxLength = 12000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function buildEmbeddingInput(title: string, content: string, category: string) {
  return [`Title: ${title}`, `Category: ${category || "general"}`, `Content: ${content}`].join("\n");
}

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_knowledge")
    .select("id,title,content,category,is_active,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser();
    if (auth.response) return auth.response;

    const supabase = await createClient();
    const body = await request.json();
    const title = cleanText(body.title, 180);
    const content = cleanText(body.content);
    const category = cleanText(body.category, 80) || "general";

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const embedding = await generateGeminiEmbedding(buildEmbeddingInput(title, content, category), "document");
    const { data, error } = await supabase
      .from("profile_knowledge")
      .insert({
        title,
        content,
        category,
        is_active: body.is_active ?? true,
        embedding,
      })
      .select("id,title,content,category,is_active,created_at,updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile knowledge save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser();
    if (auth.response) return auth.response;

    const supabase = await createClient();
    const body = await request.json();
    const id = body.id;
    const title = cleanText(body.title, 180);
    const content = cleanText(body.content);
    const category = cleanText(body.category, 80) || "general";

    if (!id || !title || !content) {
      return NextResponse.json({ error: "ID, title, and content are required." }, { status: 400 });
    }

    const embedding = await generateGeminiEmbedding(buildEmbeddingInput(title, content, category), "document");
    const { data, error } = await supabase
      .from("profile_knowledge")
      .update({
        title,
        content,
        category,
        is_active: body.is_active ?? true,
        embedding,
      })
      .eq("id", id)
      .select("id,title,content,category,is_active,created_at,updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile knowledge update failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required." }, { status: 400 });
  }

  const { error } = await supabase.from("profile_knowledge").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile knowledge deleted" });
}
