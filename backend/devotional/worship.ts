import { api, APIError } from "encore.dev/api";
import { GenerateWorshipRequest, WorshipGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a worship guide to respond to God's truth.
export const generateWorship = api<GenerateWorshipRequest, WorshipGuide>(
  { expose: true, method: "POST", path: "/devotional/worship" },
  async (req) => {
    try {
      if (!req.passageRef || !req.passageText || !req.studyInsights) {
        throw APIError.invalidArgument("passageRef, passageText, and studyInsights are required");
      }

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

Responda APENAS em formato JSON válido com as chaves: "call", "celebration". Não inclua texto adicional antes ou depois do JSON.
`;

      try {
        const response = await callOpenAI(prompt);
        
        try {
          const parsed = JSON.parse(response);
          
          if (!parsed.call || !parsed.celebration) {
            throw new Error("Invalid response structure");
          }
          
          return {
            call: parsed.call,
            celebration: parsed.celebration
          };
        } catch (parseError) {
          return {
            call: "Venha adorar ao Senhor com gratidão e alegria! Ele é digno de todo louvor e honra. Que nossos corações se encham de reverência diante de Sua majestade e amor.",
            celebration: "Celebre a bondade de Deus em sua vida! Compartilhe Seu amor com outros através de suas palavras e ações. Vá em paz, sabendo que Ele está com você sempre."
          };
        }
      } catch (aiError) {
        return {
          call: "Venha adorar ao Senhor com gratidão e alegria! Ele é digno de todo louvor e honra. Que nossos corações se encham de reverência diante de Sua majestade e amor.",
          celebration: "Celebre a bondade de Deus em sua vida! Compartilhe Seu amor com outros através de suas palavras e ações. Vá em paz, sabendo que Ele está com você sempre."
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate worship guide: ${error}`);
    }
  }
);
