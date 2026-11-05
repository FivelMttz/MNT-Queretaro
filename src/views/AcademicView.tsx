import React, { useState } from 'react';
import { ACADEMIC_ACTIVITIES, AcademicActivity } from '../data/mntData';
import { getActivityGoogleCalendarUrl, downloadActivityIcsFile } from '../utils/calendarUtils';
import { Calendar, Clock, MapPin, Bookmark, Check, Share2, ExternalLink } from 'lucide-react';

interface AcademicViewProps {
  isSaved: (id: string) => boolean;
  onToggleSave: (activity: AcademicActivity, e?: React.MouseEvent) => void;
}

export const AcademicView: React.FC<AcademicViewProps> = ({ isSaved, onToggleSave }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'Todas las actividades' },
    { id: 'ERI', label: 'Encuentro ERI' },
    { id: 'FELIT', label: 'Feria del Libro (FELIT)' },
    { id: 'Salas de Ensayo', label: 'Salas de Ensayo' },
    { id: 'MDEI', label: 'Diseño Escénico (MDEI)' },
    { id: 'Laboratorio', label: 'Laboratorio Social' },
    { id: 'Conferencias', label: 'Conferencias CNT' }
  ];

  const filteredActivities = activeTab === 'all'
    ? ACADEMIC_ACTIVITIES
    : ACADEMIC_ACTIVITIES.filter(a => a.category === activeTab);

  const handleShare = (act: AcademicActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `46 MNT Actividad Académica: ${act.title}. ${act.dates} a las ${act.timeDisplay} en ${act.venue}.`;
    if (navigator.share) {
      navigator.share({
        title: act.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(act.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="text-xs font-bold text-[#D99B26] uppercase tracking-wider mb-1">
          Formación, Reflexión y Diálogo Gremial
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1F1D1B] tracking-tight">
          Actividades Académicas y Encuentro
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Talleres, conferencias, feria del libro y mesas de discusión donde el gremio teatral, la academia y el público analizan las tensiones, poéticas y futuros de las artes vivas. Ahora puedes <strong>agregar cualquier actividad a tu itinerario</strong> y sincronizarla con tu calendario.
        </p>
      </div>

      {/* Tabs Component */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#D99B26] text-[#1F1D1B] shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Actividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActivities.map((act) => {
          const saved = isSaved(act.id);
          const requirementBadge =
            act.accessRequirement === 'Entrada libre'
              ? 'bg-green-100 text-green-800 border-green-200'
              : act.accessRequirement === 'Actividad con registro previo'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-blue-100 text-blue-800 border-blue-200';

          return (
            <div
              key={act.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                saved
                  ? 'border-[#D99B26] ring-1 ring-[#D99B26]/30 shadow-md'
                  : 'border-stone-200/90 shadow-sm hover:border-[#D99B26] hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Categoría + Requisito + Botón Guardar en Itinerario */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8C3B2B]">
                      {act.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${requirementBadge}`}>
                      {act.accessRequirement}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => onToggleSave(act, e)}
                    className={`p-2 rounded-xl border transition-all ${
                      saved
                        ? 'bg-[#D99B26] text-[#1F1D1B] border-[#D99B26] shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-500 border-stone-200'
                    }`}
                    title={saved ? 'Quitar de mi itinerario' : 'Guardar en mi itinerario'}
                    aria-label={`Guardar actividad ${act.title} en mi itinerario`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-display font-bold text-lg text-[#1F1D1B] leading-snug">
                  {act.title}
                </h3>

                {act.subtitle && (
                  <p className="text-xs text-stone-500 italic">
                    {act.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {act.description}
                </p>

                {/* Facilitadores / Participantes */}
                <div className="pt-2 text-xs text-stone-700 space-y-1">
                  <p className="font-semibold text-[#1F1D1B]">
                    {act.facilitators}
                  </p>
                  {act.participants && (
                    <p className="text-stone-500 text-[11px]">
                      Participan: {act.participants}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta: Sede, Fechas, Horario y Acciones */}
              <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                    <span className="font-medium text-stone-700">{act.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{act.timeDisplay}</span>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-1.5 text-stone-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#8C3B2B] shrink-0" />
                    <span>{act.venue}</span>
                  </div>
                </div>

                {/* Botones de Acción: Itinerario + Calendarios */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={(e) => onToggleSave(act, e)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      saved
                        ? 'bg-[#D99B26] text-[#1F1D1B] shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                    <span>{saved ? 'En mi itinerario' : '+ Agregar a mi ruta'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <a
                      href={getActivityGoogleCalendarUrl(act)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-md font-medium transition-colors"
                      title="Añadir a Google Calendar"
                    >
                      + Calendar
                    </a>
                    <button
                      onClick={() => downloadActivityIcsFile(act)}
                      className="px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-md font-medium transition-colors"
                      title="Descargar archivo .ics para iCal / Apple Calendar"
                    >
                      .ics
                    </button>
                    <button
                      onClick={(e) => handleShare(act, e)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                      title="Compartir actividad"
                    >
                      {copiedId === act.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
