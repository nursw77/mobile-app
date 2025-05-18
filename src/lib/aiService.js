import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure you set this in your .env file
});

export async function getAIResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any model you want to use
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}
