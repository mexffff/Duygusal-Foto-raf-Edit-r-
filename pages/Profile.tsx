import React from 'react';
import { UserProfile } from '../types';
import { Settings, CreditCard, HelpCircle, LogOut, Crown, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const user: UserProfile = {
    name: "Misafir Kullanıcı",
    isPremium: false,
    credits: 3,
    joinedDate: "Ekim 2023"
  };

  const menuItems = [
    { icon: <Settings size={20} />, label: "Ayarlar" },
    { icon: <HelpCircle size={20} />, label: "Yardım Merkezi" },
    { icon: <CreditCard size={20} />, label: "Abonelik Yönetimi" },
  ];

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
            MK
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">Üyelik: {user.joinedDate}</p>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Crown size={18} className="text-yellow-400" />
              <span className="font-bold">Premium'a Geç</span>
            </div>
            <p className="text-xs text-gray-300">Sınırsız üretim ve 4K kalite</p>
          </div>
          <button className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-lg">
            Yükselt
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-xs mb-1">Kalan Haklar</p>
          <p className="text-2xl font-bold text-gray-800">{user.credits}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-xs mb-1">Galeri</p>
          <p className="text-2xl font-bold text-gray-800">12 Foto</p>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center space-x-3 text-gray-600">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 group">
          <div className="flex items-center space-x-3 text-red-500">
            <LogOut size={20} />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </div>
        </button>
      </div>
      
      <p className="text-center text-xs text-gray-300 mt-8">Versiyon 1.0.0 (Gemini Powered)</p>
    </div>
  );
};

export default Profile;