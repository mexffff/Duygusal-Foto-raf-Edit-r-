import React, { useState, useRef } from 'react';
import { Feature, FeatureId, SavedImage, ImageSize } from '../types';
import { ArrowLeft, Upload, X, Zap, Download, Share2, AlertCircle, Sparkles, Search } from 'lucide-react';
import { generateAIImage, analyzeImageDeeply, getFastSuggestion } from '../services/geminiService';

interface EditorProps {
  feature: Feature;
  onBack: () => void;
  onSave: (image: SavedImage) => void;
}

const Editor: React.FC<EditorProps> = ({ feature, onBack, onSave }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null); // For Analysis results
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [suggestion, setSuggestion] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFiles = feature.id === FeatureId.FUTURE_CHILD ? 2 : feature.id === FeatureId.ALBUM ? 10 : 1;
  const minFiles = feature.id === FeatureId.FUTURE_CHILD ? 2 : 1;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles);
      
      setSelectedFiles(combinedFiles);
      
      // Create previews
      const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setError(null);

      // Fast AI Response: Quick suggestion using Flash Lite
      if (feature.id === FeatureId.ENHANCE || feature.id === FeatureId.EMOTIONAL) {
          const quick = await getFastSuggestion("A beautiful memory photo");
          setSuggestion(quick.replace(/"/g, ''));
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleGenerate = async () => {
    if (selectedFiles.length < minFiles) {
      setError(`Lütfen işlem için en az ${minFiles} fotoğraf seçin.`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    setResultText(null);

    try {
      if (feature.id === FeatureId.ANALYZE) {
          // Use Deep Thinking Model
          const textResult = await analyzeImageDeeply(selectedFiles, customPrompt);
          setResultText(textResult);
      } else {
          // Use Image Models
          const base64Result = await generateAIImage(feature.id, selectedFiles, customPrompt, imageSize);
          setResultImage(base64Result);
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (resultImage || resultText) {
      const saved: SavedImage = {
        id: Date.now().toString(),
        dataUrl: resultImage || undefined,
        textData: resultText || undefined,
        date: Date.now(),
        featureId: feature.id,
        prompt: customPrompt
      };
      onSave(saved);
      alert('Galeriye kaydedildi!');
    }
  };

  const getStepDescription = () => {
    if (resultImage || resultText) return "Sonuç hazır! Beğendiyseniz kaydedin.";
    if (isProcessing) return feature.id === FeatureId.ANALYZE ? "AI derinlemesine düşünüyor..." : "AI sihir yapıyor...";
    if (selectedFiles.length === 0) return "Başlamak için fotoğraf yükleyin.";
    if (selectedFiles.length < minFiles) return `Devam etmek için ${minFiles - selectedFiles.length} fotoğraf daha ekleyin.`;
    return "Fotoğraflar hazır. İşlemi başlatın.";
  };

  return (
    <div className="flex flex-col h-full bg-white pb-safe-area">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="ml-2 font-bold text-gray-800">{feature.title}</h2>
        {feature.isPremium && (
          <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">Premium</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Status Bar */}
        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 transition-colors ${
          error ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-700'
        }`}>
          {error ? <AlertCircle size={20} /> : <Zap size={20} className={isProcessing ? 'animate-pulse' : ''} />}
          <p className="text-sm font-medium">{error || getStepDescription()}</p>
        </div>

        {/* Result Area */}
        {resultImage || resultText ? (
          <div className="space-y-4 animate-fade-in">
            {resultImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img src={resultImage} alt="Generated Result" className="w-full h-auto" />
                </div>
            )}
            
            {resultText && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                        <Sparkles size={18} className="mr-2 text-purple-600" />
                        AI Analiz Raporu
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {resultText}
                    </p>
                </div>
            )}
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSave}
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
              >
                <Download size={20} />
                <span>Kaydet</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium active:scale-95 transition-transform">
                <Share2 size={20} />
                <span>Paylaş</span>
              </button>
            </div>
            
            <button 
              onClick={() => { setResultImage(null); setResultText(null); }} 
              className="w-full text-center text-gray-500 text-sm py-2 hover:text-purple-600"
            >
              Yeni bir işlem yap
            </button>
          </div>
        ) : (
          /* Input Area */
          <div className="space-y-6">
            
            {/* Upload Area */}
            {selectedFiles.length < maxFiles && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-purple-50 transition-colors"
              >
                <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="font-bold text-gray-700">Fotoğraf Seç</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {feature.id === FeatureId.FUTURE_CHILD ? 'Anne veya Baba fotoğrafı' : 'Galeriden veya Kameradan'}
                  </p>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              accept="image/*" 
              multiple={maxFiles > 1}
            />

            {/* Preview Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Config Areas */}
            
            {/* Image Size for Pro Generation Features */}
            {feature.id === FeatureId.FUTURE_CHILD && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Görüntü Kalitesi (Pro)</label>
                    <div className="flex space-x-2">
                        {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setImageSize(size)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                    imageSize === size 
                                    ? 'bg-purple-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Text Prompts */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        {feature.id === FeatureId.ENHANCE ? 'Nasıl düzenlensin?' : 'Ek İstekler (Opsiyonel)'}
                    </label>
                    {suggestion && (
                        <span 
                            onClick={() => setCustomPrompt(suggestion)}
                            className="text-xs text-purple-600 cursor-pointer hover:underline"
                        >
                            Öneri: "{suggestion}"
                        </span>
                    )}
                </div>
                <textarea
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  placeholder={
                    feature.id === FeatureId.ENHANCE ? "Örn: Arka plandaki kişiyi kaldır, retro filtre ekle..." :
                    feature.id === FeatureId.ANALYZE ? "Örn: Fotoğrafın duygusunu ve teknik detaylarını anlat..." :
                    "AI'ya özel bir not bırakın..."
                  }
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isProcessing || selectedFiles.length < minFiles}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                isProcessing || selectedFiles.length < minFiles
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-200'
              }`}
            >
              {isProcessing ? (
                  <span>İşleniyor...</span>
              ) : feature.id === FeatureId.ANALYZE ? (
                  <>
                    <Search size={20} />
                    <span>Analiz Et</span>
                  </>
              ) : (
                  <>
                    <Sparkles size={20} />
                    <span>{feature.id === FeatureId.FUTURE_CHILD ? 'Oluştur' : 'Düzenle'}</span>
                  </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;