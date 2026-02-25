import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import Editor from './pages/Editor';
import { View, Feature, SavedImage } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);

  // Simple Router Logic
  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <Home 
            onSelectFeature={(feature) => {
              setSelectedFeature(feature);
              setCurrentView(View.EDITOR);
            }} 
          />
        );
      case View.GALLERY:
        return (
          <Gallery 
            images={savedImages} 
            onDelete={(id) => setSavedImages(prev => prev.filter(img => img.id !== id))}
          />
        );
      case View.PROFILE:
        return <Profile />;
      case View.EDITOR:
        if (!selectedFeature) return <Home onSelectFeature={(f) => { setSelectedFeature(f); setCurrentView(View.EDITOR); }} />;
        return (
          <Editor 
            feature={selectedFeature} 
            onBack={() => {
              setSelectedFeature(null);
              setCurrentView(View.HOME);
            }}
            onSave={(image) => {
              setSavedImages(prev => [image, ...prev]);
              setCurrentView(View.GALLERY);
            }}
          />
        );
      default:
        return <Home onSelectFeature={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="mx-auto max-w-lg bg-white min-h-screen relative shadow-2xl overflow-hidden">
        {/* Main Content Area */}
        <main className="h-full w-full">
          {renderView()}
        </main>

        {/* Navigation - Only show if not in Editor */}
        {currentView !== View.EDITOR && (
          <BottomNav currentView={currentView} onChangeView={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default App;