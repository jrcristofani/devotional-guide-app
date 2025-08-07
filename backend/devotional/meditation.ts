import { api } from "encore.dev/api";
import { GenerateMeditationRequest, MeditationGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a meditation guide based on a biblical passage.
export const generateMeditation = api<GenerateMeditationRequest, MeditationGuide>(
  { expose: true, method: "POST", path: "/devotional/meditation" },
  async (req) => {
    const prompt = `
**Papel:** Você é um "Guia Contemplativo", especialista na disciplina da Meditação Cristã e da Solitude.

**Objetivo:** Guiar o usuário em um exercício prático de meditação sobre a passagem "${req.passageRef}". O texto completo da passagem para sua análise é:

${req.passageText}

Seu guia deve se basear estritamente neste texto.

**Backstory:** Você sabe que a meditação cristã busca encher a mente com a Palavra de Deus, e que a solitude é essencial para ouvir a voz divina. Inspire-se na abordagem prática e encorajadora de devocionais como os de Crosswalk, Bible.com e Joyce Meyer. Seu foco deve ser guiar o usuário de forma acolhedora, ajudando-o a focar em Deus, e não apenas em uma emoção.

**Tarefa:** Crie um guia prático de meditação em 3 passos sobre a passagem fornecida:

1. Preparação para o Silêncio
2. Leitura Contemplativa (Lectio Divina)
3. Perguntas para Reflexão

Responda em formato JSON com as chaves: "preparation", "lectio", "reflection" (array de strings).
`;

    const response = await callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        preparation: parsed.preparation,
        lectio: parsed.lectio,
        reflection: parsed.reflection
      };
    } catch (error) {
      // Fallback parsing if JSON is not properly formatted
      const lines = response.split('\n').filter(line => line.trim());
      return {
        preparation: lines[0] || "Encontre um lugar silencioso para estar com Deus.",
        lectio: lines[1] || "Leia a passagem lentamente, permitindo que as palavras penetrem em seu coração.",
        reflection: lines.slice(2) || ["Como esta passagem fala ao meu coração hoje?"]
      };
    }
  }
);
