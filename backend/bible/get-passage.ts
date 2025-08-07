import { api, APIError } from "encore.dev/api";
import { GetPassageRequest, GetPassageResponse, BibleData, BibleVerse } from "./types";
import { bibleBucket } from "./storage";
import { parseReference, formatVerses } from "./parser";

let cachedBibleData: BibleData | null = null;

async function loadBibleData(): Promise<BibleData> {
  if (cachedBibleData) {
    return cachedBibleData;
  }

  try {
    const exists = await bibleBucket.exists("nvi.json");
    if (!exists) {
      throw APIError.notFound("Arquivo da Bíblia NVI não encontrado. Faça upload do arquivo nvi.json no bucket bible-storage.");
    }

    const buffer = await bibleBucket.download("nvi.json");
    const jsonString = buffer.toString('utf-8');
    cachedBibleData = JSON.parse(jsonString) as BibleData;
    
    return cachedBibleData;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw APIError.internal(`Erro ao carregar dados da Bíblia: ${error}`);
  }
}

function findVerses(bibleData: BibleData, bookName: string, chapter?: number, startVerse?: number, endVerse?: number, isWholeChapter?: boolean): BibleVerse[] {
  const book = bibleData.books.find(b => b.name === bookName);
  if (!book) {
    return [];
  }

  if (!chapter) {
    // Return all verses from the book (not practical, but handled)
    return book.chapters.flatMap(ch => ch.verses);
  }

  const chapterData = book.chapters.find(ch => ch.chapter === chapter);
  if (!chapterData) {
    return [];
  }

  if (isWholeChapter) {
    return chapterData.verses;
  }

  if (startVerse) {
    const end = endVerse || startVerse;
    return chapterData.verses.filter(v => v.verse >= startVerse && v.verse <= end);
  }

  return chapterData.verses;
}

// Retrieves biblical text for a given reference.
export const getPassage = api<GetPassageRequest, GetPassageResponse>(
  { expose: true, method: "POST", path: "/bible/passage" },
  async (req) => {
    try {
      if (!req.reference) {
        throw APIError.invalidArgument("reference is required");
      }

      const parsedRef = parseReference(req.reference);
      if (!parsedRef) {
        throw APIError.invalidArgument(`Referência bíblica inválida: ${req.reference}`);
      }

      const bibleData = await loadBibleData();
      const verses = findVerses(
        bibleData,
        parsedRef.book,
        parsedRef.chapter,
        parsedRef.startVerse,
        parsedRef.endVerse,
        parsedRef.isWholeChapter
      );

      if (verses.length === 0) {
        throw APIError.notFound(`Passagem não encontrada: ${req.reference}`);
      }

      const text = formatVerses(verses);

      return {
        reference: req.reference,
        text,
        verses
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Erro ao buscar passagem: ${error}`);
    }
  }
);
