import { api, APIError } from "encore.dev/api";
import { bibleBucket } from "./storage";

export interface UploadBibleRequest {
  fileContent: string;
}

export interface UploadBibleResponse {
  success: boolean;
  message: string;
}

// Uploads the NVI Bible JSON file to storage.
export const uploadBible = api<UploadBibleRequest, UploadBibleResponse>(
  { expose: true, method: "POST", path: "/bible/upload" },
  async (req) => {
    try {
      if (!req.fileContent) {
        throw APIError.invalidArgument("fileContent is required");
      }

      // Validate JSON structure for NVI format
      let jsonData;
      try {
        jsonData = JSON.parse(req.fileContent);
      } catch (parseError) {
        throw APIError.invalidArgument("Invalid JSON format");
      }

      // Check if it's an array (NVI format)
      if (!Array.isArray(jsonData)) {
        throw APIError.invalidArgument("Invalid JSON structure - must be an array");
      }

      // Check if first item has expected NVI structure
      if (jsonData.length > 0) {
        const firstBook = jsonData[0];
        if (!firstBook.name || !firstBook.abbrev || !Array.isArray(firstBook.chapters)) {
          throw APIError.invalidArgument("Invalid JSON structure - NVI format expected");
        }

        // Check if chapters contain arrays of verses
        if (firstBook.chapters.length > 0 && !Array.isArray(firstBook.chapters[0])) {
          throw APIError.invalidArgument("Invalid JSON structure - chapters must be arrays of verses");
        }
      }

      // Upload to bucket
      const buffer = Buffer.from(req.fileContent, 'utf-8');
      await bibleBucket.upload("nvi.json", buffer, {
        contentType: "application/json"
      });

      return {
        success: true,
        message: "Bíblia NVI carregada com sucesso!"
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to upload Bible: ${error}`);
    }
  }
);
