interface BookMapping {
  name: string;
  abbreviations: string[];
  singleChapter?: boolean;
}

const BOOK_MAPPINGS: BookMapping[] = [
  // Old Testament
  { name: "Gênesis", abbreviations: ["gn", "gen", "genesis", "gênesis"] },
  { name: "Êxodo", abbreviations: ["ex", "êx", "exo", "êxodo", "exodo"] },
  { name: "Levítico", abbreviations: ["lv", "lev", "levitico", "levítico"] },
  { name: "Números", abbreviations: ["nm", "num", "numeros", "números"] },
  { name: "Deuteronômio", abbreviations: ["dt", "deu", "deut", "deuteronomio", "deuteronômio"] },
  { name: "Josué", abbreviations: ["js", "jos", "josue", "josué"] },
  { name: "Juízes", abbreviations: ["jz", "jui", "juizes", "juízes"] },
  { name: "Rute", abbreviations: ["rt", "rut", "rute"] },
  { name: "1 Samuel", abbreviations: ["1sm", "1 sm", "1sam", "1 sam", "1 samuel"] },
  { name: "2 Samuel", abbreviations: ["2sm", "2 sm", "2sam", "2 sam", "2 samuel"] },
  { name: "1 Reis", abbreviations: ["1rs", "1 rs", "1re", "1 re", "1 reis"] },
  { name: "2 Reis", abbreviations: ["2rs", "2 rs", "2re", "2 re", "2 reis"] },
  { name: "1 Crônicas", abbreviations: ["1cr", "1 cr", "1cro", "1 cro", "1 cronicas", "1 crônicas"] },
  { name: "2 Crônicas", abbreviations: ["2cr", "2 cr", "2cro", "2 cro", "2 cronicas", "2 crônicas"] },
  { name: "Esdras", abbreviations: ["ed", "esd", "esdras"] },
  { name: "Neemias", abbreviations: ["ne", "nee", "neemias"] },
  { name: "Ester", abbreviations: ["et", "est", "ester"] },
  { name: "Jó", abbreviations: ["jó", "jo", "job"] },
  { name: "Salmos", abbreviations: ["sl", "sal", "salmo", "salmos"] },
  { name: "Provérbios", abbreviations: ["pv", "pro", "prov", "proverbios", "provérbios"] },
  { name: "Eclesiastes", abbreviations: ["ec", "ecl", "eclesiastes"] },
  { name: "Cantares", abbreviations: ["ct", "can", "cant", "cantares", "cantico", "cântico"] },
  { name: "Isaías", abbreviations: ["is", "isa", "isaias", "isaías"] },
  { name: "Jeremias", abbreviations: ["jr", "jer", "jeremias"] },
  { name: "Lamentações", abbreviations: ["lm", "lam", "lamentacoes", "lamentações"] },
  { name: "Ezequiel", abbreviations: ["ez", "eze", "ezequiel"] },
  { name: "Daniel", abbreviations: ["dn", "dan", "daniel"] },
  { name: "Oséias", abbreviations: ["os", "ose", "oseias", "oséias"] },
  { name: "Joel", abbreviations: ["jl", "joe", "joel"] },
  { name: "Amós", abbreviations: ["am", "amo", "amos", "amós"] },
  { name: "Obadias", abbreviations: ["ob", "oba", "obadias"], singleChapter: true },
  { name: "Jonas", abbreviations: ["jn", "jon", "jonas"] },
  { name: "Miquéias", abbreviations: ["mq", "miq", "miqueias", "miquéias"] },
  { name: "Naum", abbreviations: ["na", "nau", "naum"] },
  { name: "Habacuque", abbreviations: ["hc", "hab", "habacuque"] },
  { name: "Sofonias", abbreviations: ["sf", "sof", "sofonias"] },
  { name: "Ageu", abbreviations: ["ag", "age", "ageu"] },
  { name: "Zacarias", abbreviations: ["zc", "zac", "zacarias"] },
  { name: "Malaquias", abbreviations: ["ml", "mal", "malaquias"] },

  // New Testament
  { name: "Mateus", abbreviations: ["mt", "mat", "mateus"] },
  { name: "Marcos", abbreviations: ["mc", "mar", "marcos"] },
  { name: "Lucas", abbreviations: ["lc", "luc", "lucas"] },
  { name: "João", abbreviations: ["jo", "joa", "joao", "joão"] },
  { name: "Atos", abbreviations: ["at", "ato", "atos"] },
  { name: "Romanos", abbreviations: ["rm", "rom", "romanos"] },
  { name: "1 Coríntios", abbreviations: ["1co", "1 co", "1cor", "1 cor", "1 corintios", "1 coríntios"] },
  { name: "2 Coríntios", abbreviations: ["2co", "2 co", "2cor", "2 cor", "2 corintios", "2 coríntios"] },
  { name: "Gálatas", abbreviations: ["gl", "gal", "galatas", "gálatas"] },
  { name: "Efésios", abbreviations: ["ef", "efe", "efesios", "efésios"] },
  { name: "Filipenses", abbreviations: ["fp", "fil", "filipenses"] },
  { name: "Colossenses", abbreviations: ["cl", "col", "colossenses"] },
  { name: "1 Tessalonicenses", abbreviations: ["1ts", "1 ts", "1te", "1 te", "1tes", "1 tes", "1 tessalonicenses"] },
  { name: "2 Tessalonicenses", abbreviations: ["2ts", "2 ts", "2te", "2 te", "2tes", "2 tes", "2 tessalonicenses"] },
  { name: "1 Timóteo", abbreviations: ["1tm", "1 tm", "1ti", "1 ti", "1tim", "1 tim", "1 timoteo", "1 timóteo"] },
  { name: "2 Timóteo", abbreviations: ["2tm", "2 tm", "2ti", "2 ti", "2tim", "2 tim", "2 timoteo", "2 timóteo"] },
  { name: "Tito", abbreviations: ["tt", "tit", "tito"] },
  { name: "Filemom", abbreviations: ["fm", "fil", "filemom"], singleChapter: true },
  { name: "Hebreus", abbreviations: ["hb", "heb", "hebreus"] },
  { name: "Tiago", abbreviations: ["tg", "tia", "tiago"] },
  { name: "1 Pedro", abbreviations: ["1pe", "1 pe", "1pd", "1 pd", "1 pedro"] },
  { name: "2 Pedro", abbreviations: ["2pe", "2 pe", "2pd", "2 pd", "2 pedro"] },
  { name: "1 João", abbreviations: ["1jo", "1 jo", "1joa", "1 joa", "1 joao", "1 joão"], singleChapter: true },
  { name: "2 João", abbreviations: ["2jo", "2 jo", "2joa", "2 joa", "2 joao", "2 joão"], singleChapter: true },
  { name: "3 João", abbreviations: ["3jo", "3 jo", "3joa", "3 joa", "3 joao", "3 joão"], singleChapter: true },
  { name: "Judas", abbreviations: ["jd", "jud", "judas"], singleChapter: true },
  { name: "Apocalipse", abbreviations: ["ap", "apo", "apoc", "apocalipse"] }
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .trim();
}

