import { BibleVerse } from "./types";

interface ParsedReference {
  book: string;
  chapter?: number;
  startVerse?: number;
  endVerse?: number;
  isWholeChapter?: boolean;
}

const BOOK_MAPPINGS: Record<string, string> = {
  // Old Testament
  "gênesis": "Gênesis", "gn": "Gênesis", "gen": "Gênesis",
  "êxodo": "Êxodo", "ex": "Êxodo", "êx": "Êxodo", "exo": "Êxodo",
  "levítico": "Levítico", "lv": "Levítico", "lev": "Levítico",
  "números": "Números", "nm": "Números", "num": "Números",
  "deuteronômio": "Deuteronômio", "dt": "Deuteronômio", "deu": "Deuteronômio",
  "josué": "Josué", "js": "Josué", "jos": "Josué",
  "juízes": "Juízes", "jz": "Juízes", "jui": "Juízes",
  "rute": "Rute", "rt": "Rute", "rut": "Rute",
  "1 samuel": "1 Samuel", "1sm": "1 Samuel", "1 sm": "1 Samuel",
  "2 samuel": "2 Samuel", "2sm": "2 Samuel", "2 sm": "2 Samuel",
  "1 reis": "1 Reis", "1rs": "1 Reis", "1 rs": "1 Reis",
  "2 reis": "2 Reis", "2rs": "2 Reis", "2 rs": "2 Reis",
  "1 crônicas": "1 Crônicas", "1cr": "1 Crônicas", "1 cr": "1 Crônicas",
  "2 crônicas": "2 Crônicas", "2cr": "2 Crônicas", "2 cr": "2 Crônicas",
  "esdras": "Esdras", "ed": "Esdras", "esd": "Esdras",
  "neemias": "Neemias", "ne": "Neemias", "nee": "Neemias",
  "ester": "Ester", "et": "Ester", "est": "Ester",
  "jó": "Jó", "jo": "Jó", "job": "Jó",
  "salmos": "Salmos", "sl": "Salmos", "sal": "Salmos",
  "provérbios": "Provérbios", "pv": "Provérbios", "pro": "Provérbios",
  "eclesiastes": "Eclesiastes", "ec": "Eclesiastes", "ecl": "Eclesiastes",
  "cantares": "Cantares", "ct": "Cantares", "can": "Cantares",
  "isaías": "Isaías", "is": "Isaías", "isa": "Isaías",
  "jeremias": "Jeremias", "jr": "Jeremias", "jer": "Jeremias",
  "lamentações": "Lamentações", "lm": "Lamentações", "lam": "Lamentações",
  "ezequiel": "Ezequiel", "ez": "Ezequiel", "eze": "Ezequiel",
  "daniel": "Daniel", "dn": "Daniel", "dan": "Daniel",
  "oséias": "Oséias", "os": "Oséias", "ose": "Oséias",
  "joel": "Joel", "jl": "Joel", "joe": "Joel",
  "amós": "Amós", "am": "Amós", "amo": "Amós",
  "obadias": "Obadias", "ob": "Obadias", "oba": "Obadias",
  "jonas": "Jonas", "jn": "Jonas", "jon": "Jonas",
  "miquéias": "Miquéias", "mq": "Miquéias", "miq": "Miquéias",
  "naum": "Naum", "na": "Naum", "nau": "Naum",
  "habacuque": "Habacuque", "hc": "Habacuque", "hab": "Habacuque",
  "sofonias": "Sofonias", "sf": "Sofonias", "sof": "Sofonias",
  "ageu": "Ageu", "ag": "Ageu", "age": "Ageu",
  "zacarias": "Zacarias", "zc": "Zacarias", "zac": "Zacarias",
  "malaquias": "Malaquias", "ml": "Malaquias", "mal": "Malaquias",

  // New Testament
  "mateus": "Mateus", "mt": "Mateus", "mat": "Mateus",
  "marcos": "Marcos", "mc": "Marcos", "mar": "Marcos",
  "lucas": "Lucas", "lc": "Lucas", "luc": "Lucas",
  "joão": "João", "jo": "João", "joa": "João",
  "atos": "Atos", "at": "Atos", "ato": "Atos",
  "romanos": "Romanos", "rm": "Romanos", "rom": "Romanos",
  "1 coríntios": "1 Coríntios", "1co": "1 Coríntios", "1 co": "1 Coríntios",
  "2 coríntios": "2 Coríntios", "2co": "2 Coríntios", "2 co": "2 Coríntios",
  "gálatas": "Gálatas", "gl": "Gálatas", "gal": "Gálatas",
  "efésios": "Efésios", "ef": "Efésios", "efe": "Efésios",
  "filipenses": "Filipenses", "fp": "Filipenses", "fil": "Filipenses",
  "colossenses": "Colossenses", "cl": "Colossenses", "col": "Colossenses",
  "1 tessalonicenses": "1 Tessalonicenses", "1ts": "1 Tessalonicenses", "1 ts": "1 Tessalonicenses",
  "2 tessalonicenses": "2 Tessalonicenses", "2ts": "2 Tessalonicenses", "2 ts": "2 Tessalonicenses",
  "1 timóteo": "1 Timóteo", "1tm": "1 Timóteo", "1 tm": "1 Timóteo",
  "2 timóteo": "2 Timóteo", "2tm": "2 Timóteo", "2 tm": "2 Timóteo",
  "tito": "Tito", "tt": "Tito", "tit": "Tito",
  "filemom": "Filemom", "fm": "Filemom", "fil": "Filemom",
  "hebreus": "Hebreus", "hb": "Hebreus", "heb": "Hebreus",
  "tiago": "Tiago", "tg": "Tiago", "tia": "Tiago",
  "1 pedro": "1 Pedro", "1pe": "1 Pedro", "1 pe": "1 Pedro",
  "2 pedro": "2 Pedro", "2pe": "2 Pedro", "2 pe": "2 Pedro",
  "1 joão": "1 João", "1jo": "1 João", "1 jo": "1 João",
  "2 joão": "2 João", "2jo": "2 João", "2 jo": "2 João",
  "3 joão": "3 João", "3jo": "3 João", "3 jo": "3 João",
  "judas": "Judas", "jd": "Judas", "jud": "Judas",
  "apocalipse": "Apocalipse", "ap": "Apocalipse", "apo": "Apocalipse"
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function parseReference(reference: string): ParsedReference | null {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  // Match patterns like "João 3:16", "Salmos 23", "1 Coríntios 13:1-13"
  const match = trimmed.match(/^(.+?)(?:\s+(\d+)(?:[.:]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?)?$/);
  
  if (!match) {
    return null;
  }

  const [, bookPart, chapterStr, startVerseStr, endVerseStr] = match;
  
  // Normalize and find book
  const normalizedBook = normalizeText(bookPart);
  const bookName = BOOK_MAPPINGS[normalizedBook];
  
  if (!bookName) {
    return null;
  }

  const result: ParsedReference = { book: bookName };

  if (chapterStr) {
    result.chapter = parseInt(chapterStr);
    
    if (startVerseStr) {
      result.startVerse = parseInt(startVerseStr);
      if (endVerseStr) {
        result.endVerse = parseInt(endVerseStr);
      }
    } else {
      result.isWholeChapter = true;
    }
  }

  return result;
}

export function formatVerses(verses: BibleVerse[]): string {
  if (verses.length === 0) {
    return "";
  }

  return verses.map(verse => verse.text).join(" ");
}
