import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";

const openAIKey = secret("OpenAIKey");

export async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = openAIKey();
  
  if (!apiKey) {
    throw APIError.internal("OpenAI API key not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw APIError.internal(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw APIError.internal("Invalid response format from OpenAI API");
    }

    return data.choices[0].message.content || "";
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw APIError.internal(`Failed to call OpenAI API: ${error}`);
  }
}
