import { Feature, FeatureId } from './types';

// NOTE: In a real production environment, this key should be in process.env
// However, per the specific request instructions to make the app functional immediately:
export const API_KEY = "AIzaSyBkLbWxzwOzb_cfAYktdMCmoRkqHEiJId4";

export const FEATURES: Feature[] = [
  {
    id: FeatureId.ENHANCE,
    title: "Son Anı Güzelleştir",
    description: "Metin komutlarıyla fotoğrafını düzenle.",
    icon: "camera",
    isPremium: true,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: FeatureId.FUTURE_CHILD,
    title: "Gelecek Aynası",
    description: "Bebeğiniz kime benzeyecek? (Pro)",
    icon: "baby",
    isPremium: true,
    color: "bg-pink-100 text-pink-600"
  },
  {
    id: FeatureId.ANALYZE,
    title: "Derin Analiz",
    description: "Fotoğrafınızı AI ile detaylı analiz edin.",
    icon: "search",
    isPremium: true,
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    id: FeatureId.TIME_BRIDGE,
    title: "Zaman Köprüsü",
    description: "Geçmişi modern zamana taşı.",
    icon: "clock",
    isPremium: false,
    color: "bg-amber-100 text-amber-600"
  },
  {
    id: FeatureId.RESTORE,
    title: "Anı Canlandır",
    description: "Eski fotoğrafları onar ve renklendir.",
    icon: "sparkles",
    isPremium: false,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: FeatureId.ALBUM,
    title: "Aile Albümü",
    description: "Sanatsal kolajlar oluştur.",
    icon: "users",
    isPremium: false,
    color: "bg-green-100 text-green-600"
  },
  {
    id: FeatureId.EMOTIONAL,
    title: "Duygusal Anlar",
    description: "Anılarına duygu kat.",
    icon: "heart",
    isPremium: true,
    color: "bg-rose-100 text-rose-600"
  }
];