import { NextRequest, NextResponse } from 'next/server';

function getAge(dob: string) {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

export async function POST(req: NextRequest) {
  const { customer, match, score } = await req.json();

  const prompt = `You are a warm Indian matchmaker writing a compatibility note.

Customer: ${customer.firstName}, ${getAge(customer.dateOfBirth)}yo, ${customer.city}, ${customer.designation} at ${customer.company}, ${customer.religion}, diet: ${customer.diet}, wants kids: ${customer.wantKids}, relocate: ${customer.openToRelocate}, family type: ${customer.familyType}

Match: ${match.firstName}, ${getAge(match.dateOfBirth)}yo, ${match.city}, ${match.designation} at ${match.company}, ${match.religion}, diet: ${match.diet}, wants kids: ${match.wantKids}, relocate: ${match.openToRelocate}, family type: ${match.familyType}

Compatibility Score: ${score}%

Write exactly 2 sentences. Be warm and specific — mention actual shared traits. Sound human, not like an algorithm. No generic phrases like "perfect match".`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ intro: data.content[0].text });
}