import React from 'react';
import { Home, Image as ImageIcon, User } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItemClass = (view: View) => 
    `flex flex-col items-center justify-center p-2 space-y-1 transition-colors duration-200 ${
      currentView === view ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg pb-safe-area z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <button 
          onClick={() => onChangeView(View.HOME)} 
          className={navItemClass(View.HOME)}
        >
          <Home size={24} strokeWidth={currentView === View.HOME ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Ana Sayfa</span>
        </button>

        <button 
          onClick={() => onChangeView(View.GALLERY)} 
          className={navItemClass(View.GALLERY)}
        >
          <ImageIcon size={24} strokeWidth={currentView === View.GALLERY ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Galeri</span>
        </button>

        <button 
          onClick={() => onChangeView(View.PROFILE)} 
          className={navItemClass(View.PROFILE)}
        >
          <User size={24} strokeWidth={currentView === View.PROFILE ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;