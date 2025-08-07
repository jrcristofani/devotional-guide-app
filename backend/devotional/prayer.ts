import { api } from "encore.dev/api";
import { GeneratePrayerRequest, PrayerGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a prayer guide based on a biblical passage and meditation insights.
export const generatePrayer = api<GeneratePrayerRequest, PrayerGuide>(
  { expose: true, method: "POST", path: "/devotional/prayer" },
  async (req) => {
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

Responda em formato JSON com as chaves: "personal", "intercession".
`;

    const response = await callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        personal: parsed.personal,
        intercession: parsed.intercession
      };
    } catch (error) {
      const lines = response.split('\n').filter(line => line.trim());
      return {
        personal: lines[0] || "Senhor, fale ao meu coração através desta passagem.",
        intercession: lines[1] || "Oro por aqueles que precisam conhecer esta verdade."
      };
    }
  }
);
