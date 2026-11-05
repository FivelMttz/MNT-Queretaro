import React, { useState } from 'react';
import { Venue, Play } from '../data/mntData';
import { MapPin, Navigation, Info, ExternalLink } from 'lucide-react';

interface VenueMapProps {
  venues: Venue[];
  plays: Play[];
  selectedVenueId: string | null;
  onSelectVenue: (venue: Venue) => void;
  onSelectPlay?: (play: Play) => void;
}

export const VenueMap: React.FC<VenueMapProps> = ({
  venues,
  plays,
  selectedVenueId,
  onSelectVenue,
  onSelectPlay
}) => {
  const [activeZoneFilter, setActiveZoneFilter] = useState<'all' | 'centro' | 'sierra' | 'sur'>('all');
  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || null;

  // Filter coordinates depending on focus zone or show overview
  const displayedVenues = venues.filter(v => {
    if (activeZoneFilter === 'centro') return v.zone === 'Querétaro Centro' || v.zone === 'Espacios de Calle';
    if (activeZoneFilter === 'sierra') return v.municipality === 'Jalpan de Serra' || v.municipality === 'Pinal de Amoles';
    if (activeZoneFilter === 'sur') return v.municipality === 'Amealco de Bonfil' || v.municipality === 'El Pueblito';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#1F1D1B] rounded-2xl overflow-hidden border border-[#34302C] shadow-lg relative">
      {/* Top Map Control Strip */}
      <div className="bg-[#181615] px-4 py-3 border-b border-[#2D2A26] flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
          <Navigation className="w-4 h-4 text-[#D99B26]" />
          <span>Cartografía Escénica 46 MNT</span>
        </div>

        {/* Quick Region Switcher */}
        <div className="flex items-center gap-1 text-[11px] font-medium bg-[#24211E] p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => setActiveZoneFilter('all')}
            className={`px-2 py-1 rounded transition-colors ${
              activeZoneFilter === 'all' ? 'bg-[#D99B26] text-[#1F1D1B] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Todo el Estado
          </button>
          <button
            onClick={() => setActiveZoneFilter('centro')}
            className={`px-2 py-1 rounded transition-colors ${
              activeZoneFilter === 'centro' ? 'bg-[#D99B26] text-[#1F1D1B] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Centro Histórico
          </button>
          <button
            onClick={() => setActiveZoneFilter('sierra')}
            className={`px-2 py-1 rounded transition-colors ${
              activeZoneFilter === 'sierra' ? 'bg-[#D99B26] text-[#1F1D1B] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Sierra Gorda
          </button>
          <button
            onClick={() => setActiveZoneFilter('sur')}
            className={`px-2 py-1 rounded transition-colors ${
              activeZoneFilter === 'sur' ? 'bg-[#D99B26] text-[#1F1D1B] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Amealco / Sur
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] bg-[#1a1816] overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-90"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2c2824" strokeWidth="0.2" />
            </pattern>
            {/* Radial glow for Centro */}
            <radialGradient id="centroGlow" cx="50%" cy="48%" r="40%">
              <stop offset="0%" stopColor="#D99B26" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#D99B26" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100" height="100" fill="#1b1917" />
          <rect width="100" height="100" fill="url(#grid)" />
          <circle cx="50" cy="48" r="35" fill="url(#centroGlow)" />

          {/* Stylized State Outline of Querétaro */}
          <path
            d="M 55 5 C 68 8, 85 10, 88 18 C 90 28, 75 32, 65 38 C 70 48, 80 62, 82 78 C 83 90, 70 95, 62 92 C 55 90, 40 85, 30 75 C 22 68, 25 58, 28 50 C 30 42, 35 30, 42 18 Z"
            fill="#23201d"
            stroke="#3a342e"
            strokeWidth="0.6"
            strokeDasharray="1.5,1"
          />

          {/* Historic Los Arcos Aqueduct stylized vector representation */}
          <path
            d="M 36 45 Q 46 45 66 45"
            stroke="#D99B26"
            strokeWidth="0.7"
            strokeOpacity="0.3"
          />
          <g opacity="0.35" stroke="#D99B26" strokeWidth="0.4" fill="none">
            <path d="M 38 45 A 2 2 0 0 1 42 45 M 42 45 A 2 2 0 0 1 46 45 M 46 45 A 2 2 0 0 1 50 45 M 50 45 A 2 2 0 0 1 54 45 M 54 45 A 2 2 0 0 1 58 45 M 58 45 A 2 2 0 0 1 62 45" />
          </g>

          {/* Highway Artery Lines linking regions */}
          {/* Carr. Fed 120 Sierra Gorda */}
          <path
            d="M 50 46 Q 62 30 72 24 T 82 15"
            fill="none"
            stroke="#8C3B2B"
            strokeWidth="0.5"
            strokeDasharray="1,1"
            opacity="0.6"
          />
          {/* Carr. Amealco Sur */}
          <path
            d="M 50 48 Q 62 68 78 88"
            fill="none"
            stroke="#8C3B2B"
            strokeWidth="0.5"
            strokeDasharray="1,1"
            opacity="0.6"
          />
          {/* El Pueblito */}
          <path
            d="M 48 48 L 28 68"
            fill="none"
            stroke="#8C3B2B"
            strokeWidth="0.5"
            strokeDasharray="1,1"
            opacity="0.6"
          />

          {/* Region Text Labels */}
          <text x="50" y="38" fill="#a89f91" fontSize="2.5" fontWeight="bold" textAnchor="middle" opacity="0.7" letterSpacing="0.2">
            SANTIAGO DE QUERÉTARO
          </text>
          <text x="82" y="12" fill="#D99B26" fontSize="2.2" fontWeight="bold" textAnchor="middle" opacity="0.8">
            SIERRA GORDA (JALPAN)
          </text>
          <text x="73" y="22" fill="#D99B26" fontSize="2" fontWeight="bold" textAnchor="middle" opacity="0.8">
            PINAL DE AMOLES
          </text>
          <text x="80" y="93" fill="#8C3B2B" fontSize="2.2" fontWeight="bold" textAnchor="middle" opacity="0.8">
            AMEALCO DE BONFIL
          </text>
          <text x="24" y="73" fill="#a89f91" fontSize="2" fontWeight="bold" textAnchor="middle" opacity="0.7">
            EL PUEBLITO
          </text>
        </svg>

        {/* HTML Interactive Pin Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {displayedVenues.map((venue, idx) => {
            const isSelected = selectedVenueId === venue.id;
            const isHovered = hoveredVenue?.id === venue.id;
            const venuePlays = plays.filter(p => p.venueId === venue.id);

            return (
              <div
                key={venue.id}
                style={{
                  left: `${venue.mapCoords.x}%`,
                  top: `${venue.mapCoords.y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                onMouseEnter={() => setHoveredVenue(venue)}
                onMouseLeave={() => setHoveredVenue(null)}
              >
                <button
                  onClick={() => onSelectVenue(venue)}
                  aria-label={`Sede ${venue.name}`}
                  className={`group relative flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'scale-125 z-30'
                      : isHovered
                      ? 'scale-110 z-20'
                      : 'hover:scale-110 z-10'
                  }`}
                >
                  {/* Pin Body */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border transition-colors ${
                      isSelected
                        ? 'bg-[#E6B040] text-[#1F1D1B] border-white ring-4 ring-[#D99B26]/40'
                        : venue.zone === 'Municipios'
                        ? 'bg-[#8C3B2B] text-white border-amber-200/50'
                        : 'bg-[#D99B26] text-[#1F1D1B] border-stone-800'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Pulsing indicator if selected */}
                  {isSelected && (
                    <span className="absolute -inset-1 rounded-full bg-[#E6B040]/40 animate-ping -z-10" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* InfoWindow / Floating Card Preview */}
        {(hoveredVenue || selectedVenue) && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-[#1F1D1B]/95 backdrop-blur-md text-white border border-[#D99B26]/60 rounded-xl p-3.5 shadow-2xl z-30 animate-fade-in text-left">
            {(() => {
              const active = hoveredVenue || selectedVenue!;
              const activePlays = plays.filter(p => p.venueId === active.id);
              return (
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#D99B26] uppercase tracking-wider mb-1">
                    <span>{active.municipality}</span>
                    <span>{active.type}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white leading-tight">
                    {active.name}
                  </h4>
                  <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                    {active.address}
                  </p>

                  <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-stone-800 text-stone-400">
                    <span>{activePlays.length} {activePlays.length === 1 ? 'obra' : 'obras'}</span>
                    <a
                      href={active.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#E6B040] hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Abrir GPS</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Map Footer Helper */}
      <div className="bg-[#141211] px-4 py-2 text-[11px] text-stone-400 border-t border-[#2D2A26] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]" /> Centro
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C3B2B]" /> Municipios
          </span>
        </div>
        <span>Toca cualquier pin para ver cartelera</span>
      </div>
    </div>
  );
};
