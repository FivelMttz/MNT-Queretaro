import React, { useState } from 'react';
import { VENUES, PLAYS, Venue, Play } from '../data/mntData';
import { VenueCard } from '../components/VenueCard';
import { VenueMap } from '../components/VenueMap';
import { MapPin, List, Navigation, Search } from 'lucide-react';

interface VenuesViewProps {
  onSelectPlay: (play: Play) => void;
}

export const VenuesView: React.FC<VenuesViewProps> = ({ onSelectPlay }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [venueSearch, setVenueSearch] = useState<string>('');

  const municipalities = [
    { id: 'all', label: 'Todos los municipios (21 sedes)' },
    { id: 'Santiago de Querétaro', label: 'Santiago de Querétaro (Capital)' },
    { id: 'Amealco de Bonfil', label: 'Amealco de Bonfil (UAQ)' },
    { id: 'Jalpan de Serra', label: 'Jalpan de Serra (Sierra Gorda)' },
    { id: 'Pinal de Amoles', label: 'Pinal de Amoles (Sierra Gorda)' },
    { id: 'El Pueblito', label: 'El Pueblito (Corregidora)' }
  ];

  // Filter venues
  const filteredVenues = VENUES.filter((venue) => {
    if (selectedMunicipality !== 'all' && venue.municipality !== selectedMunicipality) {
      return false;
    }
    if (venueSearch.trim() !== '') {
      const q = venueSearch.toLowerCase();
      const matchName = venue.name.toLowerCase().includes(q);
      const matchAddr = venue.address.toLowerCase().includes(q);
      const matchMun = venue.municipality.toLowerCase().includes(q);
      if (!matchName && !matchAddr && !matchMun) return false;
    }
    return true;
  });

  const handleSelectVenueFromMap = (venue: Venue) => {
    setSelectedVenueId(venue.id);
    // On mobile switch to list to see venue details
    if (window.innerWidth < 1024) {
      setMobileTab('list');
    }
    // Scroll to the card
    setTimeout(() => {
      const element = document.getElementById(`venue-${venue.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleFocusVenue = (venue: Venue) => {
    setSelectedVenueId(venue.id);
    if (window.innerWidth < 1024) {
      setMobileTab('map');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left">
      {/* Header de Sección */}
      <div className="border-b border-stone-200 pb-5">
        <div className="text-xs font-bold text-[#D99B26] uppercase tracking-wider mb-1">
          Circuito Escénico Estatal
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1F1D1B] tracking-tight">
          Directorio de Sedes y Mapa Interactivo
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Conoce los 21 recintos de la 46 MNT distribuidos en la capital queretana, la Sierra Gorda y los municipios del estado. Consulta aforos, accesibilidad en silla de ruedas e instrucciones de GPS.
        </p>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center p-1 bg-stone-200 rounded-xl">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'list'
              ? 'bg-white text-[#1F1D1B] shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Ver Lista de Sedes ({filteredVenues.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'map'
              ? 'bg-white text-[#1F1D1B] shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Navigation className="w-4 h-4 text-[#D99B26]" />
          <span>Ver Mapa Cartográfico</span>
        </button>
      </div>

      {/* Filter and Search Bar for Venues */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={venueSearch}
            onChange={(e) => setVenueSearch(e.target.value)}
            placeholder="Buscar sede por nombre, dirección o recinto..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D99B26]"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 text-xs text-[#1F1D1B] font-semibold rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D99B26]"
          >
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layout Dual Flex (Desktop: Left 5 cols List, Right 7 cols Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Lista de Sedes (Shown on desktop, or mobileTab === 'list') */}
        <div className={`lg:col-span-5 space-y-4 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-1">
            <span>{filteredVenues.length} recintos encontrados</span>
            <span className="text-[#8C3B2B] font-bold">Entrada gratuita</span>
          </div>

          <div className="space-y-4 max-h-[780px] overflow-y-auto pr-1">
            {filteredVenues.map((venue) => {
              const venuePlays = PLAYS.filter(p => p.venueId === venue.id);
              const isSelected = selectedVenueId === venue.id;

              return (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  plays={venuePlays}
                  isSelected={isSelected}
                  onSelectPlay={onSelectPlay}
                  onFocusVenue={handleFocusVenue}
                />
              );
            })}
          </div>
        </div>

        {/* Panel Derecho: Mapa Interactivo (Shown on desktop, or mobileTab === 'map') */}
        <div className={`lg:col-span-7 lg:sticky lg:top-20 ${mobileTab === 'map' ? 'block' : 'hidden lg:block'}`}>
          <VenueMap
            venues={filteredVenues}
            plays={PLAYS}
            selectedVenueId={selectedVenueId}
            onSelectVenue={handleSelectVenueFromMap}
            onSelectPlay={onSelectPlay}
          />
        </div>
      </div>
    </div>
  );
};
