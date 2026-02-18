import { WeatherData } from '@/data/weather';
import { Cloud, CloudRain, Moon, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherDossierProps {
  data: WeatherData;
  briefing: string;
}

const WeatherDossier = ({ data, briefing }: WeatherDossierProps) => {

  const getIcon = (condition: string) => {
    switch (condition) {
      case 'sun': return <Sun className="w-5 h-5 text-gold" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-ivory" />;
      case 'night': return <Moon className="w-5 h-5 text-gold" />;
      case 'clouds': return <Cloud className="w-5 h-5 text-ivory" />;
      default: return <Sun className="w-5 h-5 text-gold" />;
    }
  };

  const DataRow = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-center justify-between py-2 border-b border-zinc-900 last:border-0 group hover:bg-white/[0.02] transition-colors px-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-zinc-600 group-hover:text-gold transition-colors" />
        <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-zinc-500">
          {label}
        </span>
      </div>
      <span className="font-mono text-xs text-ivory tracking-wider">
        {value}
      </span>
    </div>
  );

  return (
    <div className="luxury-panel w-full mx-auto flex flex-col md:flex-row h-full min-h-[180px]">

      {/* LEFT: Weather Tech Data (40%) */}
      <div className="w-full md:w-[40%] p-5 border-b md:border-b-0 md:border-r border-zinc-800/50 bg-black/20">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs tracking-[0.2em] text-ivory font-light uppercase">
              Meteo
            </h2>
            <p className="text-[9px] text-gold tracking-widest mt-0.5 uppercase opacity-80">
              {data.city}
            </p>
          </div>
          {getIcon(data.condition)}
        </div>

        {/* Temp */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-sans text-4xl font-light text-ivory tracking-tighter">
            {data.temperature}°
          </span>
          <span className="text-[8px] tracking-widest text-zinc-600 uppercase">ATUAL</span>
        </div>

        {/* Grid */}
        <div className="space-y-1">
          <DataRow label="Hum" value={`${data.humidity}%`} icon={Droplets} />
          <DataRow label="Vento" value={`${data.windSpeed} k/h`} icon={Wind} />
          <DataRow label="Vis" value={`${data.visibility} km`} icon={Eye} />
        </div>

      </div>

      {/* RIGHT: Operational Briefing (60%) */}
      <div className="w-full md:w-[60%] p-5 flex flex-col justify-between relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs tracking-[0.2em] text-gold font-medium uppercase">
            Briefing Operacional
          </h2>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-hidden pb-2">
          <p className="font-mono text-[13px] leading-5 text-zinc-300 tracking-normal text-justify h-full overflow-y-auto custom-scrollbar pr-1">
            {briefing}
          </p>
        </div>

        {/* Decor */}
        <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between items-end opacity-50">
          <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-zinc-600">
            Security Level: 5
          </span>
          <div className="h-0.5 w-8 bg-gold/20" />
        </div>

      </div>

    </div>
  );
};

export default WeatherDossier;
