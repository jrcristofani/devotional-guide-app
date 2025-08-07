import { api, APIError } from "encore.dev/api";
import { GeneratePrayerRequest, PrayerGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a prayer guide based on a biblical passage and meditation insights.
export const generatePrayer = api<GeneratePrayerRequest, PrayerGuide>(
  { expose: true, method: "POST", path: "/devotional/prayer" },
  async (req) => {
    try {
      if (!req.passageRef || !req.passageText || !req.meditationInsights) {
        throw APIError.invalidArgument("passageRef, passageText, and meditationInsights are required");
      }

      const prompt = `
**Papel:** Você é um "Facilitador de Oração", que guia outros a uma conversa transformadora com Deus.

**Objetivo:** Guiar o usuário em uma oração pessoal baseada na passagem "${req.passageRef}" e nos insights da sua meditação. O texto da passagem para sua referência é:

${req.passageText}

**Contexto da Meditação:** Os insights gerados na etapa anterior foram:

${req.meditationInsights}

**Backstory:** Você entende a oração como um diálogo que nos transforma. Seu tom deve ser íntimo e reverente, inspirado pela forma como devocionais como os de Crosswalk e Joyce Meyer traduzem a teologia em conversa pessoal com Deus.

**Tarefa:** Crie um guia prático de oração em 2 partes:

1. Oração Pessoal
2. Prática de Intercessão

Responda APENAS em formato JSON válido com as chaves: "personal", "intercession". Não inclua texto adicional antes ou depois do JSON.
`;

      try {
        const response = await callOpenAI(prompt);
        
        try {
          const parsed = JSON.parse(response);
          
          if (!parsed.personal || !parsed.intercession) {
            throw new Error("Invalid response structure");
          }
          
          return {
            personal: parsed.personal,
            intercession: parsed.intercession
          };
        } catch (parseError) {
          return {
            personal: "Senhor, obrigado por esta passagem que fala ao meu coração. Ajuda-me a compreender mais profundamente o que Tu queres me ensinar através dela. Que Tua Palavra transforme minha mente e meu coração hoje.",
            intercession: "Pai, oro por aqueles que ainda não conhecem esta verdade. Que muitos possam experimentar Teu amor e Tua graça. Oro especialmente por minha família e amigos, que eles também possam ser tocados por Tua Palavra."
          };
        }
      } catch (aiError) {
        return {
          personal: "Senhor, obrigado por esta passagem que fala ao meu coração. Ajuda-me a compreender mais profundamente o que Tu queres me ensinar através dela. Que Tua Palavra transforme minha mente e meu coração hoje.",
          intercession: "Pai, oro por aqueles que ainda não conhecem esta verdade. Que muitos possam experimentar Teu amor e Tua graça. Oro especialmente por minha família e amigos, que eles também possam ser tocados por Tua Palavra."
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate prayer guide: ${error}`);
    }
  }
);
