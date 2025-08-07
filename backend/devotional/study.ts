import { api, APIError } from "encore.dev/api";
import { GenerateStudyRequest, StudyGuide } from "./types";
import { callOpenAI } from "./ai";

// Generates a biblical study guide for deeper understanding.
export const generateStudy = api<GenerateStudyRequest, StudyGuide>(
  { expose: true, method: "POST", path: "/devotional/study" },
  async (req) => {
    if (!req.passageRef || !req.passageText) {
      throw APIError.invalidArgument("passageRef and passageText are required");
    }

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

Responda APENAS em formato JSON válido com as chaves: "insight", "crossReferences" (array), "applicationQuestions" (array). Não inclua texto adicional antes ou depois do JSON.
`;

    try {
      const response = await callOpenAI(prompt);
      
      try {
        const parsed = JSON.parse(response);
        
        if (!parsed.insight || !Array.isArray(parsed.crossReferences) || !Array.isArray(parsed.applicationQuestions)) {
          throw new Error("Invalid response structure");
        }
        
        return {
          insight: parsed.insight,
          crossReferences: parsed.crossReferences,
          applicationQuestions: parsed.applicationQuestions
        };
      } catch (parseError) {
        return {
          insight: "Esta passagem revela o coração amoroso de Deus e Seu desejo de ter um relacionamento íntimo conosco. Ela nos convida a confiar em Sua bondade e a viver de acordo com Seus propósitos.",
          crossReferences: ["João 3:16", "Romanos 8:28", "Jeremias 29:11", "Filipenses 4:13"],
          applicationQuestions: [
            "Como posso aplicar esta verdade em minha vida diária?",
            "Que mudança específica Deus está me chamando a fazer baseado nesta passagem?"
          ]
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate study guide: ${error}`);
    }
  }
);
