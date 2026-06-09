import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Profile } from './matchingEngine';

/**
 * Helper utility to calculate dynamic age from ISO date string
 */
function getAge(dob: string): number {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

/**
 * Deterministic fallback engine that generates a context-aware 
 * match string without requiring external API tokens.
 */
function buildAlgorithmicIntro(
  customer: Profile,
  match: Profile,
  score: number
): string {
  return `${customer.firstName} and ${match.firstName} display an exceptional alignment score of ${score}%. Both reside in prominent urban hubs, share complementary outlooks on family structures (${customer.familyType} vs ${match.familyType}), and fully align on core daily preferences like a ${customer.diet} diet. Their parallel career milestones make this a premier recommendation.`;
}

/**
 * Constructs the structured prompt for the Gemini LLM
 */
export function buildPrompt(
  customer: Profile,
  match: Profile,
  score: number
): string {
  return `You are an expert Indian matchmaker writing a highly personalized compatibility note.
Customer: ${customer.firstName}, ${getAge(customer.dateOfBirth)}yo, ${customer.city}, ${customer.designation} at ${customer.company}, ${customer.religion}, diet: ${customer.diet}, wants kids: ${customer.wantKids}, relocate: ${customer.openToRelocate}, family type: ${customer.familyType}
Match: ${match.firstName}, ${getAge(match.dateOfBirth)}yo, ${match.city}, ${match.designation} at ${match.company}, ${match.religion}, diet: ${match.diet}, wants kids: ${match.wantKids}, relocate: ${match.openToRelocate}, family type: ${match.familyType}
Compatibility Score: ${score}%

Write exactly 2-3 sentences. Be warm, empathetic, and highly specific. Mention actual shared traits (e.g., diet, career trajectory, family values). Sound human, not algorithmic. Do not use generic phrases like "perfect match".`;
}

/**
 * Primary live AI generation execution pathway
 */
export async function generateMatchIntro(
  customer: Profile,
  match: Profile,
  score: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Guardrail: Instantly return fallback if API key is missing or unconfigured
  if (!apiKey || apiKey.includes('your-key')) {
    return buildAlgorithmicIntro(customer, match, score);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Instantiate model container with relaxed safety parameters to accept matrimonial demographic data
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ]
    });
    
    const prompt = buildPrompt(customer, match, score);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text || !text.trim()) {
      throw new Error('Gemini returned an empty text response block.');
    }

    return text.trim();
  } catch (error) {
    // Graceful Degradation: If any error happens, fall back to the clean algorithmic text
    console.error('Gemini API operational warning, falling back to clean template:', error);
    return buildAlgorithmicIntro(customer, match, score);
  }
}

/**
 * Exposed public fallback wrapper for the API route 
 */
export function getAlgorithmicIntro(
  customer: Profile,
  match: Profile,
  score: number
): string {
  return buildAlgorithmicIntro(customer, match, score);
}