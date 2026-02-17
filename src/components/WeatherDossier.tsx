import { WeatherData } from '@/data/weather';

const WeatherIcon = ({ condition }: { condition: string }) => {
  const iconClass = "w-10 h-10 sm:w-12 sm:h-12 stroke-[1.2]";
  const color = "currentColor";
  
  switch (condition) {
    case 'sun':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke={color} strokeLinecap="round">
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
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke={color} strokeLinecap="round">
          <path d="M14 28a10 10 0 0 1-.6-20A12 12 0 0 1 36 12a8 8 0 0 1 0 16H14z" />
          <line x1="16" y1="34" x2="14" y2="40" />
          <line x1="24" y1="34" x2="22" y2="40" />
          <line x1="32" y1="34" x2="30" y2="40" />
        </svg>
      );
    case 'night':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke={color} strokeLinecap="round">
          <path d="M38 28A16 16 0 1 1 20 10a12 12 0 0 0 18 18z" />
          <circle cx="36" cy="12" r="1" fill={color} />
          <circle cx="40" cy="20" r="0.5" fill={color} />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke={color} strokeLinecap="round">
          <path d="M14 32a10 10 0 0 1-.6-20A12 12 0 0 1 36 16a8 8 0 0 1 0 16H14z" />
        </svg>
      );
  }
};

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
}

const Gauge = ({ value, max, label, unit }: GaugeProps) => {
  const angle = -90 + (value / max) * 180;
  const r = 36;
  const cx = 50;
  const cy = 50;

  // Arc path for gauge background
  const describeArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 65" className="w-20 h-14 sm:w-24 sm:h-16">
        {/* Gauge arc */}
        <path
          d={describeArc(-180, 0)}
          fill="none"
          stroke="hsl(120 20% 20%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Tick marks */}
        {[0, 45, 90, 135, 180].map((deg) => {
          const rad = ((deg - 180) * Math.PI) / 180;
          const x1i = cx + (r - 5) * Math.cos(rad);
          const y1i = cy + (r - 5) * Math.sin(rad);
          const x2i = cx + r * Math.cos(rad);
          const y2i = cy + r * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1i} y1={y1i} x2={x2i} y2={y2i}
              stroke="hsl(120 40% 30%)"
              strokeWidth="1"
            />
          );
        })}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + 28 * Math.cos((angle * Math.PI) / 180)}
          y2={cy + 28 * Math.sin((angle * Math.PI) / 180)}
          stroke="hsl(var(--phosphor))"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="gauge-needle"
          style={{ '--needle-angle': `${angle}deg` } as React.CSSProperties}
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="2.5" fill="hsl(120 40% 30%)" />
        <circle cx={cx} cy={cy} r="1.5" fill="hsl(var(--phosphor))" />
      </svg>
      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-mono-data mt-1">
        {label}
      </p>
      <p className="font-mono-data text-sm phosphor-text">
        {value}<span className="text-[10px] text-muted-foreground ml-0.5">{unit}</span>
      </p>
    </div>
  );
};

interface WeatherDossierProps {
  data: WeatherData;
}

const WeatherDossier = ({ data }: WeatherDossierProps) => {
  return (
    <div className="crt-screen crt-scanline-sweep p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="crt-label">Dossiê Meteorológico</span>
        <span className="text-[10px] font-mono-data text-muted-foreground uppercase tracking-widest">
          SEC. III
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-4">
        <div className="phosphor-text">
          <WeatherIcon condition={data.condition} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-bold phosphor-text">
              {data.temperature}
            </span>
            <span className="font-mono-data text-sm text-muted-foreground">°C</span>
          </div>
          <p className="font-mono-data text-sm text-muted-foreground mt-1">
            {data.conditionLabel}
          </p>
        </div>
      </div>

      <hr className="panel-divider" />

      <div className="flex justify-around items-end">
        <Gauge value={data.windSpeed} max={60} label="Vento" unit="km/h" />
        <div className="flex flex-col items-center">
          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-mono-data mb-1">
            Direção
          </p>
          <p className="font-mono-data text-lg phosphor-text">{data.windDirection}</p>
        </div>
        <Gauge value={data.humidity} max={100} label="Humidade" unit="%" />
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[9px] font-mono-data text-muted-foreground uppercase tracking-widest">
          Estação: {data.city} — Centro Operacional
        </p>
      </div>
    </div>
  );
};

export default WeatherDossier;
