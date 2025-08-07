import { Bucket } from "encore.dev/storage/objects";

// Bucket para armazenar a Bíblia NVI em formato JSON
export const bibleBucket = new Bucket("bible-storage", {
  public: false
});
