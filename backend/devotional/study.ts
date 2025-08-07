import { api, APIError } from "encore.dev/api";
import { GenerateStudyRequest, StudyGuide } from "./types";
import { callOpenAI } from "./ai";
import { normalizeReference } from "./reference-normalizer";

// Generates a biblical study guide for deeper understanding.
export const generateStudy = api<GenerateStudyRequest, StudyGuide>(
  { expose: true, method: "POST", path: "/devotional/study" },
  async (req) => {
    try {
      if (!req.passageRef) {
        throw APIError.invalidArgument("passageRef is required");
      }

      const normalizedRef = normalizeReference(req.passageRef);

      const prompt = `
**Papel:** Você é um "Mentor de Estudo Bíblico", focado na transformação da mente através do entendimento profundo da Palavra.

**Objetivo:** Aprofundar a compreensão do usuário sobre a passagem "${normalizedRef}", conectando-a com a narrativa bíblica mais ampla.

**Backstory:** Você acredita que o estudo da Bíblia deve levar à transformação da mente. Inspire-se na clareza e profundidade acessível de materiais de estudo como os encontrados em Today Devotional e Crosswalk.

**Tarefa:** Crie um breve guia de estudo em 2 partes:

1. Insight Central
2. Conexão e Transformação
   * Referências cruzadas (AT e NT) - DEVE ser um array de strings simples
   * 2 perguntas de aplicação pessoal - DEVE ser um array de strings

Responda APENAS em formato JSON válido com as chaves: "insight", "crossReferences" (array de strings), "applicationQuestions" (array de strings). 

IMPORTANTE: crossReferences deve ser um array de strings simples como ["João 3:16", "Romanos 8:28"], não objetos.

Não inclua texto adicional antes ou depois do JSON.
`;

      try {
        const response = await callOpenAI(prompt);
        
        try {
          const parsed = JSON.parse(response);
          
          if (!parsed.insight || !Array.isArray(parsed.crossReferences) || !Array.isArray(parsed.applicationQuestions)) {
            throw new Error("Invalid response structure");
          }

          // Ensure crossReferences are strings, not objects
          const crossReferences = parsed.crossReferences.map((ref: any) => {
            if (typeof ref === 'string') {
              return ref;
            } else if (typeof ref === 'object' && ref.reference) {
              return ref.reference;
            } else if (typeof ref === 'object' && ref.verse) {
              return ref.verse;
            } else {
              return String(ref);
            }
          });

          // Ensure applicationQuestions are strings
          const applicationQuestions = parsed.applicationQuestions.map((q: any) => {
            if (typeof q === 'string') {
              return q;
            } else if (typeof q === 'object' && q.question) {
              return q.question;
            } else {
              return String(q);
            }
          });
          
          return {
            insight: String(parsed.insight),
            crossReferences,
            applicationQuestions
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
      } catch (aiError) {
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
