import { useState, useEffect } from 'react';
import PrecisionClock from '@/components/PrecisionClock';
import WeatherDossier from '@/components/WeatherDossier';
import MissionBriefing from '@/components/MissionBriefing';
import ObjetivosDeCampo from '@/components/ObjetivosDeCampo';
import { getMockWeather, getMissionBriefing } from '@/data/weather';

const Index = () => {
  const [weather] = useState(getMockWeather());
  const [briefing, setBriefing] = useState('');

  useEffect(() => {
    setBriefing(getMissionBriefing(weather.condition));
  }, [weather.condition]);

  return (
    <div className="min-h-screen chassis-texture flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Header — Console Plate */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="chassis-screw" />
            <div className="inline-block border-2 border-border px-4 sm:px-6 py-2"
              style={{
                background: 'linear-gradient(180deg, hsl(220 8% 18%), hsl(220 10% 12%))',
                boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / 0.04), 0 2px 4px hsl(0 0% 0% / 0.4)',
              }}
            >
              <h1 className="font-display text-xl sm:text-2xl font-bold phosphor-text tracking-wider">
                L'Informatore
              </h1>
            </div>
            <div className="chassis-screw" />
          </div>
          <p className="font-mono-data text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Serviço de Informações — Relatório Diário
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="w-8 h-[1px] bg-border inline-block mt-2" />
            <div className="flex items-center gap-2">
              <div className="led led-green" />
              <span className="text-[10px] font-mono-data amber-text uppercase tracking-widest">
                Classificado
              </span>
              <div className="led led-green" />
            </div>
            <span className="w-8 h-[1px] bg-border inline-block mt-2" />
          </div>
        </header>

        {/* Console Modules */}
        <div className="space-y-4 sm:space-y-5">
          <PrecisionClock />
          <WeatherDossier data={weather} />
          <MissionBriefing briefing={briefing} />
          <ObjetivosDeCampo />
        </div>

        {/* Footer — Console Serial */}
        <footer className="mt-6 sm:mt-8 text-center">
          <hr className="panel-divider" />
          <p className="font-mono-data text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Ref. Prot. N° {Math.floor(Date.now() / 86400000)} — Distribuição Limitada
          </p>
          <p className="font-mono-data text-[9px] text-muted-foreground mt-1">
            Destruir após leitura
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
