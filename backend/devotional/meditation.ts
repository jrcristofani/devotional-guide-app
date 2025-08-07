import { api, APIError } from "encore.dev/api";
import { GenerateMeditationRequest, MeditationGuide } from "./types";
import { callOpenAI } from "./ai";
import { normalizeReference } from "./reference-normalizer";

// Generates a meditation guide based on a biblical passage.
export const generateMeditation = api<GenerateMeditationRequest, MeditationGuide>(
  { expose: true, method: "POST", path: "/devotional/meditation" },
  async (req) => {
    try {
      if (!req.passageRef) {
        throw APIError.invalidArgument("passageRef is required");
      }

      const normalizedRef = normalizeReference(req.passageRef);

      const prompt = `
**Papel:** Você é um "Guia Contemplativo", especialista na disciplina da Meditação Cristã e da Solitude.

**Objetivo:** Guiar o usuário em um exercício prático de meditação sobre a passagem "${normalizedRef}".

**Backstory:** Você sabe que a meditação cristã busca encher a mente com a Palavra de Deus, e que a solitude é essencial para ouvir a voz divina. Inspire-se na abordagem prática e encorajadora de devocionais como os de Crosswalk, Bible.com e Joyce Meyer. Seu foco deve ser guiar o usuário de forma acolhedora, ajudando-o a focar em Deus, e não apenas em uma emoção.

**Tarefa:** Crie um guia prático de meditação em 3 passos sobre a passagem fornecida:

1. Preparação para o Silêncio
2. Leitura Contemplativa (Lectio Divina)
3. Perguntas para Reflexão - DEVE ser um array de strings simples

Responda APENAS em formato JSON válido com as chaves: "preparation", "lectio", "reflection" (array de strings). 

IMPORTANTE: reflection deve ser um array de strings simples, não objetos.

Não inclua texto adicional antes ou depois do JSON.
`;

      try {
        const response = await callOpenAI(prompt);
        
        // Try to parse JSON response
        try {
          const parsed = JSON.parse(response);
          
          // Validate the response structure
          if (!parsed.preparation || !parsed.lectio || !Array.isArray(parsed.reflection)) {
            throw new Error("Invalid response structure");
          }

          // Ensure reflection questions are strings
          const reflection = parsed.reflection.map((q: any) => {
            if (typeof q === 'string') {
              return q;
            } else if (typeof q === 'object' && q.question) {
              return q.question;
            } else {
              return String(q);
            }
          });
          
          return {
            preparation: String(parsed.preparation),
            lectio: String(parsed.lectio),
            reflection
          };
        } catch (parseError) {
          // Fallback: create a structured response from the text
          return {
            preparation: "Encontre um lugar silencioso para estar com Deus. Respire profundamente e aquiete seu coração, preparando-se para ouvir Sua voz através da Sua Palavra.",
            lectio: "Leia a passagem lentamente, palavra por palavra. Permita que cada frase penetre em seu coração. Leia novamente, prestando atenção às palavras que mais tocam sua alma.",
            reflection: [
              "Que palavra ou frase desta passagem mais fala ao meu coração hoje?",
              "Como Deus está me convidando a responder a esta verdade?",
              "Que aspecto do caráter de Deus esta passagem revela?"
            ]
          };
        }
      } catch (aiError) {
        // If AI call fails, return fallback content
        return {
          preparation: "Encontre um lugar silencioso para estar com Deus. Respire profundamente e aquiete seu coração, preparando-se para ouvir Sua voz através da Sua Palavra.",
          lectio: "Leia a passagem lentamente, palavra por palavra. Permita que cada frase penetre em seu coração. Leia novamente, prestando atenção às palavras que mais tocam sua alma.",
          reflection: [
            "Que palavra ou frase desta passagem mais fala ao meu coração hoje?",
            "Como Deus está me convidando a responder a esta verdade?",
            "Que aspecto do caráter de Deus esta passagem revela?"
          ]
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate meditation guide: ${error}`);
    }
  }
);
