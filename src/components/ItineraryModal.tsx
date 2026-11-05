import React, { useState, useMemo } from 'react';
import { Play, AcademicActivity, FESTIVAL_DAYS } from '../data/mntData';
import { downloadIcsFile, downloadActivityIcsFile } from '../utils/calendarUtils';
import { 
  Bookmark, Trash2, Calendar, Clock, MapPin, Download, 
  AlertTriangle, ArrowRight, X, Theater, Users, Filter,
  ChevronRight, CalendarDays, Sparkles
} from 'lucide-react';

export interface UnifiedItineraryItem {
  id: string;
  type: 'play' | 'academic';
  title: string;
  subtitle?: string;
  companyOrHost: string;
  badgeLabel: string;
  dayNumber: number;
  dayLabel: string;
  time: string;
  timeDisplay: string;
  durationMinutes: number;
  venue: string;
  playData?: Play;
  activityData?: AcademicActivity;
}

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlays: Play[];
  savedActivities: AcademicActivity[];
  onRemovePlay: (playId: string) => void;
  onRemoveActivity: (activityId: string) => void;
  onClearAll: () => void;
  onSelectPlay: (play: Play) => void;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  isOpen,
  onClose,
  savedPlays,
  savedActivities,
  onRemovePlay,
  onRemoveActivity,
  onClearAll,
  onSelectPlay
}) => {
  const [filterType, setFilterType] = useState<'all' | 'play' | 'academic'>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // null = Todos los días

  if (!isOpen) return null;

  // Unify plays and academic activities into a single chronological array
  const unifiedItems: UnifiedItineraryItem[] = useMemo(() => {
    const list: UnifiedItineraryItem[] = [
      ...savedPlays.map((p): UnifiedItineraryItem => ({
        id: p.id,
        type: 'play',
        title: p.title,
        subtitle: p.subtitle,
        companyOrHost: `${p.company} (${p.state})`,
        badgeLabel: `Obra · ${p.state}`,
        dayNumber: p.dayNumber,
        dayLabel: p.dayLabel,
        time: p.time,
        timeDisplay: p.timeDisplay,
        durationMinutes: p.durationMinutes,
        venue: p.venue,
        playData: p
      })),
      ...savedActivities.map((a): UnifiedItineraryItem => ({
        id: a.id,
        type: 'academic',
        title: a.title,
        subtitle: a.subtitle,
        companyOrHost: a.facilitators,
        badgeLabel: `Académica · ${a.category}`,
        dayNumber: a.dayNumber,
        dayLabel: a.dayLabel,
        time: a.time,
        timeDisplay: a.timeDisplay,
        durationMinutes: a.durationMinutes,
        venue: a.venue,
        activityData: a
      }))
    ];

    // Sort strictly by dayNumber and then time
    list.sort((a, b) => {
      if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
      return a.time.localeCompare(b.time);
    });

    return list;
  }, [savedPlays, savedActivities]);

  // Extract distinct days present in user's saved items with counts
  const availableDays = useMemo(() => {
    const map = new Map<number, number>();
    unifiedItems.forEach(item => {
      map.set(item.dayNumber, (map.get(item.dayNumber) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([dayNumber, count]) => {
        const meta = FESTIVAL_DAYS.find(d => d.day === dayNumber);
        return {
          dayNumber,
          count,
          label: meta ? meta.label : `Día ${dayNumber}`,
          fullLabel: meta ? meta.fullLabel : `${dayNumber} Nov`
        };
      })
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }, [unifiedItems]);

  // Apply filters (Day + Type)
  const filteredItems = useMemo(() => {
    return unifiedItems.filter(item => {
      if (selectedDay !== null && item.dayNumber !== selectedDay) {
        return false;
      }
      if (filterType === 'play' && item.type !== 'play') {
        return false;
      }
      if (filterType === 'academic' && item.type !== 'academic') {
        return false;
      }
      return true;
    });
  }, [unifiedItems, selectedDay, filterType]);

  // Group filtered items by day for organized visual presentation
  const groupedByDay = useMemo(() => {
    const map = new Map<number, UnifiedItineraryItem[]>();
    filteredItems.forEach(item => {
      const list = map.get(item.dayNumber) || [];
      list.push(item);
      map.set(item.dayNumber, list);
    });
    return map;
  }, [filteredItems]);

  const displayedDayNumbers = Array.from(groupedByDay.keys()).sort((a, b) => a - b);

  // Conflict Detection: items on same day with overlapping time
  const conflicts = useMemo(() => {
    return unifiedItems.filter((item, idx) => {
      if (idx === 0) return false;
      const prev = unifiedItems[idx - 1];
      return prev.dayNumber === item.dayNumber && prev.time === item.time;
    });
  }, [unifiedItems]);

  const handleExportAll = () => {
    savedPlays.forEach(p => downloadIcsFile(p));
    savedActivities.forEach(a => downloadActivityIcsFile(a));
  };

  const selectedDayMeta = selectedDay !== null ? FESTIVAL_DAYS.find(d => d.day === selectedDay) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[100vh] sm:max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="bg-[#1F1D1B] text-white p-5 border-b border-[#34302C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D99B26] text-[#1F1D1B] shadow">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Mi Itinerario 46 MNT
              </h2>
              <p className="text-xs text-stone-400">
                {unifiedItems.length} {unifiedItems.length === 1 ? 'evento guardado' : 'eventos guardados'} ({savedPlays.length} obras · {savedActivities.length} académicas)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors"
            aria-label="Cerrar itinerario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Day Filter Bar (Only when there are items) */}
        {unifiedItems.length > 0 && (
          <div className="bg-[#262320] text-white p-3 border-b border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-300">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#D99B26]" />
                <span className="uppercase tracking-wider">Filtrar por Día:</span>
              </div>
              {selectedDay !== null && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-[#E6B040] hover:underline text-[11px] font-semibold"
                >
                  Ver todos los días
                </button>
              )}
            </div>

            {/* Fast Day Selector Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {/* All Days Chip */}
              <button
                onClick={() => setSelectedDay(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedDay === null
                    ? 'bg-[#D99B26] text-[#1F1D1B] shadow-md scale-102'
                    : 'bg-[#34302C] hover:bg-[#433E39] text-stone-300'
                }`}
              >
                <span>Todos</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  selectedDay === null ? 'bg-[#1F1D1B] text-[#D99B26]' : 'bg-black/40 text-stone-300'
                }`}>
                  {unifiedItems.length}
                </span>
              </button>

              {/* Day Chips for each day with events */}
              {availableDays.map(d => {
                const isSelected = selectedDay === d.dayNumber;
                return (
                  <button
                    key={d.dayNumber}
                    onClick={() => setSelectedDay(d.dayNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#D99B26] text-[#1F1D1B] shadow-md scale-102 ring-2 ring-white/20'
                        : 'bg-[#34302C] hover:bg-[#433E39] text-stone-300'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-[#1F1D1B] text-[#D99B26]' : 'bg-black/40 text-stone-400'
                    }`}>
                      {d.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Secondary Type Filter Strip */}
        {unifiedItems.length > 0 && (
          <div className="bg-stone-100 px-5 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-stone-500 font-semibold mr-1">Tipo:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-[#1F1D1B] font-bold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setFilterType('play')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterType === 'play'
                    ? 'bg-white text-[#1F1D1B] font-bold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Obras ({savedPlays.length})
              </button>
              <button
                onClick={() => setFilterType('academic')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterType === 'academic'
                    ? 'bg-white text-[#1F1D1B] font-bold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Académicas ({savedActivities.length})
              </button>
            </div>

            {selectedDay !== null && (
              <span className="text-[11px] font-bold text-[#8C3B2B] bg-[#8C3B2B]/10 px-2 py-0.5 rounded">
                Día: {selectedDayMeta?.fullLabel}
              </span>
            )}
          </div>
        )}

        {/* Content List */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {conflicts.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> Tienes eventos guardados que coinciden a la misma hora en el festival. Te sugerimos revisar las sedes y tiempos de traslado.
              </span>
            </div>
          )}

          {unifiedItems.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-stone-700">
                Tu itinerario está vacío
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explora la Cartelera de Obras o las Actividades Académicas y haz clic en el icono de marcador para armar tu ruta personalizada del festival.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <p className="text-sm font-semibold text-stone-600">
                No hay eventos para los filtros seleccionados
              </p>
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setFilterType('all');
                }}
                className="px-4 py-2 bg-[#D99B26] text-[#1F1D1B] text-xs font-bold rounded-lg hover:bg-[#E6B040] transition-colors"
              >
                Restablecer filtros del itinerario
              </button>
            </div>
          ) : (
            /* Grouped Daily Chronological View */
            <div className="space-y-6">
              {displayedDayNumbers.map(dayNum => {
                const dayItems = groupedByDay.get(dayNum) || [];
                const dayMeta = FESTIVAL_DAYS.find(d => d.day === dayNum);

                return (
                  <div key={dayNum} className="space-y-3">
                    {/* Day Group Header */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-[#1F1D1B] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-[#D99B26]" />
                        <span>{dayMeta ? dayMeta.fullLabel : `${dayNum} Nov`}</span>
                      </div>
                      <div className="h-px bg-stone-200 flex-1" />
                      <span className="text-[11px] font-semibold text-stone-500">
                        {dayItems.length} {dayItems.length === 1 ? 'evento' : 'eventos'}
                      </span>
                    </div>

                    {/* Items for this day */}
                    <div className="space-y-2.5">
                      {dayItems.map(item => {
                        const isPlay = item.type === 'play';
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                              isPlay
                                ? 'bg-stone-50 border-stone-200 hover:border-[#D99B26]'
                                : 'bg-amber-50/40 border-amber-200/80 hover:border-[#D99B26]'
                            }`}
                          >
                            <div
                              onClick={() => {
                                if (isPlay && item.playData) {
                                  onSelectPlay(item.playData);
                                  onClose();
                                }
                              }}
                              className={`flex-1 ${isPlay ? 'cursor-pointer' : ''}`}
                            >
                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold mb-1">
                                <span className="bg-[#D99B26] text-[#1F1D1B] px-2 py-0.5 rounded text-[10px]">
                                  {item.timeDisplay}
                                </span>
                                <span className={`px-2 py-0.2 rounded text-[10px] ${
                                  isPlay ? 'bg-stone-200 text-stone-700' : 'bg-[#8C3B2B]/15 text-[#8C3B2B]'
                                }`}>
                                  {item.badgeLabel}
                                </span>
                                <span className="text-stone-400">·</span>
                                <span className="text-stone-500 font-medium">{item.durationMinutes} min</span>
                              </div>

                              <h4 className="font-display font-bold text-sm sm:text-base text-[#1F1D1B] group-hover:text-[#D99B26] transition-colors leading-snug">
                                {item.title}
                              </h4>

                              {item.subtitle && (
                                <p className="text-xs text-stone-500 italic mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}

                              <p className="text-xs text-stone-600 mt-1 font-medium">
                                {item.companyOrHost}
                              </p>

                              <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-2">
                                <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                                <span className="line-clamp-1">{item.venue}</span>
                              </div>

                              {isPlay && (
                                <span className="inline-block mt-2 text-[11px] font-semibold text-[#D99B26] group-hover:underline">
                                  Ver ficha artística y técnica →
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  if (isPlay) {
                                    onRemovePlay(item.id);
                                  } else {
                                    onRemoveActivity(item.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-200/60 rounded-lg transition-colors"
                                title="Eliminar de mi itinerario"
                                aria-label="Quitar de mi itinerario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (isPlay && item.playData) {
                                    downloadIcsFile(item.playData);
                                  } else if (item.activityData) {
                                    downloadActivityIcsFile(item.activityData);
                                  }
                                }}
                                className="p-1.5 text-stone-500 hover:text-[#D99B26] hover:bg-stone-200/60 rounded-lg transition-colors"
                                title="Descargar recordatorio de calendario (.ics)"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {unifiedItems.length > 0 && (
          <div className="bg-stone-100 p-4 border-t border-stone-200 flex items-center justify-between gap-3 text-xs">
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-red-600 font-semibold transition-colors"
            >
              Vaciar mi itinerario
            </button>

            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] font-bold rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Todos (.ics)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
