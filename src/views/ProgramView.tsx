import React, { useState, useMemo } from 'react';
import { PLAYS, VENUES, FESTIVAL_DAYS, Play, OFFICIAL_LINKS } from '../data/mntData';
import { PlayCard } from '../components/PlayCard';
import { FilterBar } from '../components/FilterBar';
import { Calendar, Clock, MapPin, SearchX, Sparkles, AlertCircle, Download, ExternalLink } from 'lucide-react';

interface ProgramViewProps {
  onSelectPlay: (play: Play) => void;
  isSavedPlay: (playId: string) => boolean;
  onToggleSavePlay: (play: Play, e: React.MouseEvent) => void;
  initialDay?: number | null;
  initialVenueId?: string;
}

export const ProgramView: React.FC<ProgramViewProps> = ({
  onSelectPlay,
  isSavedPlay,
  onToggleSavePlay,
  initialDay = null,
  initialVenueId = 'all'
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDay);
  const [selectedVenueId, setSelectedVenueId] = useState<string>(initialVenueId);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const hasActiveFilters = Boolean(
    selectedDay !== null ||
    selectedVenueId !== 'all' ||
    selectedAgeCategory !== 'all' ||
    searchQuery.trim() !== ''
  );

  const handleClearFilters = () => {
    setSelectedDay(null);
    setSelectedVenueId('all');
    setSelectedAgeCategory('all');
    setSearchQuery('');
  };

  // Filter plays
  const filteredPlays = useMemo(() => {
    return PLAYS.filter((play) => {
      // Day filter
      if (selectedDay !== null && play.dayNumber !== selectedDay) {
        return false;
      }
      // Venue filter
      if (selectedVenueId !== 'all' && play.venueId !== selectedVenueId) {
        return false;
      }
      // Age category filter
      if (selectedAgeCategory !== 'all' && play.ageCategory !== selectedAgeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = play.title.toLowerCase().includes(query);
        const matchesCompany = play.company.toLowerCase().includes(query);
        const matchesState = play.state.toLowerCase().includes(query);
        const matchesAuthor = play.authorDirection.toLowerCase().includes(query);
        const matchesVenue = play.venue.toLowerCase().includes(query);
        const matchesCast = play.cast.toLowerCase().includes(query);

        if (!matchesTitle && !matchesCompany && !matchesState && !matchesAuthor && !matchesVenue && !matchesCast) {
          return false;
        }
      }
      return true;
    });
  }, [selectedDay, selectedVenueId, selectedAgeCategory, searchQuery]);

  // Group filtered plays chronologically by day
  const playsByDay = useMemo(() => {
    const map = new Map<number, Play[]>();
    filteredPlays.forEach((p) => {
      const current = map.get(p.dayNumber) || [];
      current.push(p);
      map.set(p.dayNumber, current);
    });
    // Sort plays in each day by time
    map.forEach((list) => {
      list.sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, [filteredPlays]);

  // Sorted unique days present in results
  const presentDays = Array.from(playsByDay.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-6 sm:space-y-8 text-left">
      {/* Header de Página */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-bold text-[#D99B26] uppercase tracking-wider mb-1">
            Programación Oficial 46 MNT
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1F1D1B] tracking-tight">
            Programa General y Cartelera
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Explora las 30 puestas en escena seleccionadas de 27 estados. Entrada 100% gratuita para todo el público.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
          <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            {filteredPlays.length} de {PLAYS.length} funciones encontradas
          </div>

          <a
            href={OFFICIAL_LINKS.carteleraOficial}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#8C3B2B] hover:bg-[#A34533] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Abrir Cartelera Oficial en línea (bit.ly/46MNTCartelera)"
          >
            <span>Cartelera Oficial (bit.ly)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={OFFICIAL_LINKS.programaPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Descargar Programa Oficial en PDF (Secretaría de Cultura de Querétaro)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Programa en PDF</span>
          </a>
        </div>
      </div>

      {/* FilterBar Container (Relative on mobile so it never obscures the plays list) */}
      <div className="relative z-10">
        <FilterBar
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          selectedVenueId={selectedVenueId}
          onSelectVenueId={setSelectedVenueId}
          selectedAgeCategory={selectedAgeCategory}
          onSelectAgeCategory={setSelectedAgeCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          totalResultsCount={filteredPlays.length}
        />
      </div>

      {/* Empty State */}
      {filteredPlays.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#D99B26] mx-auto flex items-center justify-center">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#1F1D1B]">
            No se encontraron funciones con los filtros aplicados
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Intenta ampliar tu búsqueda o quitar algunos de los filtros seleccionados (día, sede o clasificación de edad).
          </p>
          <div>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-[#D99B26] text-[#1F1D1B] font-bold text-xs rounded-xl hover:bg-[#E6B040] transition-colors"
            >
              Restablecer todos los filtros
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Modo A: Grid de Tarjetas agrupado por Día */
        <div className="space-y-12">
          {presentDays.map((dayNum) => {
            const dayPlays = playsByDay.get(dayNum) || [];
            const dayMeta = FESTIVAL_DAYS.find(d => d.day === dayNum);

            return (
              <section key={dayNum} className="space-y-5">
                {/* Separador Visual de Día */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#1F1D1B] text-white font-display font-bold text-sm tracking-wide shadow-sm">
                    {dayMeta?.fullLabel || `Día ${dayNum} de Noviembre`}
                  </div>
                  <div className="h-px bg-stone-300 flex-1" />
                  <span className="text-xs text-stone-500 font-semibold">
                    {dayPlays.length} {dayPlays.length === 1 ? 'función' : 'funciones'}
                  </span>
                </div>

                {/* Grid Responsivo de Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayPlays.map((play) => (
                    <PlayCard
                      key={play.id}
                      play={play}
                      onSelect={onSelectPlay}
                      isSaved={isSavedPlay(play.id)}
                      onToggleSave={onToggleSavePlay}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Modo B: Vista Calendario / Timeline interactiva */
        <div className="space-y-8">
          {presentDays.map((dayNum) => {
            const dayPlays = playsByDay.get(dayNum) || [];
            const dayMeta = FESTIVAL_DAYS.find(d => d.day === dayNum);

            return (
              <div key={dayNum} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                {/* Header del día en timeline */}
                <div className="bg-[#1F1D1B] text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="font-display font-bold text-base">
                    {dayMeta?.fullLabel}
                  </div>
                  <span className="text-xs text-stone-300 font-medium">
                    {dayPlays.length} funciones programadas
                  </span>
                </div>

                {/* Listado cronológico de horarios */}
                <div className="divide-y divide-stone-100">
                  {dayPlays.map((play) => (
                    <div
                      key={play.id}
                      onClick={() => onSelectPlay(play)}
                      className="p-4 sm:p-5 hover:bg-stone-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      {/* Horario & Duración */}
                      <div className="sm:w-36 shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5">
                        <span className="font-display font-extrabold text-xl text-[#D99B26] tracking-tight">
                          {play.timeDisplay}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {play.durationMinutes} minutos
                        </span>
                      </div>

                      {/* Info de la Obra */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-[#8C3B2B] bg-[#8C3B2B]/10 px-2 py-0.5 rounded uppercase">
                            {play.state}
                          </span>
                          <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            {play.ageRecommendation}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-[#1F1D1B] group-hover:text-[#D99B26] transition-colors">
                          {play.title}
                        </h3>
                        <p className="text-xs text-stone-500 italic">
                          {play.company}
                        </p>
                      </div>

                      {/* Sede y Botón */}
                      <div className="sm:text-right shrink-0">
                        <div className="flex sm:justify-end items-center gap-1.5 text-xs text-stone-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                          <span className="line-clamp-1">{play.venue}</span>
                        </div>
                        <span className="inline-block mt-1 text-[11px] font-bold text-[#D99B26] group-hover:underline">
                          Ver ficha completa →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
