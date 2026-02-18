import { useState, useEffect } from 'react';
import PrecisionClock from '@/components/PrecisionClock';
import WeatherDossier from '@/components/WeatherDossier';
import ObjetivosDeCampo from '@/components/ObjetivosDeCampo';
import PomodoroTimer from '@/components/PomodoroTimer';
import { getMockWeather, getMissionBriefing, fetchWeather, WeatherData } from '@/data/weather';

const Index = () => {
  const [weather, setWeather] = useState<WeatherData>(getMockWeather());
  const [briefing, setBriefing] = useState('');

  useEffect(() => {
    const initWeather = async () => {
      const data = await fetchWeather();
      setWeather(data);
      setBriefing(getMissionBriefing(data.condition));
    };

    initWeather();

    // Refresh every 30 minutes
    const interval = setInterval(initWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-4 sm:px-8 transition-colors duration-500">

      {/* Main Container */}
      <div className="w-full max-w-5xl relative">

        {/* Header */}
        <header className="text-center mb-16 relative animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-block relative">
            <h1 className="font-sans text-4xl sm:text-5xl font-light text-ivory tracking-[0.2em] mb-4 uppercase">
              L'Informatore
            </h1>
            <div className="w-24 h-[1px] bg-gold mx-auto" />
            <p className="font-sans text-xs text-gold uppercase tracking-[0.4em] mt-4">
              Dossier Confidencial
            </p>
          </div>
        </header>

        {/* Console Modules */}
        <div className="w-full max-w-5xl relative z-10 space-y-4">

          {/* TOP ROW: Weather & Clock (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[240px]">
            <WeatherDossier data={weather} briefing={briefing} />
            <PrecisionClock />
          </div>

          {/* MIDDLE ROW: Pomodoro (Full Width) */}
          <PomodoroTimer />

          {/* BOTTOM ROW: Switchboard (Full Width) */}
          <div className="w-full">
            <ObjetivosDeCampo />
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-24 text-center animate-in fade-in duration-1000 delay-300">
          <div className="flex justify-center mb-6">
            <div className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center">
              <span className="font-sans text-[10px] text-zinc-600">LI</span>
            </div>
          </div>

          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-zinc-700">
            Secure Terminal // {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Index;
