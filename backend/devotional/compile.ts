import { api, APIError } from "encore.dev/api";
import { CompileDevotionalRequest, DevotionalPlan } from "./types";
import { callGemini } from "./ai";
import { normalizeReference } from "./reference-normalizer";
import { bible } from "~encore/clients";

// Compiles all devotional components into a cohesive plan.
export const compileDevotional = api<CompileDevotionalRequest, DevotionalPlan>(
  { expose: true, method: "POST", path: "/devotional/compile" },
  async (req) => {
    try {
      if (!req.passageRef || !req.meditation || !req.prayer || !req.study || !req.worship) {
        throw APIError.invalidArgument("All devotional components are required");
      }

      const normalizedRef = normalizeReference(req.passageRef);

      // Try to get the biblical text from the NVI database
      let passageText = "";
      try {
        const bibleResponse = await bible.getPassage({ reference: normalizedRef });
        passageText = bibleResponse.text;
      } catch (bibleError) {
        // If Bible service fails, try to get text from AI
        const prompt = `
**Papel:** Você é um "Editor Devocional".

**Objetivo:** Compilar os guias de Meditação, Oração, Estudo e Adoração em um único plano devocional coeso e bem formatado.

**Passagem:** ${normalizedRef}

**Tarefa:**
1. Criar um título geral para o devocional, baseado na passagem bíblica
2. Buscar o texto da passagem bíblica
3. Unir os quatro blocos recebidos (meditação, oração, estudo, adoração)
4. Garantir coesão, clareza e padronização visual

Responda APENAS em formato JSON válido com as chaves: "title", "passageText". Não inclua texto adicional antes ou depois do JSON.

Para o título, crie apenas um título inspirador e conciso para este devocional baseado na passagem ${normalizedRef}.
Para o passageText, forneça o texto completo da passagem bíblica ${normalizedRef}.
`;

        try {
          const response = await callGemini(prompt);
          const parsed = JSON.parse(response);
          
          if (parsed.passageText) {
            passageText = parsed.passageText;
          }
        } catch (aiError) {
          // If both Bible service and AI fail, leave text empty
          passageText = "";
        }
      }

      // Generate title using AI
      let title = `Devocional: ${normalizedRef}`;
      try {
        const titlePrompt = `Crie um título inspirador e conciso para um devocional baseado na passagem bíblica ${normalizedRef}. Responda apenas com o título, sem aspas ou formatação adicional.`;
        const titleResponse = await callGemini(titlePrompt);
        if (titleResponse && titleResponse.trim()) {
          title = titleResponse.trim().replace(/['"]/g, '');
        }
      } catch (titleError) {
        // Use fallback title if AI fails
        title = `Devocional: ${normalizedRef}`;
      }

      return {
        title,
        passage: {
          reference: normalizedRef,
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
