import React from 'react';
import { Compass, Calendar, MapPin, BookOpen, Users, Bookmark } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  onOpenItinerary: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenItinerary
}) => {
  const items = [
    { id: 'inicio', label: 'Inicio', icon: Compass },
    { id: 'programa', label: 'Cartelera', icon: Calendar },
    { id: 'sedes', label: 'Sedes', icon: MapPin },
    { id: 'actividades', label: 'Académicas', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1F1D1B]/95 backdrop-blur-lg border-t border-[#34302C] px-1 py-1 shadow-2xl pb-safe">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-[#D99B26]' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#D99B26]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Itinerario Direct Action */}
        <button
          onClick={onOpenItinerary}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] rounded-lg transition-colors cursor-pointer relative ${
            savedCount > 0 ? 'text-[#D99B26]' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="Abrir mi itinerario"
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 ${savedCount > 0 ? 'fill-[#D99B26] stroke-[#D99B26]' : 'stroke-2'}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#D99B26] text-[#1F1D1B] font-black text-[10px] rounded-full flex items-center justify-center shadow">
                {savedCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${savedCount > 0 ? 'font-bold text-[#D99B26]' : 'font-medium'}`}>
            Mi Ruta
          </span>
        </button>
      </div>
    </nav>
  );
};

