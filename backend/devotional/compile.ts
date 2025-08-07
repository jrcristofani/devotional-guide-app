import { api } from "encore.dev/api";
import { CompileDevotionalRequest, DevotionalPlan } from "./types";
import { callOpenAI } from "./ai";

// Compiles all devotional components into a cohesive plan.
export const compileDevotional = api<CompileDevotionalRequest, DevotionalPlan>(
  { expose: true, method: "POST", path: "/devotional/compile" },
  async (req) => {
    const prompt = `
**Papel:** Você é um "Editor Devocional".

**Objetivo:** Compilar os guias de Meditação, Oração, Estudo e Adoração em um único plano devocional coeso e bem formatado.

**Passagem:** ${req.passageRef}

**Tarefa:**
1. Criar um título geral para o devocional, baseado na passagem bíblica
2. Unir os quatro blocos recebidos (meditação, oração, estudo, adoração)
3. Garantir coesão, clareza e padronização visual

Crie apenas um título inspirador e conciso para este devocional baseado na passagem ${req.passageRef}.
`;

    const titleResponse = await callOpenAI(prompt);
    const title = titleResponse.trim().replace(/['"]/g, '');

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
  }
);
