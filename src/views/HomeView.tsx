import React, { useState, useMemo } from 'react';
import { PLAYS, VENUES, FESTIVAL_DAYS, ACADEMIC_ACTIVITIES, Play, Venue, AcademicActivity, OFFICIAL_LINKS } from '../data/mntData';
import { PlayCard } from '../components/PlayCard';
import { getActivityDayNumbers } from '../utils/academicDates';
import { 
  Calendar, MapPin, ArrowRight, Compass, 
  Theater, Users, Clock, ChevronRight,
  Download, FileText, Navigation, Bookmark, Check, Info, Sparkles, ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  onSelectPlay: (play: Play) => void;
  onNavigateTab: (tab: string, filterOptions?: { day?: number | null; venueId?: string }) => void;
  isSavedPlay: (playId: string) => boolean;
  onToggleSavePlay: (play: Play, e: React.MouseEvent) => void;
  onOpenItinerary?: () => void;
  savedCount?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectPlay,
  onNavigateTab,
  isSavedPlay,
  onToggleSavePlay,
  onOpenItinerary,
  savedCount = 0
}) => {
  // Active day in "Hoy en la Muestra" selector (default Day 5: Opening)
  const [selectedHomeDay, setSelectedHomeDay] = useState<number>(5);
  // Time filter for mobile assistant: 'all' | 'afternoon' (16h-18h) | 'night' (19h-21h)
  const [timeFilter, setTimeFilter] = useState<'all' | 'afternoon' | 'night'>('all');

  // Plays for the selected day
  const baseDayPlays = PLAYS.filter(p => p.dayNumber === selectedHomeDay);

  const filteredDayPlays = baseDayPlays.filter(play => {
    if (timeFilter === 'all') return true;
    const hour = parseInt(play.time.split(':')[0], 10);
    if (timeFilter === 'afternoon') return hour < 19;
    if (timeFilter === 'night') return hour >= 19;
    return true;
  });

  const selectedDayMeta = FESTIVAL_DAYS.find(d => d.day === selectedHomeDay);

  // Actividades académicas que se imparten cada día.
  // Una actividad con varios días (ej. "Lunes 9 al Viernes 13") aparece en todos ellos.
  const academicByDay = useMemo(() => {
    const map = new Map<number, AcademicActivity[]>();
    ACADEMIC_ACTIVITIES.forEach((activity) => {
      getActivityDayNumbers(activity).forEach((day) => {
        const list = map.get(day) || [];
        list.push(activity);
        map.set(day, list);
      });
    });
    // Orden cronológico dentro de cada día
    map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, []);

  // Conteo por día (obras + actividades) para el rail de fechas
  const dayCounts = useMemo(() => {
    const counts = new Map<number, { plays: number; activities: number }>();
    FESTIVAL_DAYS.forEach((d) => {
      counts.set(d.day, {
        plays: PLAYS.filter((p) => p.dayNumber === d.day).length,
        activities: academicByDay.get(d.day)?.length ?? 0,
      });
    });
    return counts;
  }, [academicByDay]);

  const dayActivities = academicByDay.get(selectedHomeDay) ?? [];

  // Active venues for the selected day
  const activeDayVenues = Array.from(
    new Set(baseDayPlays.map(p => p.venueId))
  ).map(id => VENUES.find(v => v.id === id)).filter(Boolean) as Venue[];

  const featuredVenues = VENUES.filter(v => [
    'teatro-de-la-ciudad',
    'museo-de-la-ciudad',
    'plaza-de-armas',
    'teatro-metropolitano',
    'foro-ceart'
  ].includes(v.id));

  return (
    <div className="space-y-8 sm:space-y-16 text-left">
      {/* ============================================================== */}
      {/* 1. MÓVIL: Panel de Control & Guía del Asistente (lg:hidden)     */}
      {/* ============================================================== */}
      <section className="block lg:hidden space-y-4">
        {/* Tarjeta de Bienvenida y Estado del Asistente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F1D1B] via-[#262320] to-[#141211] text-white p-5 shadow-lg border border-[#34302C]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#E6B040] uppercase tracking-wider mb-2">
            <span>Querétaro 2026</span>
            <span className="bg-[#D99B26]/20 text-[#D99B26] px-2 py-0.5 rounded border border-[#D99B26]/30">
              5 al 14 NOV
            </span>
          </div>

          <h1 className="font-display font-black text-2xl text-white tracking-tight leading-tight">
            46 Muestra Nacional <span className="text-[#D99B26]">de Teatro</span>
          </h1>

          <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
            Tu herramienta de bolsillo: 30 obras de 27 estados, 21 sedes y entrada 100% gratuita.
          </p>

          {/* Botones Destacados: Descargar PDF Oficial & Sedes GPS */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2.5">
            <a
              href={OFFICIAL_LINKS.programaPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] font-extrabold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Programa Oficial en PDF</span>
            </a>

            <button
              onClick={() => onNavigateTab('sedes')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#D99B26]" />
              <span>Sedes GPS</span>
            </button>
          </div>
        </div>

        {/* Accesos Rápidos con Tarjeta Especial de Mi Itinerario */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Accesos Rápidos</span>
            <span className="text-[#8C3B2B] font-semibold text-[10px]">Herramientas del Asistente</span>
          </div>

          {/* Tarjeta Especial de Mi Itinerario */}
          <div
            onClick={onOpenItinerary}
            className="group p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-2 border-[#D99B26] shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#D99B26] text-[#1F1D1B] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-sm text-[#1F1D1B]">
                      Mi Itinerario Personal
                    </span>
                    {savedCount > 0 ? (
                      <span className="px-2 py-0.5 bg-[#8C3B2B] text-white font-black text-[10px] rounded-full shadow-xs">
                        {savedCount} {savedCount === 1 ? 'evento' : 'eventos'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#D99B26]/25 text-[#8C3B2B] font-bold text-[10px] rounded-full">
                        Tu ruta
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 truncate mt-0.5">
                    {savedCount > 0 
                      ? 'Revisa tus obras y horarios seleccionados' 
                      : 'Guarda obras, evita empalmes y sincroniza con tu calendario'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center text-xs font-bold text-[#8C3B2B] group-hover:translate-x-0.5 transition-transform">
                <span className="text-[11px] font-bold mr-0.5">Abrir</span>
                <ChevronRight className="w-4 h-4 text-[#D99B26]" />
              </div>
            </div>
          </div>

          {/* 4 Acciones Rápidas (Grid 2x2) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Botón 1: Cartelera */}
            <button
              onClick={() => onNavigateTab('programa')}
              className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-[#D99B26] active:bg-amber-50/50 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D99B26]/15 text-[#D99B26] flex items-center justify-center shrink-0">
                <Theater className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[#1F1D1B] truncate">Cartelera</div>
                <div className="text-[10px] text-stone-500 truncate">30 obras & filtros</div>
              </div>
            </button>

            {/* Botón 2: Sedes y Mapa GPS */}
            <button
              onClick={() => onNavigateTab('sedes')}
              className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-[#D99B26] active:bg-amber-50/50 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8C3B2B]/15 text-[#8C3B2B] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[#1F1D1B] truncate">Sedes & Mapa</div>
                <div className="text-[10px] text-stone-500 truncate">21 recintos y GPS</div>
              </div>
            </button>

            {/* Botón 3: Actividades Académicas */}
            <button
              onClick={() => onNavigateTab('actividades')}
              className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-[#D99B26] active:bg-amber-50/50 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[#1F1D1B] truncate">Académicas</div>
                <div className="text-[10px] text-stone-500 truncate">Mesas & talleres</div>
              </div>
            </button>

            {/* Botón 4: Curaduría / Manifiesto */}
            <button
              onClick={() => onNavigateTab('curaduria')}
              className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-[#D99B26] active:bg-amber-50/50 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[#1F1D1B] truncate">Curaduría</div>
                <div className="text-[10px] text-stone-500 truncate">Línea editorial</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ESCRITORIO: Hero Banner Cinematográfico (hidden lg:block)    */}
      {/* ============================================================== */}
      <section className="hidden lg:block relative w-full rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-800">
        <div className="relative min-h-[540px] flex items-end">
          {/* Hero Background Photography: Los Arcos de Querétaro */}
          <img
            src="/src/assets/images/mnt_hero_aqueduct_1793910141829.jpg"
            alt="Acueducto Los Arcos de Querétaro y 46 Muestra Nacional de Teatro"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />

          {/* Deep Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B] via-[#1F1D1B]/60 to-black/30" />

          {/* Hero Content */}
          <div className="relative z-10 p-10 lg:p-14 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D99B26]/20 border border-[#D99B26]/40 text-[#E6B040] text-xs font-bold uppercase tracking-wider">
              <span>Festival Nacional de Artes Escénicas</span>
              <span>·</span>
              <span>Noviembre 5 al 14, 2026</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              46 Muestra Nacional <br />
              <span className="text-[#D99B26]">de Teatro</span> · Querétaro 2026
            </h1>

            <p className="font-editorial italic text-2xl text-stone-200 font-light leading-relaxed max-w-2xl">
              "Sean bienvenidxs a respirar juntxs"
            </p>

            <p className="text-base text-stone-300 leading-relaxed max-w-2xl">
              El encuentro escénico más importante de México llega a Querétaro con 30 montajes de 27 estados, 21 sedes en la capital y municipios, y espacios de reflexión gremial.
            </p>

            {/* Contenedor CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateTab('programa', { day: selectedHomeDay })}
                className="flex items-center gap-2 px-6 py-3 bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Programación de Hoy</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('sedes')}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#D99B26]" />
                <span>Explorar Mapa de Sedes</span>
              </button>

              {onOpenItinerary && (
                <button
                  onClick={onOpenItinerary}
                  className="flex items-center gap-2 px-5 py-3 bg-[#D99B26]/20 hover:bg-[#D99B26]/30 text-[#E6B040] font-bold text-sm rounded-xl border border-[#D99B26]/40 backdrop-blur-md transition-all cursor-pointer"
                  title="Abrir Mi Itinerario de actividades"
                >
                  <Bookmark className="w-4 h-4 fill-current text-[#D99B26]" />
                  <span>Mi Itinerario {savedCount > 0 ? `(${savedCount})` : ''}</span>
                </button>
              )}

              <a
                href={OFFICIAL_LINKS.programaPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-[#8C3B2B] hover:bg-[#A34533] text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                title="Descargar Programa Oficial en PDF (Gobierno del Estado de Querétaro)"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Programa en PDF</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ESCRITORIO: Estadísticas Clave (hidden lg:grid)              */}
      {/* ============================================================== */}
      <section className="hidden lg:grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#D99B26]/15 text-[#D99B26] flex items-center justify-center mb-3">
            <Theater className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-[#1F1D1B] tabular-nums">30</div>
            <div className="text-sm font-semibold text-stone-600 mt-1">Puestas en Escena</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Seleccionadas de 400 postulaciones</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#8C3B2B]/15 text-[#8C3B2B] flex items-center justify-center mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-[#1F1D1B] tabular-nums">27</div>
            <div className="text-sm font-semibold text-stone-600 mt-1">Estados de la República</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Voces de todas las latitudes del país</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-[#1F1D1B] tabular-nums">21</div>
            <div className="text-sm font-semibold text-stone-600 mt-1">Sedes Escénicas</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Querétaro capital y municipios</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-[#1F1D1B] tabular-nums">10</div>
            <div className="text-sm font-semibold text-stone-600 mt-1">Días de Actividad</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Del 5 al 14 de noviembre 2026</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. MÓDULO CENTRAL: Cartelera del Día (Asistente Móvil + Web)   */}
      {/* ============================================================== */}
      <section className="space-y-4 sm:space-y-6">
        {/* Encabezado del Módulo con navegación */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D99B26] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda por Día</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-3xl text-[#1F1D1B] mt-0.5">
              {selectedDayMeta ? `${selectedDayMeta.label} de Noviembre` : `Día ${selectedHomeDay}`}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
              {baseDayPlays.length} {baseDayPlays.length === 1 ? 'función' : 'funciones'}
              {dayActivities.length > 0 && (
                <span className="text-[#8C3B2B]"> · {dayActivities.length} {dayActivities.length === 1 ? 'académica' : 'académicas'}</span>
              )}
            </span>

            <button
              onClick={() => onNavigateTab('programa', { day: selectedHomeDay })}
              className="text-xs font-bold text-[#8C3B2B] hover:text-[#5e261b] inline-flex items-center gap-0.5 py-1 px-1.5"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rail Horizontal de Días (Optimizado para Touch & Pulgar) */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            {FESTIVAL_DAYS.map((d) => {
              const isSelected = selectedHomeDay === d.day;
              const counts = dayCounts.get(d.day) ?? { plays: 0, activities: 0 };
              const total = counts.plays + counts.activities;
              return (
                <button
                  key={d.day}
                  onClick={() => {
                    setSelectedHomeDay(d.day);
                    setTimeFilter('all');
                  }}
                  className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[74px] py-2 px-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#D99B26] text-[#1F1D1B] font-extrabold shadow-md scale-102 ring-2 ring-[#D99B26]/30'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/90 shadow-2xs'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-[#1F1D1B]/80 font-bold' : 'text-stone-400 font-semibold'}`}>
                    {d.label.split(' ')[0].slice(0, 3)}
                  </span>
                  <span className="text-base sm:text-lg font-black leading-none my-0.5">
                    {d.day}
                  </span>
                  <span className={`text-[9px] font-semibold ${isSelected ? 'text-[#1F1D1B]' : 'text-stone-500'}`}>
                    {total} {total === 1 ? 'evento' : 'eventos'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro Rápido por Turno / Horario (Sólo si hay funciones) */}
        {baseDayPlays.length > 0 && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-medium hidden sm:inline">Turno:</span>
            </div>

            <div className="inline-flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === 'all' ? 'bg-white text-[#1F1D1B] shadow-xs font-bold' : 'text-stone-500'
                }`}
              >
                Todas ({baseDayPlays.length})
              </button>
              <button
                onClick={() => setTimeFilter('afternoon')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === 'afternoon' ? 'bg-white text-[#1F1D1B] shadow-xs font-bold' : 'text-stone-500'
                }`}
              >
                Tarde (16h-18h)
              </button>
              <button
                onClick={() => setTimeFilter('night')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === 'night' ? 'bg-white text-[#1F1D1B] shadow-xs font-bold' : 'text-stone-500'
                }`}
              >
                Noche (19h-21h)
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LISTADO DE FUNCIONES: VISTA MÓVIL COMPACTA (lg:hidden)        */}
        {/* ============================================================ */}
        <div className="block lg:hidden space-y-3">
          {filteredDayPlays.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center text-xs text-stone-500">
              No hay funciones programadas con el turno seleccionado.
            </div>
          ) : (
            filteredDayPlays.map((play) => {
              const saved = isSavedPlay(play.id);
              return (
                <div
                  key={play.id}
                  onClick={() => onSelectPlay(play)}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-[#D99B26] p-4 transition-all cursor-pointer relative space-y-3"
                >
                  {/* Fila 1: Hora, Duración, Clasificación y Botón Itinerario */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-sm text-[#1F1D1B] bg-amber-50 text-[#8C3B2B] px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {play.timeDisplay}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {play.durationMinutes} min
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {play.ageRecommendation}
                      </span>

                      {/* Botón rápido de guardar / quitar en Itinerario */}
                      <button
                        onClick={(e) => onToggleSavePlay(play, e)}
                        className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                          saved
                            ? 'bg-[#D99B26] text-[#1F1D1B] shadow-xs'
                            : 'bg-stone-100 text-stone-400 hover:text-stone-700 hover:bg-stone-200'
                        }`}
                        title={saved ? 'Quitar de mi itinerario' : 'Guardar en mi ruta'}
                        aria-label={`Guardar ${play.title} en mi itinerario`}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Título y Compañía */}
                  <div>
                    <h3 className="font-display font-black text-base text-[#1F1D1B] leading-snug">
                      {play.title}
                    </h3>
                    <div className="text-xs text-[#8C3B2B] font-semibold mt-0.5">
                      {play.company} <span className="text-stone-400 font-normal">({play.state})</span>
                    </div>
                  </div>

                  {/* Fila 3: Sede con GPS y botón de ver detalles */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-600 truncate flex-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                      <span className="truncate font-medium">{play.venue}</span>
                    </div>

                    <span className="shrink-0 text-[11px] font-bold text-[#D99B26] inline-flex items-center gap-0.5">
                      Ver ficha
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ============================================================ */}
        {/* ACTIVIDADES ACADÉMICAS DEL DÍA (móvil + escritorio)           */}
        {/* ============================================================ */}
        {dayActivities.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/80">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C3B2B] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Actividades Académicas del Día</span>
              </div>
              <button
                onClick={() => onNavigateTab('actividades')}
                className="text-xs font-bold text-[#8C3B2B] hover:text-[#5e261b] inline-flex items-center gap-0.5 py-1 px-1.5"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {dayActivities.map((activity) => {
                const activityDays = getActivityDayNumbers(activity);
                const isMultiDay = activityDays.length > 1;
                return (
                  <div
                    key={activity.id}
                    onClick={() => onNavigateTab('actividades')}
                    className="bg-amber-50/40 rounded-2xl border border-amber-200/80 hover:border-[#D99B26] p-4 transition-all cursor-pointer space-y-2.5"
                  >
                    {/* Fila 1: Hora + categoría */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-black text-sm text-[#8C3B2B] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.timeDisplay}
                      </span>
                      <span className="text-[10px] font-bold text-[#8C3B2B] bg-[#8C3B2B]/10 px-2 py-0.5 rounded">
                        {activity.category}
                      </span>
                      {activity.accessRequirement && (
                        <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {activity.accessRequirement}
                        </span>
                      )}
                    </div>

                    {/* Fila 2: Título y responsables */}
                    <div>
                      <h3 className="font-display font-black text-base text-[#1F1D1B] leading-snug">
                        {activity.title}
                      </h3>
                      {activity.subtitle && (
                        <p className="text-xs text-stone-500 italic mt-0.5">
                          {activity.subtitle}
                        </p>
                      )}
                      <div className="text-xs text-[#8C3B2B] font-semibold mt-1">
                        {activity.facilitators}
                      </div>
                    </div>

                    {/* Fila 3: Sede + vigencia */}
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-600 truncate flex-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                        <span className="truncate font-medium">{activity.venue}</span>
                      </div>

                      {isMultiDay && (
                        <span className="shrink-0 text-[10px] font-bold text-[#8C3B2B] bg-[#8C3B2B]/10 px-2 py-0.5 rounded">
                          Se repite · {activity.dates}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LISTADO DE FUNCIONES: VISTA ESCRITORIO GRID (hidden lg:grid)  */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          {filteredDayPlays.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-stone-500">
              No hay funciones programadas para este turno en particular.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredDayPlays.map((play) => (
                <PlayCard
                  key={play.id}
                  play={play}
                  onSelect={onSelectPlay}
                  isSaved={isSavedPlay(play.id)}
                  onToggleSave={onToggleSavePlay}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. MÓDULO PARA ASISTENTES: Sedes Activas Hoy con GPS           */}
      {/* ============================================================== */}
      {activeDayVenues.length > 0 && (
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#8C3B2B]/15 text-[#8C3B2B] flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#1F1D1B]">
                  Sedes con función para este día
                </h3>
                <p className="text-[11px] text-stone-500">
                  Ubicaciones y direcciones directas para llegar a tiempo
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('sedes')}
              className="text-xs font-bold text-[#8C3B2B] hover:text-[#5e261b] shrink-0"
            >
              Ver mapa completo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeDayVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    <span>{venue.zone}</span>
                    <span className="text-[#8C3B2B] font-semibold">{venue.municipality}</span>
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-[#1F1D1B] mt-0.5">
                    {venue.name}
                  </div>
                  <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {venue.address}
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white hover:bg-stone-100 text-[#1F1D1B] border border-stone-200 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#D99B26]" />
                  <span>Cómo llegar (Google Maps)</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 6. BANNER DE DESCARGA: Cuadernillo Completo en PDF             */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1F1D1B] via-[#2A2624] to-[#171514] text-white p-5 sm:p-10 border border-[#3E3834] shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#D99B26]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#8C3B2B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#D99B26]/20 border border-[#D99B26]/40 text-[#E6B040] text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Publicación Oficial · 45 Páginas</span>
            </div>

            <h2 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight">
              Descarga el Programa de Mano Oficial en PDF
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Lleva contigo el cuadernillo editorial con la programación completa de las 30 obras, fichas técnicas, créditos de directores y elencos, mapa de las 21 sedes y el calendario de actividades académicas de la 46 MNT Querétaro 2026.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] sm:text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D99B26]" />
                <span>30 Obras</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8C3B2B]" />
                <span>21 Sedes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                <span>Cartografía</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E6B040]" />
                <span>Encuentro Académico</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <a
              href={OFFICIAL_LINKS.programaPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Descargar PDF Oficial</span>
            </a>
            <span className="text-[10px] sm:text-[11px] text-stone-400 text-center">
              Archivo oficial · 45 páginas · Acceso libre
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. TIPS DEL ASISTENTE: Acceso, Cupo y Recomendaciones         */}
      {/* ============================================================== */}
      <section className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80 text-stone-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D99B26]/20 text-[#D99B26] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-[#1F1D1B] text-sm">
              Información de Acceso para el Público
            </div>
            <p className="text-stone-600 leading-relaxed">
              Todas las funciones de la <strong>46 Muestra Nacional de Teatro</strong> son <strong>100% gratuitas</strong>. El ingreso a cada sala es por orden de llegada hasta completar el aforo del recinto. Se recomienda llegar <strong>30 minutos antes</strong> de la tercera llamada.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. EXTRACTO CURATORIAL (Versión colapsable / limpia)           */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-stone-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D99B26]">
              Línea Editorial & Dirección Artística 46 MNT
            </div>

            <h2 className="font-display font-bold text-xl sm:text-3xl text-[#1F1D1B] leading-tight">
              "Querétaro lleva en su territorio la memoria de la lucha..."
            </h2>

            <blockquote className="font-editorial text-sm sm:text-base text-stone-700 italic leading-relaxed">
              "Comenzamos imaginando a la Dirección Artística de esta 46 Muestra Nacional de Teatro como un cuerpo colectivo convocado a cartografiar, a mapear desde los diversos territorios geográficos y culturales..."
            </blockquote>

            <p className="text-xs text-stone-500 leading-relaxed">
              Colegiado curatorial: <strong>Esmeralda Aragón</strong>, <strong>Jorge A. Vargas</strong>, <strong>José Uriel García Solís</strong>, <strong>Sara Pinedo</strong> y <strong>Verónica Carranco</strong>.
            </p>

            <div className="pt-1">
              <button
                onClick={() => onNavigateTab('curaduria')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8C3B2B] hover:text-[#5c2317] transition-colors cursor-pointer"
              >
                <span>Leer Manifiesto Curatorial Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[16/9] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 shadow-md">
            <img
              src="/src/assets/images/curaduria_artistas_1793910144560.jpg"
              alt="Mesa de trabajo de la Dirección Artística de la 46 Muestra Nacional de Teatro"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-[10px] sm:text-[11px] font-medium">
              Dirección Artística y Encuentro Comunitario en Querétaro
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
