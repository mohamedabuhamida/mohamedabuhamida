const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_CHAT_MODEL = "gemini-1.5-flash";
const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-2";
export const GEMINI_EMBEDDING_DIMENSIONS = 768;

type GeminiPart = {
  text?: string;
};

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add GEMINI_API_KEY to your environment.");
  }

  return apiKey;
}

export async function generateGeminiEmbedding(input: string, mode: "document" | "query") {
  const apiKey = getApiKey();
  const model = process.env.GEMINI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
  const formattedInput =
    mode === "query"
      ? `task: question answering | query: ${input}`
      : `title: portfolio knowledge | text: ${input}`;

  const response = await fetch(`${GEMINI_API_BASE}/models/${model}:embedContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      content: {
        parts: [{ text: formattedInput }],
      },
      output_dimensionality: GEMINI_EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini embedding request failed: ${details.slice(0, 500)}`);
  }

  const data = await response.json();
  const values = data?.embedding?.values;

  if (!Array.isArray(values)) {
    throw new Error("Gemini embedding response did not include embedding values.");
  }

  return values as number[];
}

export async function generateGeminiAnswer(prompt: string) {
  const apiKey = getApiKey();
  const model = process.env.GEMINI_MODEL || DEFAULT_CHAT_MODEL;

  const response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed: ${details.slice(0, 500)}`);
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part: GeminiPart) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim() || "I could not generate an answer right now."
  );
}
