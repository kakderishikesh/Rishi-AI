// utils/checkInputGuardrails.ts

/**
 * Checks if user input contains dangerous prompt injection attempts.
 * If so, returns a safe redirect message. Otherwise, allows the input.
 */
export function checkInputGuardrails(userInput: string): string | null {
    const lower = userInput.toLowerCase();
  
    // 🚨 Detect prompt injection attempts
    const blockedPhrases = ["ignore previous", "act as", "pretend to be", "you are now"];
    if (blockedPhrases.some((phrase) => lower.includes(phrase))) {
      return "Hmm... that sounds like an attempt to override the assistant. Please ask about Rishi’s background, skills, or projects.";
    }
  
    return null; // ✅ No danger detected, allow the message
  }  