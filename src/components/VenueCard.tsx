import React, { useState } from 'react';
import { Venue, Play } from '../data/mntData';
import { MapPin, Users, Accessibility, ExternalLink, ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  plays: Play[];
  isSelected?: boolean;
  onSelectPlay?: (play: Play) => void;
  onFocusVenue?: (venue: Venue) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  plays,
  isSelected = false,
  onSelectPlay,
  onFocusVenue
}) => {
  const [accordionOpen, setAccordionOpen] = useState(isSelected);

  return (
    <div
      id={`venue-${venue.id}`}
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden text-left ${
        isSelected
          ? 'border-[#D99B26] ring-2 ring-[#D99B26]/30 shadow-md'
          : 'border-stone-200/90 shadow-sm hover:border-stone-300 hover:shadow'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header Slot */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {venue.type}
              </span>
              <span className="text-[10px] font-semibold text-[#8C3B2B] bg-[#8C3B2B]/10 px-2 py-0.5 rounded">
                {venue.municipality}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1F1D1B] leading-tight">
              {venue.name}
            </h3>
            {venue.subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">{venue.subtitle}</p>
            )}
          </div>

          {/* Quick Focus Button if map is active */}
          {onFocusVenue && (
            <button
              onClick={() => onFocusVenue(venue)}
              className="p-2 text-stone-400 hover:text-[#D99B26] hover:bg-stone-50 rounded-lg transition-colors shrink-0"
              title="Centrar en el mapa"
              aria-label="Ver en el mapa interactivo"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dirección Slot */}
        <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
          {venue.address}
        </p>

        {/* Capacidad y Accesibilidad Slot */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>Aforo: ~{venue.approxCapacity} pers.</span>
          </div>

          <div className="flex items-center gap-1">
            <Accessibility className={`w-3.5 h-3.5 ${venue.wheelchairAccess ? 'text-[#2E7D32]' : 'text-stone-400'}`} />
            <span>{venue.wheelchairAccess ? 'Acceso en silla de ruedas' : 'Acceso con escalones'}</span>
          </div>
        </div>

        {/* Botón de Acción Directa: Abrir en Google Maps */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100">
          <a
            href={venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C3B2B] hover:text-[#5e261b] transition-colors"
          >
            <span>Cómo llegar (Google Maps)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Trigger Accordion Programación Vinculada */}
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#1F1D1B] transition-colors"
          >
            <span>{plays.length} {plays.length === 1 ? 'función' : 'funciones'}</span>
            {accordionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Slot de Programación Vinculada (Accordion) */}
      {accordionOpen && (
        <div className="bg-stone-50 border-t border-stone-100 p-3 sm:p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
            Programación en esta sede:
          </p>
          {plays.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No hay funciones programadas en este filtro.</p>
          ) : (
            plays.map((play) => (
              <div
                key={play.id}
                onClick={() => onSelectPlay && onSelectPlay(play)}
                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200/80 hover:border-[#D99B26] cursor-pointer transition-all"
              >
                <div className="pr-2">
                  <div className="font-bold text-xs text-[#1F1D1B] hover:text-[#D99B26] line-clamp-1">
                    {play.title}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {play.company} ({play.state})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#D99B26]">
                    {play.dayLabel.split(' ')[0]} {play.dayNumber}
                  </div>
                  <div className="text-[11px] font-medium text-stone-600">
                    {play.timeDisplay}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
