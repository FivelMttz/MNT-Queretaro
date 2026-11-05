import React, { useState } from 'react';
import { FESTIVAL_DAYS, VENUES } from '../data/mntData';
import { Search, X, Filter, LayoutGrid, CalendarRange, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  selectedDay: number | null; // null means 'Todos'
  onSelectDay: (day: number | null) => void;
  selectedVenueId: string;
  onSelectVenueId: (id: string) => void;
  selectedAgeCategory: string; // 'all' | 'infantiles' | 'jovenes' | 'adolescentes' | 'adultos'
  onSelectAgeCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewMode: 'grid' | 'timeline';
  onToggleViewMode: (mode: 'grid' | 'timeline') => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDay,
  onSelectDay,
  selectedVenueId,
  onSelectVenueId,
  selectedAgeCategory,
  onSelectAgeCategory,
  searchQuery,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  onToggleViewMode,
  totalResultsCount
}) => {
  const [showAdvancedMobile, setShowAdvancedMobile] = useState<boolean>(false);

  const ageCategories = [
    { id: 'all', label: 'Todas las edades' },
    { id: 'infantiles', label: 'Infantiles (0-5)' },
    { id: 'jovenes', label: 'Jóvenes (6-12)' },
    { id: 'adolescentes', label: 'Adolescentes (13-17)' },
    { id: 'adultos', label: 'Adultos (18+)' }
  ];

  // Group venues by zone
  const venuesByZone = {
    'Querétaro Centro': VENUES.filter(v => v.zone === 'Querétaro Centro'),
    'Municipios (Amealco/Jalpan/Pinal)': VENUES.filter(v => v.zone === 'Municipios'),
    'Espacios de Calle': VENUES.filter(v => v.zone === 'Espacios de Calle')
  };

  const activeAdvancedCount = (selectedVenueId !== 'all' ? 1 : 0) + (selectedAgeCategory !== 'all' ? 1 : 0);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
      {/* Top Row: Search Input + Mode Toggles + Mobile Filter Expand */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar obra, compañía, creador o estado..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 hover:bg-white focus:bg-white text-xs sm:text-sm text-[#1F1D1B] placeholder-stone-400 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D99B26] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              aria-label="Borrar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowAdvancedMobile(!showAdvancedMobile)}
            className={`sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeAdvancedCount > 0 || showAdvancedMobile
                ? 'bg-[#D99B26]/15 border-[#D99B26] text-[#8C3B2B]'
                : 'bg-stone-100 border-stone-200 text-stone-600'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeAdvancedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#8C3B2B] text-white text-[10px] font-bold flex items-center justify-center">
                {activeAdvancedCount}
              </span>
            )}
            {showAdvancedMobile ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* View Mode Toggle: Grid vs Timeline */}
          <div className="inline-flex bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1F1D1B] shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tarjetas</span>
            </button>
            <button
              onClick={() => onToggleViewMode('timeline')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#1F1D1B] shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Horarios</span>
            </button>
          </div>

          {/* Clear Filters Button (Conditional) */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#8C3B2B] hover:bg-[#8C3B2B]/10 rounded-lg border border-[#8C3B2B]/30 transition-colors shrink-0 cursor-pointer"
              title="Restablecer todos los filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Control 01: Timeline Slider / Day Chips (Always visible & horizontal scrollable) */}
      <div className="pt-0.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5 font-medium">
          <span className="font-semibold text-stone-700">Días del Festival (5 al 14 NOV):</span>
          <span>{totalResultsCount} {totalResultsCount === 1 ? 'función' : 'funciones'}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          <button
            onClick={() => onSelectDay(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedDay === null
                ? 'bg-[#D99B26] text-[#1F1D1B] shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Todos los días
          </button>

          {FESTIVAL_DAYS.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => onSelectDay(d.day)}
                className={`flex flex-col items-center justify-center min-w-[54px] sm:min-w-[58px] py-1 px-2 rounded-lg text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D99B26] text-[#1F1D1B] font-extrabold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider opacity-80">{d.label.split(' ')[0].slice(0, 3)}</span>
                <span className="text-xs font-extrabold leading-none my-0.5">{d.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 02 & 03: Sede Dropdown + Age Classification Chips */}
      {/* En móvil se expande sólo si se pulsa "Filtros" o si hay filtros activos; en desktop siempre visible */}
      <div className={`${showAdvancedMobile || activeAdvancedCount > 0 ? 'block' : 'hidden'} sm:grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-100`}>
        {/* Selector Desplegable por Sede (Grouped) */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Filtrar por Sede Escénica:
          </label>
          <select
            value={selectedVenueId}
            onChange={(e) => onSelectVenueId(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-stone-50 hover:bg-white text-xs text-[#1F1D1B] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D99B26] focus:border-transparent transition-colors font-medium cursor-pointer"
          >
            <option value="all">Todas las 21 sedes</option>
            {Object.entries(venuesByZone).map(([zoneName, venuesList]) => (
              <optgroup key={zoneName} label={`📍 ${zoneName}`}>
                {venuesList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.municipality})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Selector por Clasificación de Edad */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Clasificación de Edad:
          </label>
          <div className="flex flex-wrap items-center gap-1">
            {ageCategories.map((cat) => {
              const isSelected = selectedAgeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectAgeCategory(cat.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#8C3B2B] text-white font-bold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
