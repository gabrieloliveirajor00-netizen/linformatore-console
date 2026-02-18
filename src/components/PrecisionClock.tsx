import { useState, useEffect } from 'react';

const PrecisionClock = () => {
  const [time, setTime] = useState(new Date());
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const cities = [
    { name: 'LISBOA', tz: 'Europe/Lisbon' },
    { name: 'NYC', tz: 'America/New_York' },
    { name: 'BRASÍLIA', tz: 'America/Sao_Paulo' },
    { name: 'ROMA', tz: 'Europe/Rome' },
    { name: 'TÓQUIO', tz: 'Asia/Tokyo' },
    { name: 'ZURIQUE', tz: 'Europe/Zurich' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0');

  const getCityTime = (tz: string) => {
    return new Date().toLocaleTimeString('pt-PT', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  };

  const handleTune = () => {
    setCurrentCityIndex((prev) => (prev + 1) % cities.length);
  };

  return (
    <div className="luxury-panel w-full h-full flex flex-col items-center justify-center p-4">
      {/* Primary Local Time (Lisbon) */}
      <div className="flex gap-3 items-baseline mb-3">

        {/* Hours */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-5xl text-ivory font-light tracking-tighter">
            {formatUnit(time.getHours())}
          </span>
          <span className="text-label text-[8px] mt-0.5">ORE</span>
        </div>

        <span className="font-mono text-5xl text-gold/50 animate-pulse pb-2">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-5xl text-ivory font-light tracking-tighter">
            {formatUnit(time.getMinutes())}
          </span>
          <span className="text-label text-[8px] mt-0.5">MIN</span>
        </div>

        <span className="font-mono text-5xl text-gold/50 animate-pulse pb-2">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-5xl text-gold font-light tracking-tighter">
            {formatUnit(time.getSeconds())}
          </span>
          <span className="text-label text-[8px] mt-0.5 text-gold/70">SEC</span>
        </div>

      </div>

      <div className="w-3/4 h-[1px] bg-zinc-800 mb-4" />

      {/* Secondary World Clock Line */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          {/* Static Main City */}
          <div className="flex flex-col items-end">
            <span className="font-sans text-[10px] tracking-[0.2em] text-zinc-500 uppercase">LOCAL</span>
            <span className="font-mono text-sm text-ivory">LISBOA</span>
          </div>

          <div className="h-8 w-[1px] bg-zinc-800" />

          {/* Tuned City */}
          <div className="flex flex-col items-start min-w-[80px]">
            <span className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase">MONITOR</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm text-ivory">{cities[currentCityIndex].name}</span>
              <span className="font-mono text-xs text-zinc-500">{getCityTime(cities[currentCityIndex].tz)}</span>
            </div>
          </div>
        </div>

        {/* Tune Button */}
        <button
          onClick={handleTune}
          className="luxury-switch px-3 h-6 w-auto text-[9px] uppercase tracking-widest font-sans text-obsidian bg-gold hover:bg-white transition-colors"
        >
          TUNE
        </button>
      </div>

    </div>
  );
};

export default PrecisionClock;
