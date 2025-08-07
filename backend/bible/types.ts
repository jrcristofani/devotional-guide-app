export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  name: string;
  chapters: BibleChapter[];
}

export interface BibleData {
  version: string;
  books: BibleBook[];
}

export interface GetPassageRequest {
  reference: string;
}

export interface GetPassageResponse {
  reference: string;
  text: string;
  verses: BibleVerse[];
}
