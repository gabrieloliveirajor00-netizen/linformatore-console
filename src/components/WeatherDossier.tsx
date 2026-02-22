import { useState, useEffect } from 'react';
import { WeatherData } from '@/data/weather';
import { Cloud, CloudRain, Moon, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherDossierProps {
  data: WeatherData;
  briefing: string;
}

const WeatherDossier = ({ data }: WeatherDossierProps) => {
  const [stats, setStats] = useState({ active: 0, folders: 0, topFolder: '', progress: 0 });

  useEffect(() => {
    const loadStats = () => {
      try {
        const activeMissions = JSON.parse(localStorage.getItem('MISSOES_ATIVAS') || '[]');
        const folders = JSON.parse(localStorage.getItem('PASTAS_OPERATIVAS') || '[]');
        const archivedMissions = JSON.parse(localStorage.getItem('ARQUIVO_MORTO') || '[]');

        const activeCount = activeMissions.length;
        const foldersCount = folders.length;
        const totalCount = activeCount + archivedMissions.length;
        const progress = totalCount > 0 ? (archivedMissions.length / totalCount) * 100 : 0;

        let topFolder = '';
        if (activeCount > 0 && foldersCount > 0) {
          const counts: Record<string, number> = {};
          activeMissions.forEach((m: { folderId?: string }) => {
            if (m.folderId) counts[m.folderId] = (counts[m.folderId] || 0) + 1;
          });
          let maxCount = 0;
          let maxId = '';
          Object.entries(counts).forEach(([id, count]) => {
            if (count > maxCount) { maxCount = count; maxId = id; }
          });
          if (maxId) {
            const f = folders.find((f: { id: string, name: string }) => f.id === maxId);
            if (f) topFolder = f.name;
          }
        }

        setStats({ active: activeCount, folders: foldersCount, topFolder, progress });
      } catch (e) {
        console.error("Error loading stats for Sprint Status", e);
      }
    };

    loadStats();
    // Refresh stats every second to keep dashboard reactive
    const interval = setInterval(loadStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (condition: string) => {
    switch (condition) {
      case 'sun': return <Sun className="w-5 h-5 text-gold" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-ivory" />;
      case 'night': return <Moon className="w-5 h-5 text-gold" />;
      case 'clouds': return <Cloud className="w-5 h-5 text-ivory" />;
      default: return <Sun className="w-5 h-5 text-gold" />;
    }
  };

  const DataRow = ({ label, value, icon: Icon }: { label: string, value: string, icon: React.ElementType }) => (
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

      {/* RIGHT: Sprint Status (60%) */}
      <div className="w-full md:w-[60%] p-5 flex flex-col justify-between relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs tracking-[0.2em] text-gold font-medium uppercase">
            Status de Sprint
          </h2>
          <span className="font-mono text-[10px] text-zinc-500">{Math.round(stats.progress)}% COMPLETO</span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-hidden pb-2">
          <p className="font-mono text-[13px] leading-5 text-zinc-300 tracking-normal text-justify h-full overflow-y-auto custom-scrollbar pr-1">
            Tens {stats.active} {stats.active === 1 ? 'missão ativa distribuída' : 'missões ativas distribuídas'} por {stats.folders} pasta{stats.folders !== 1 ? 's' : ''}.
            {stats.topFolder && ` O setor [${stats.topFolder}] requer atenção imediata.`}
            {!stats.topFolder && stats.active > 0 && ` As tarefas na raiz requerem atenção imediata.`}
            {stats.active === 0 && ` Excelente trabalho. Nenhuma missão pendente no momento.`}
          </p>
        </div>

        {/* Decor: Thinnest Progress Bar replacing pulsing dot */}
        <div className="mt-3 pt-3 flex flex-col justify-end opacity-80 gap-2">
          <div className="w-full h-[1px] bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-zinc-600">
              Progresso Diário
            </span>
            <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-zinc-600">
              SYS_OK
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WeatherDossier;
