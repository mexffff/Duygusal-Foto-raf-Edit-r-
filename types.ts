export enum View {
  HOME = 'HOME',
  GALLERY = 'GALLERY',
  PROFILE = 'PROFILE',
  EDITOR = 'EDITOR'
}

export enum FeatureId {
  ENHANCE = 'ENHANCE',       // Son Anı Güzelleştir (Nano Banana Editing)
  FUTURE_CHILD = 'FUTURE_CHILD', // Gelecek Aynası (Nano Banana Pro Generation)
  TIME_BRIDGE = 'TIME_BRIDGE',   // Zaman Köprüsü
  RESTORE = 'RESTORE',       // Anı Canlandır
  ALBUM = 'ALBUM',           // Aile Albümü
  EMOTIONAL = 'EMOTIONAL',   // Duygusal Anlar
  ANALYZE = 'ANALYZE'        // Derin Analiz (Thinking Mode)
}

export interface Feature {
  id: FeatureId;
  title: string;
  description: string;
  icon: string;
  isPremium: boolean;
  color: string;
}

export interface SavedImage {
  id: string;
  dataUrl?: string; // Base64 image
  textData?: string; // For analysis results
  date: number;
  featureId: FeatureId;
  prompt: string;
}

export interface UserProfile {
  name: string;
  isPremium: boolean;
  credits: number;
  joinedDate: string;
}

export type ImageSize = '1K' | '2K' | '4K';