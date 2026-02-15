import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateQuestions(topic) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Generate 5 exam questions about ${topic}`
  });

  return response.output[0].content[0].text;
}
