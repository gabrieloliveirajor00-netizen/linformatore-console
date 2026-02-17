import { useState, useEffect } from 'react';
import PrecisionClock from '@/components/PrecisionClock';
import WeatherDossier from '@/components/WeatherDossier';
import MissionBriefing from '@/components/MissionBriefing';
import { getMockWeather, getMissionBriefing } from '@/data/weather';

const Index = () => {
  const [weather] = useState(getMockWeather());
  const [briefing, setBriefing] = useState('');

  useEffect(() => {
    setBriefing(getMissionBriefing(weather.condition));
  }, [weather.condition]);

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Header — Agency Seal */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="inline-block border-2 border-ink px-4 sm:px-6 py-2 mb-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-wide">
              L'Informatore
            </h1>
          </div>
          <p className="font-mono-data text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Servizio Informazioni — Rapporto Giornaliero
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="w-8 h-[1px] bg-border inline-block mt-2" />
            <span className="text-[10px] font-mono-data text-accent uppercase tracking-widest">
              Classificato
            </span>
            <span className="w-8 h-[1px] bg-border inline-block mt-2" />
          </div>
        </header>

        {/* Dossier Sections */}
        <div className="space-y-4 sm:space-y-5">
          <PrecisionClock />
          <WeatherDossier data={weather} />
          <MissionBriefing briefing={briefing} />
        </div>

        {/* Footer — Dossier Ref */}
        <footer className="mt-6 sm:mt-8 text-center">
          <hr className="dossier-divider" />
          <p className="font-mono-data text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Rif. Prot. N° {Math.floor(Date.now() / 86400000)} — Distribuzione Limitata
          </p>
          <p className="font-mono-data text-[9px] text-muted-foreground mt-1">
            Distruggere dopo la lettura
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
