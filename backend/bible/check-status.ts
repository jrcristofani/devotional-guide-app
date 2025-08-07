import { api } from "encore.dev/api";
import { bibleBucket } from "./storage";

export interface BibleStatusResponse {
  isAvailable: boolean;
  message: string;
}

// Checks if the NVI Bible is available in storage.
export const checkBibleStatus = api<void, BibleStatusResponse>(
  { expose: true, method: "GET", path: "/bible/status" },
  async () => {
    try {
      const exists = await bibleBucket.exists("nvi.json");
      
      if (exists) {
        return {
          isAvailable: true,
          message: "Bíblia NVI está disponível"
        };
      } else {
        return {
          isAvailable: false,
          message: "Bíblia NVI não encontrada. Faça upload do arquivo nvi.json."
        };
      }
    } catch (error) {
      return {
        isAvailable: false,
        message: "Erro ao verificar status da Bíblia"
      };
    }
  }
);
