import { GoogleGenAI } from "@google/genai";
import { API_KEY } from '../constants';
import { FeatureId, ImageSize } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Models
const MODEL_FAST_IMAGE = 'gemini-2.5-flash-image'; // Editing & Standard Generation
const MODEL_PRO_IMAGE = 'gemini-3-pro-image-preview'; // High Quality Generation
const MODEL_THINKING = 'gemini-3-pro-preview'; // Deep Analysis
const MODEL_FAST_TEXT = 'gemini-2.5-flash-lite'; // Fast responses

// Helper to prepare image parts
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateAIImage = async (
  featureId: FeatureId,
  files: File[],
  customPrompt?: string,
  imageSize: ImageSize = '1K'
): Promise<string> => {
  let modelName = MODEL_FAST_IMAGE;
  let systemPrompt = "";
  let config: any = {};

  // Feature-specific Configuration
  switch (featureId) {
    case FeatureId.ENHANCE:
      // Uses Nano Banana (Flash Image) for editing
      modelName = MODEL_FAST_IMAGE;
      systemPrompt = customPrompt 
        ? `Edit this image based on this instruction: ${customPrompt}` 
        : "Enhance this image to have professional studio lighting and sharp details.";
      break;
    case FeatureId.FUTURE_CHILD:
      // Uses Nano Banana Pro (Pro Image Preview) for high quality generation
      modelName = MODEL_PRO_IMAGE; 
      systemPrompt = "Generate a photorealistic image of a young child (approx 5 years old) that genetically looks like a combination of the two people provided in the images. Focus on facial features.";
      config.imageConfig = {
        imageSize: imageSize // 1K, 2K, or 4K
      };
      break;
    case FeatureId.TIME_BRIDGE:
      modelName = MODEL_FAST_IMAGE;
      systemPrompt = "Modernize this photo. If it looks old, make it look like it was taken today with a high-end camera. Keep the pose and setting but update the aesthetic quality.";
      break;
    case FeatureId.RESTORE:
      modelName = MODEL_PRO_IMAGE; 
      systemPrompt = "Restore this image. Fix any scratches, tears, or noise. If it is black and white, colorize it naturally. Make it look like a pristine memory.";
      break;
    case FeatureId.ALBUM:
      modelName = MODEL_PRO_IMAGE;
      systemPrompt = "Create a seamless, artistic collage using the people and elements from the provided photos. Arrange them in a harmonious composition suitable for a family album.";
      config.imageConfig = { imageSize: '1K' };
      break;
    case FeatureId.EMOTIONAL:
      modelName = MODEL_FAST_IMAGE;
      systemPrompt = `Apply a ${customPrompt || 'nostalgic and warm'} emotional style to this image. The lighting and color grading should evoke deep feelings.`;
      break;
  }

  // Prepare content parts
  const imageParts = await Promise.all(files.map(file => fileToGenerativePart(file)));
  
  // Construct the user prompt
  // For editing (Flash Image), we pass image + text.
  // For generation (Pro Image), we pass image (as reference) + text.
  const contents = {
    parts: [...imageParts, { text: systemPrompt }]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    // Parse Response for Image
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("AI yanıtı bir görsel içermiyor. Lütfen tekrar deneyin.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeImageDeeply = async (files: File[], customPrompt?: string): Promise<string> => {
  const imageParts = await Promise.all(files.map(file => fileToGenerativePart(file)));
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_THINKING, // gemini-3-pro-preview
      contents: {
        parts: [
            ...imageParts, 
            { text: customPrompt || "Analyze this image in extreme detail. Describe the emotions, the technical aspects (lighting, composition), and the story it tells." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Max thinking for deep analysis
      }
    });

    return response.text || "Analiz yapılamadı.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const getFastSuggestion = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_FAST_TEXT, // gemini-2.5-flash-lite
            contents: {
                parts: [{ text: `Provide a very short, catchy title (max 5 words) for a photo based on this description: ${text}` }]
            }
        });
        return response.text || "";
    } catch (error) {
        return "";
    }
};