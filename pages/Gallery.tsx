import React from 'react';
import { SavedImage } from '../types';
import { Download, Trash2, Search, FileText } from 'lucide-react';

interface GalleryProps {
  images: SavedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center pb-24">
        <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center mb-6">
          <Search size={48} className="text-purple-200" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz fotoğraf yok</h3>
        <p className="text-gray-500">
          İlk düzenlemenizi yapmak için ana sayfaya gidin ve bir özellik seçin.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Galeri</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="aspect-[4/5] w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                {img.dataUrl ? (
                    <img src={img.dataUrl} alt="Saved" className="w-full h-full object-cover" />
                ) : (
                    <div className="p-4 text-center">
                        <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 line-clamp-6">{img.textData || "Metin içeriği"}</p>
                    </div>
                )}
            </div>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <div className="flex justify-between items-center">
                 {img.dataUrl && (
                     <button className="p-2 bg-white/20 text-white rounded-full backdrop-blur-md hover:bg-white/30">
                        <Download size={16} />
                     </button>
                 )}
                 <button 
                   onClick={() => onDelete(img.id)}
                   className="p-2 bg-red-500/80 text-white rounded-full backdrop-blur-md hover:bg-red-600 ml-auto"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
              <p className="text-white text-[10px] mt-2 opacity-80 truncate">
                {new Date(img.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;