// src/lib/runModerationCheck.ts
export async function runModerationCheck(text: string): Promise<boolean> {
  try {
    const response = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });

    const data = await response.json();
    return data.flagged || false;
  } catch (error) {
    console.error("Moderation check failed:", error);
    return false;
  }
}