function findBookByName(input: string): BookMapping | null {
  const normalized = normalizeText(input);
  
  // Handle ambiguity between "jo" (João) and "jó" (Jó)
  if (normalized === "jo") {
    // Default to João (Gospel) as it's more commonly referenced
    return BOOK_MAPPINGS.find(book => book.name === "João") || null;
  }
  
  // Find exact match first
  for (const book of BOOK_MAPPINGS) {
    if (normalizeText(book.name) === normalized) {
      return book;
    }
  }
  
  // Find by abbreviation
  for (const book of BOOK_MAPPINGS) {
    for (const abbrev of book.abbreviations) {
      if (normalizeText(abbrev) === normalized) {
        return book;
      }
    }
  }
  
  return null;
}

function parseChapterVerse(text: string): { chapter?: number; verse?: string } {
  // Remove spaces around dots and colons
  const cleaned = text.replace(/\s*[.:]\s*/g, ':').replace(/\s*,\s*/g, ',');
  
  // Handle ranges with "a" (e.g., "2.8 a 3.3")
  const rangeMatch = cleaned.match(/(\d+):(\d+)\s*a\s*(\d+):(\d+)/);
  if (rangeMatch) {
    return {
      chapter: parseInt(rangeMatch[1]),
      verse: `${rangeMatch[2]}-${rangeMatch[3]}:${rangeMatch[4]}`
    };
  }
  
  // Handle chapter:verse format
  const chapterVerseMatch = cleaned.match(/(\d+):(.+)/);
  if (chapterVerseMatch) {
    return {
      chapter: parseInt(chapterVerseMatch[1]),
      verse: chapterVerseMatch[2]
    };
  }
  
  // Handle just chapter
  const chapterMatch = cleaned.match(/^(\d+)$/);
  if (chapterMatch) {
    return {
      chapter: parseInt(chapterMatch[1])
    };
  }
  
  return {};
}

export function normalizeReference(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }
  
  const trimmed = input.trim();
  if (!trimmed) {
    return input;
  }
  
  // Split by common separators to handle multiple references
  const parts = trimmed.split(/[;,]/).map(part => part.trim());
  const normalizedParts: string[] = [];
  
  for (const part of parts) {
    // Match book name and chapter/verse pattern
    const match = part.match(/^(.+?)(?:\s+(\d+(?:[.:]\d+(?:\s*[a-z]\s*\d+[.:]\d+)?(?:[,:]\d+)*)?))?\s*$/i);
    
    if (!match) {
      normalizedParts.push(part);
      continue;
    }
    
    const [, bookPart, chapterVersePart] = match;
    const book = findBookByName(bookPart);
    
    if (!book) {
      normalizedParts.push(part);
      continue;
    }
    
    if (!chapterVersePart) {
      normalizedParts.push(book.name);
      continue;
    }
    
    const { chapter, verse } = parseChapterVerse(chapterVersePart);
    
    // Handle single chapter books
    if (book.singleChapter) {
      if (chapter && !verse) {
        // If only a number is provided for single chapter book, treat it as verse
        normalizedParts.push(`${book.name} ${chapter}`);
      } else if (chapter && verse) {
        // If chapter:verse format, the "chapter" is actually the verse
        normalizedParts.push(`${book.name} ${chapter}:${verse}`);
      } else {
        normalizedParts.push(`${book.name} ${chapterVersePart}`);
      }
    } else {
      // Regular books with multiple chapters
      if (chapter && verse) {
        normalizedParts.push(`${book.name} ${chapter}:${verse}`);
      } else if (chapter) {
        normalizedParts.push(`${book.name} ${chapter}`);
      } else {
        normalizedParts.push(`${book.name} ${chapterVersePart}`);
      }
    }
  }
  
  return normalizedParts.join(', ');
}
