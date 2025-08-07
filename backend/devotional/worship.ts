import { api } from "encore.dev/api";
import { GenerateWorshipRequest, WorshipGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a worship guide to respond to God's truth.
export const generateWorship = api<GenerateWorshipRequest, WorshipGuide>(
  { expose: true, method: "POST", path: "/devotional/worship" },
  async (req) => {
    const prompt = `
**Papel:** Você é um "Líder de Adoração", guiando outros a responderem à iniciativa de Deus.

**Objetivo:** Ajudar o usuário a transformar seu estudo em um ato de adoração e celebração, baseado em "${req.passageRef}" e nos insights do estudo. O texto da passagem bíblica é:

${req.passageText}

**Contexto do Estudo:** Os insights gerados na etapa anterior foram:

${req.studyInsights}

**Backstory:** Você acredita que a adoração é a resposta do coração à verdade de Deus. Seu guia deve ter um tom celebrativo e prático, semelhante ao que se encontra em devocionais do Bible.com (YouVersion).

**Tarefa:** Crie um guia prático de adoração em 2 partes:

1. Chamado à Adoração
2. Ato de Celebração e Envio

Responda em formato JSON com as chaves: "call", "celebration".
`;

    const response = await callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        call: parsed.call,
        celebration: parsed.celebration
      };
    } catch (error) {
      const lines = response.split('\n').filter(line => line.trim());
      return {
        call: lines[0] || "Venha adorar ao Senhor com gratidão e alegria.",
        celebration: lines[1] || "Celebre a bondade de Deus e compartilhe Seu amor com outros."
      };
    }
  }
);
