import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";

const openAIKey = secret("OpenAIKey");

export async function callOpenAI(prompt: string): Promise<string> {
  try {
    const apiKey = openAIKey();
    
    if (!apiKey || apiKey.trim() === "") {
      throw APIError.internal("OpenAI API key not configured. Please set the OpenAIKey secret in the Infrastructure tab.");
    }

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
      
      if (response.status === 401) {
        throw APIError.unauthenticated("Invalid OpenAI API key. Please check your OpenAIKey secret configuration.");
      } else if (response.status === 429) {
        throw APIError.resourceExhausted("OpenAI API rate limit exceeded. Please try again later.");
      } else if (response.status >= 500) {
        throw APIError.unavailable("OpenAI API is currently unavailable. Please try again later.");
      } else {
        throw APIError.internal(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
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
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw APIError.unavailable("Network error: Unable to connect to OpenAI API. Please check your internet connection.");
    }
    
    throw APIError.internal(`Failed to call OpenAI API: ${error}`);
  }
}
