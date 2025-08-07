import { api, APIError } from "encore.dev/api";
import { CompileDevotionalRequest, DevotionalPlan } from "./types";
import { callOpenAI } from "./ai";

// Compiles all devotional components into a cohesive plan.
export const compileDevotional = api<CompileDevotionalRequest, DevotionalPlan>(
  { expose: true, method: "POST", path: "/devotional/compile" },
  async (req) => {
    try {
      if (!req.passageRef || !req.meditation || !req.prayer || !req.study || !req.worship) {
        throw APIError.invalidArgument("All devotional components are required");
      }

      const prompt = `
**Papel:** Você é um "Editor Devocional".

**Objetivo:** Compilar os guias de Meditação, Oração, Estudo e Adoração em um único plano devocional coeso e bem formatado.

**Passagem:** ${req.passageRef}

**Tarefa:**
1. Criar um título geral para o devocional, baseado na passagem bíblica
2. Buscar o texto da passagem bíblica
3. Unir os quatro blocos recebidos (meditação, oração, estudo, adoração)
4. Garantir coesão, clareza e padronização visual

Responda APENAS em formato JSON válido com as chaves: "title", "passageText". Não inclua texto adicional antes ou depois do JSON.

Para o título, crie apenas um título inspirador e conciso para este devocional baseado na passagem ${req.passageRef}.
Para o passageText, forneça o texto completo da passagem bíblica ${req.passageRef}.
`;

      let title = `Devocional: ${req.passageRef}`;
      let passageText = "";
      
      try {
        const response = await callOpenAI(prompt);
        const parsed = JSON.parse(response);
        
        if (parsed.title) {
          title = parsed.title.replace(/['"]/g, '');
        }
        if (parsed.passageText) {
          passageText = parsed.passageText;
        }
      } catch (aiError) {
        // If AI fails, use fallback title and empty text
        title = `Devocional: ${req.passageRef}`;
        passageText = "";
      }

      return {
        title,
        passage: {
          reference: req.passageRef,
          text: passageText
        },
        meditation: req.meditation,
        prayer: req.prayer,
        study: req.study,
        worship: req.worship
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to compile devotional: ${error}`);
    }
  }
);
