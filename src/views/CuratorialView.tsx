import React from 'react';
import { CURATORS, NATIONAL_CALLS } from '../data/mntData';
import { BookOpen, Users, Award, Sparkles, Quote, MapPin } from 'lucide-react';

export const CuratorialView: React.FC = () => {
  return (
    <div className="space-y-16 max-w-5xl mx-auto text-left">
      {/* Header Editorial */}
      <div className="border-b border-stone-200 pb-8 text-center sm:text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D99B26]/20 border border-[#D99B26]/40 text-[#D99B26] text-xs font-bold uppercase tracking-wider">
          <span>Manifiesto Editorial · 46 MNT Querétaro 2026</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1F1D1B] font-bold tracking-tight">
          Sean bienvenidxs <br className="hidden sm:inline" />
          <span className="text-[#8C3B2B] italic">a respirar juntxs</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-500 font-medium">
          Dirección Artística Colegiada: Esmeralda Aragón · Jorge A. Vargas · José Uriel García Solís · Sara Pinedo · Verónica Carranco
        </p>
      </div>

      {/* Layout Tipo Lectura (Single Column / 800px max-width) */}
      <article className="max-w-3xl mx-auto space-y-8 font-editorial text-lg text-stone-800 leading-relaxed">
        {/* Drop Cap First Paragraph */}
        <p className="first-letter:text-6xl first-letter:font-black first-letter:text-[#D99B26] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
          Querétaro —Tlachco, Andamaxei— lleva en su territorio la memoria de la lucha, desde la guerra chichimeca, hasta las huelgas y el primer sindicato de la textilera Hércules, que sería símbolo de la organización obrera del Bajío y presión para el artículo 123 de nuestra Constitución, pasando por la famosa conspiración de la independencia de 1810 que inmortalizaría a La Corregidora.
        </p>

        <p>
          Como en la mayor parte del territorio nacional, esas memorias históricas y sociales están en tensión continua con los enormes proyectos del denominado progreso con consecuencias alarmantes, que en algunos casos borran, blanquean o estetizan la memoria y nos enfrentan a nuevos dilemas de los que el teatro, como agente social y cultural, no ha estado y no está exento.
        </p>

        {/* Pull Quote Destacado */}
        <div className="my-10 p-6 sm:p-8 bg-[#F9F6F0] rounded-2xl border-y-2 border-[#D99B26] text-center sm:text-left space-y-3">
          <Quote className="w-8 h-8 text-[#D99B26]/40 mx-auto sm:mx-0" />
          <p className="font-editorial text-xl sm:text-2xl text-[#1F1D1B] italic font-medium">
            "¿Cómo accionamos y reaccionamos? ¿Cómo nos interpela la realidad y el teatro? ¿Qué puede el teatro? ¿Qué desea el teatro?"
          </p>
          <div className="text-xs uppercase tracking-wider font-sans font-bold text-[#8C3B2B]">
            Preguntas cardinales de la curaduría 2026
          </div>
        </div>

        <p>
          En este sentido, comenzamos imaginando a la Dirección Artística de esta 46 Muestra Nacional de Teatro como un cuerpo colectivo convocado a cartografiar, a mapear desde los diversos territorios geográficos y culturales, y sus teatralidades, a expandir el mapa para mirar más allá de los márgenes del arte frente a la actualidad y responder, o al menos preguntarnos juntxs.
        </p>

        <p>
          Con estas premisas propusimos una curaduría en diálogo con el territorio geográfico y cultural que la recibe, y con su momento histérico - histórico, que apelara a la memoria y a la celebración del encuentro desde la armonía, la ternura, la calma ante la vorágine, y la digna rabia. El llamado al encuentro finalmente tuvo forma de cuatro convocatorias nacionales: <strong>Muestra de Diseño Escénico Integral</strong>, <strong>Radar de pensamiento crítico para la escena</strong>, <strong>Jóvenes a la Muestra</strong>, y la <strong>convocatoria de programación</strong>, ésta última con más de 400 postulaciones, de las que fueron seleccionadas 30, representando en total a 27 estados del país.
        </p>

        <p>
          Sabemos que los esfuerzos por lograr representatividad, inclusión y descentralización nunca son suficientes; sin embargo, ha sido muy satisfactorio intentar convocar a quienes antes no se habían sentido convocadas; aplicar mecanismos de valoración por estados y regiones, por públicos y formatos; procurar que las actividades formativas sean guiadas por creadoras y creadores locales; proponer otras formas de pensamiento crítico para la escena con base en la colaboración y la rotatividad; extender el alcance del laboratorio de creación artística a la investigación social y la imaginación política; así como sumar escenarios fuera de la capital y ampliar los espacios de participación por convocatoria.
        </p>

        {/* Cierre Poético */}
        <div className="pt-6 border-t border-stone-200 text-center sm:text-left">
          <p className="font-editorial text-2xl text-[#8C3B2B] italic font-bold">
            "A sentir la respiración de al lado. <br />
            A respirar juntxs una vez más."
          </p>
          <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mt-2 font-semibold">
            Noviembre 2026 · Dirección Artística 46 MNT
          </p>
        </div>
      </article>

      {/* Grid de Perfiles de la Dirección Artística */}
      <section className="space-y-6 pt-6 border-t border-stone-200">
        <div className="text-center sm:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D99B26] mb-1">
            Cuerpo Curatorial Colegiado
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F1D1B]">
            Integrantes de la Dirección Artística
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Cinco creadoras, directores y pensadores escénicos provenientes de diversas latitudes y geografías culturales de México.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATORS.map((curator) => (
            <div
              key={curator.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#D99B26] transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  <span className="text-[#8C3B2B] font-extrabold">{curator.origin}</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">{curator.role}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#1F1D1B]">
                  {curator.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
                  {curator.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-[#D99B26] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Territorio: {curator.origin}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Módulo de Convocatorias Nacionales */}
      <section className="space-y-6 pt-6 border-t border-stone-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#8C3B2B] mb-1">
            Estructura de Participación
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F1D1B]">
            Las 4 Convocatorias Nacionales
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Los pilares que articulan la oferta artística, formativa y reflexiva de la 46 edición.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {NATIONAL_CALLS.map((call, idx) => (
            <div
              key={call.id}
              className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#D99B26]/15 text-[#D99B26] font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                  {call.badge}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#1F1D1B]">
                {call.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {call.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
