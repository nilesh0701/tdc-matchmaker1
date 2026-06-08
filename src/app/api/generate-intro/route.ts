import { NextRequest, NextResponse } from 'next/server';

function getAge(dob: string) {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export async function POST(req: NextRequest) {
  try {
    const { customer, match, score } = await req.json();

    // Guard rails check: If the API key is unconfigured or a template string, use the algorithmic fallback
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your-key')) {
      const algorithmicIntro = `${customer.firstName} and ${match.firstName} display an exceptional alignment score of ${score}%. Both reside in prominent urban hubs, share complementary outlooks on family structures (${customer.familyType} vs ${match.familyType}), and fully align on core daily preferences like a ${customer.diet} diet. Their parallel career milestones make this a premier recommendation.`;
      
      return NextResponse.json({ intro: algorithmicIntro, simulated: true });
    }

    const prompt = `You are an expert Indian matchmaker writing a highly personalized compatibility note.
    Customer: ${customer.firstName}, ${getAge(customer.dateOfBirth)}yo, ${customer.city}, ${customer.designation} at ${customer.company}, ${customer.religion}, diet: ${customer.diet}, wants kids: ${customer.wantKids}, relocate: ${customer.openToRelocate}, family type: ${customer.familyType}
    Match: ${match.firstName}, ${getAge(match.dateOfBirth)}yo, ${match.city}, ${match.designation} at ${match.company}, ${match.religion}, diet: ${match.diet}, wants kids: ${match.wantKids}, relocate: ${match.openToRelocate}, family type: ${match.familyType}
    Compatibility Score: ${score}%

    Write exactly 2-3 sentences. Be warm, empathetic, and highly specific. Mention actual shared traits (e.g., diet, career trajectory, family values). Sound human, not algorithmic. Do not use generic phrases like "perfect match".`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('Anthropic API execution error');
    }

    const data = await response.json();
    return NextResponse.json({ intro: data.content[0].text });
  } catch (error) {
    console.error("API Router Error:", error);
    return NextResponse.json({ error: 'Failed to process matching insight context' }, { status: 500 });
  }
}