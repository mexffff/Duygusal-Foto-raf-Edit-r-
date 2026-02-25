import React from 'react';
import { FEATURES } from '../constants';
import { Feature, FeatureId } from '../types';
import { Camera, Baby, Clock, Sparkles, Users, Heart, Star, Search } from 'lucide-react';

interface HomeProps {
  onSelectFeature: (feature: Feature) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectFeature }) => {
  const getIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'camera': return <Camera size={size} />;
      case 'baby': return <Baby size={size} />;
      case 'clock': return <Clock size={size} />;
      case 'sparkles': return <Sparkles size={size} />;
      case 'users': return <Users size={size} />;
      case 'heart': return <Heart size={size} />;
      case 'search': return <Search size={size} />;
      default: return <Camera size={size} />;
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Duygusal Fotoğraf Editörü
        </h1>
        <p className="text-gray-500 text-sm">
          Anılarınızı AI ile ölümsüzleştirin
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onSelectFeature(feature)}
            className="group relative flex flex-col items-start p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95 hover:shadow-md h-44"
          >
            {/* Icon Box */}
            <div className={`p-3 rounded-xl mb-3 ${feature.color} transition-transform group-hover:scale-110 duration-300`}>
              {getIcon(feature.icon, 24)}
            </div>
            
            {/* Content */}
            <div className="text-left w-full">
              <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                {feature.description}
              </p>
            </div>

            {/* Premium Badge */}
            {feature.isPremium && (
              <div className="absolute top-3 right-3">
                <div className="bg-yellow-100 text-yellow-700 p-1 rounded-full">
                  <Star size={12} fill="currentColor" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Daily Tip or Ad Space */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles size={18} className="text-yellow-300 animate-pulse" />
          <span className="font-bold text-sm">Günün İpucu</span>
        </div>
        <p className="text-sm opacity-90">
          "Derin Analiz" özelliği ile fotoğraflarınızın gizli hikayesini ve teknik detaylarını keşfedin!
        </p>
      </div>
    </div>
  );
};

export default Home;