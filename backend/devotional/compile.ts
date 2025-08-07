import { api, APIError } from "encore.dev/api";
import { CompileDevotionalRequest, DevotionalPlan } from "./types";
import { callOpenAI } from "./ai";

// Compiles all devotional components into a cohesive plan.
export const compileDevotional = api<CompileDevotionalRequest, DevotionalPlan>(
  { expose: true, method: "POST", path: "/devotional/compile" },
  async (req) => {
    if (!req.passageRef || !req.passageText || !req.meditation || !req.prayer || !req.study || !req.worship) {
      throw APIError.invalidArgument("All devotional components are required");
    }

    const prompt = `
**Papel:** Você é um "Editor Devocional".

**Objetivo:** Compilar os guias de Meditação, Oração, Estudo e Adoração em um único plano devocional coeso e bem formatado.

**Passagem:** ${req.passageRef}

**Tarefa:**
1. Criar um título geral para o devocional, baseado na passagem bíblica
2. Unir os quatro blocos recebidos (meditação, oração, estudo, adoração)
3. Garantir coesão, clareza e padronização visual

Crie apenas um título inspirador e conciso para este devocional baseado na passagem ${req.passageRef}. Responda apenas com o título, sem aspas ou formatação adicional.
`;

    try {
      const titleResponse = await callOpenAI(prompt);
      const title = titleResponse.trim().replace(/['"]/g, '') || `Devocional: ${req.passageRef}`;

      return {
        title,
        passage: {
          reference: req.passageRef,
          text: req.passageText
        },
        meditation: req.meditation,
        prayer: req.prayer,
        study: req.study,
        worship: req.worship
      };
    } catch (error) {
      // If title generation fails, use a fallback
      return {
        title: `Devocional: ${req.passageRef}`,
        passage: {
          reference: req.passageRef,
          text: req.passageText
        },
        meditation: req.meditation,
        prayer: req.prayer,
        study: req.study,
        worship: req.worship
      };
    }
  }
);
