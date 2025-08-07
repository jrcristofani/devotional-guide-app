import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";

const geminiApiKey = secret("GEMINI_API_KEY");

export async function callGemini(prompt: string): Promise<string> {
  try {
    const apiKey = geminiApiKey();
    
    if (!apiKey || apiKey.trim() === "") {
      throw APIError.internal("Gemini API key not configured. Please set the GEMINI_API_KEY secret in the Infrastructure tab.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 400) {
        throw APIError.invalidArgument(`Invalid request to Gemini API: ${errorText}`);
      } else if (response.status === 403) {
        throw APIError.unauthenticated("Invalid Gemini API key. Please check your GEMINI_API_KEY secret configuration.");
      } else if (response.status === 429) {
        throw APIError.resourceExhausted("Gemini API rate limit exceeded. Please try again later.");
      } else if (response.status >= 500) {
        throw APIError.unavailable("Gemini API is currently unavailable. Please try again later.");
      } else {
        throw APIError.internal(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      throw APIError.internal("Invalid response format from Gemini API");
    }

    return data.candidates[0].content.parts[0].text || "";
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw APIError.unavailable("Network error: Unable to connect to Gemini API. Please check your internet connection.");
    }
    
    throw APIError.internal(`Failed to call Gemini API: ${error}`);
  }
}
