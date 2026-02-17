import { WeatherData } from '@/data/weather';

const WeatherIcon = ({ condition }: { condition: string }) => {
  const iconClass = "w-10 h-10 sm:w-12 sm:h-12 stroke-[1.2]";
  
  switch (condition) {
    case 'sun':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round">
          <circle cx="24" cy="24" r="8" />
          <line x1="24" y1="4" x2="24" y2="10" />
          <line x1="24" y1="38" x2="24" y2="44" />
          <line x1="4" y1="24" x2="10" y2="24" />
          <line x1="38" y1="24" x2="44" y2="24" />
          <line x1="9.9" y1="9.9" x2="14.1" y2="14.1" />
          <line x1="33.9" y1="33.9" x2="38.1" y2="38.1" />
          <line x1="9.9" y1="38.1" x2="14.1" y2="33.9" />
          <line x1="33.9" y1="14.1" x2="38.1" y2="9.9" />
        </svg>
      );
    case 'rain':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M14 28a10 10 0 0 1-.6-20A12 12 0 0 1 36 12a8 8 0 0 1 0 16H14z" />
          <line x1="16" y1="34" x2="14" y2="40" />
          <line x1="24" y1="34" x2="22" y2="40" />
          <line x1="32" y1="34" x2="30" y2="40" />
        </svg>
      );
    case 'night':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M38 28A16 16 0 1 1 20 10a12 12 0 0 0 18 18z" />
          <circle cx="36" cy="12" r="1" fill="currentColor" />
          <circle cx="40" cy="20" r="0.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M14 32a10 10 0 0 1-.6-20A12 12 0 0 1 36 16a8 8 0 0 1 0 16H14z" />
        </svg>
      );
  }
};

interface WeatherDossierProps {
  data: WeatherData;
}

const WeatherDossier = ({ data }: WeatherDossierProps) => {
  return (
    <div className="dossier-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="dossier-stamp">Dossiê Meteo</span>
        <span className="text-[10px] font-mono-data text-muted-foreground uppercase tracking-widest">
          Sez. III
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-4">
        <div className="text-ink">
          <WeatherIcon condition={data.condition} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              {data.temperature}
            </span>
            <span className="font-mono-data text-sm text-muted-foreground">°C</span>
          </div>
          <p className="font-typewriter text-sm text-muted-foreground mt-1">
            {data.conditionLabel}
          </p>
        </div>
      </div>

      <hr className="dossier-divider" />

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono-data mb-1">
            Vento
          </p>
          <p className="font-mono-data text-sm text-foreground">
            {data.windSpeed} <span className="text-[10px] text-muted-foreground">km/h</span>
          </p>
        </div>
        <div className="border-x border-border">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono-data mb-1">
            Direzione
          </p>
          <p className="font-mono-data text-sm text-foreground">{data.windDirection}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono-data mb-1">
            Umidità
          </p>
          <p className="font-mono-data text-sm text-foreground">
            {data.humidity}<span className="text-[10px] text-muted-foreground">%</span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-border">
        <p className="text-[9px] font-mono-data text-muted-foreground uppercase tracking-widest">
          Stazione: {data.city} — Centro Operativo
        </p>
      </div>
    </div>
  );
};

export default WeatherDossier;
