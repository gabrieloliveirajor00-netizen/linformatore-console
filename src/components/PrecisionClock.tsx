import { useState, useEffect } from 'react';

const PrecisionClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getRomeTime = () => {
    return new Date(
      now.toLocaleString('en-US', { timeZone: 'Europe/Rome' })
    );
  };

  const localTime = formatTime(now);
  const romeTime = formatTime(getRomeTime());

  return (
    <div className="dossier-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="dossier-stamp">Orologio</span>
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 font-mono-data">
            Ora Locale
          </p>
          <p className="font-mono-data text-lg sm:text-2xl text-foreground tracking-wider">
            {localTime}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 font-mono-data">
            Ora di Roma
          </p>
          <p className="font-mono-data text-lg sm:text-2xl text-ink tracking-wider">
            {romeTime}
          </p>
        </div>
      </div>

      <hr className="dossier-divider" />

      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-mono-data">
        {now.toLocaleDateString('it-IT', {
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
