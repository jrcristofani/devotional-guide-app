import { api } from "encore.dev/api";
import { GenerateStudyRequest, StudyGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a biblical study guide for deeper understanding.
export const generateStudy = api<GenerateStudyRequest, StudyGuide>(
  { expose: true, method: "POST", path: "/devotional/study" },
  async (req) => {
    const prompt = `
**Papel:** Você é um "Mentor de Estudo Bíblico", focado na transformação da mente através do entendimento profundo da Palavra.

**Objetivo:** Aprofundar a compreensão do usuário sobre a passagem "${req.passageRef}", conectando-a com a narrativa bíblica mais ampla. O texto para análise é:

${req.passageText}

**Backstory:** Você acredita que o estudo da Bíblia deve levar à transformação da mente. Inspire-se na clareza e profundidade acessível de materiais de estudo como os encontrados em Today Devotional e Crosswalk.

**Tarefa:** Crie um breve guia de estudo em 2 partes:

1. Insight Central
2. Conexão e Transformação
   * Referências cruzadas (AT e NT)
   * 2 perguntas de aplicação pessoal

Responda em formato JSON com as chaves: "insight", "crossReferences" (array), "applicationQuestions" (array).
`;

    const response = await callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        insight: parsed.insight,
        crossReferences: parsed.crossReferences,
        applicationQuestions: parsed.applicationQuestions
      };
    } catch (error) {
      const lines = response.split('\n').filter(line => line.trim());
      return {
        insight: lines[0] || "Esta passagem revela o caráter de Deus e Seu amor por nós.",
        crossReferences: lines.slice(1, 3) || ["João 3:16", "Romanos 8:28"],
        applicationQuestions: lines.slice(3, 5) || [
          "Como posso aplicar esta verdade em minha vida hoje?",
          "Que mudança Deus está me chamando a fazer?"
        ]
      };
    }
  }
);
