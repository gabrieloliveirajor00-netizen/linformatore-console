import { useState, useEffect } from 'react';
import { TIMEZONE_CITIES } from '@/data/weather';

const PrecisionClock = () => {
  const [now, setNow] = useState(new Date());
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, tz?: string) => {
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      ...(tz ? { timeZone: tz } : {}),
    });
  };

  const cycleCity = () => {
    setCityIndex((i) => (i + 1) % TIMEZONE_CITIES.length);
  };

  const selectedCity = TIMEZONE_CITIES[cityIndex];
  const localTime = formatTime(now);
  const remoteTime = formatTime(now, selectedCity.timezone);

  return (
    <div className="crt-screen crt-scanline-sweep p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="crt-label">Relógio</span>
        <div className="flex items-center gap-2">
          <div className="led led-green" />
          <span className="font-mono-data text-[9px] text-muted-foreground">SYNC</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 font-mono-data">
            Hora Local
          </p>
          <p className="font-mono-data text-lg sm:text-2xl phosphor-text tracking-wider">
            {localTime}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono-data">
              {selectedCity.label}
            </p>
            <button
              onClick={cycleCity}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-display"
              style={{
                background: 'radial-gradient(ellipse at 40% 30%, hsl(220 6% 30%), hsl(220 8% 18%))',
                border: '1px solid hsl(220 6% 12%)',
                color: 'hsl(var(--phosphor))',
                boxShadow: '0 1px 3px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
              }}
              title="Ajuste de Frequência"
            >
              ◄►
            </button>
          </div>
          <p className="font-mono-data text-lg sm:text-2xl amber-text tracking-wider">
            {remoteTime}
          </p>
        </div>
      </div>

      <hr className="panel-divider" />

      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-mono-data">
        {now.toLocaleDateString('pt-PT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
};

export default PrecisionClock;
