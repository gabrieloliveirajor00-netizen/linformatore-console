import { useState } from 'react';
import { Mission, getDefaultMissions } from '@/data/weather';

const priorityConfig = {
  3: { led: 'led-red', label: 'CRÍTICA' },
  2: { led: 'led-amber', label: 'MÉDIA' },
  1: { led: 'led-green', label: 'BAIXA' },
} as const;

const ObjetivosDeCampo = () => {
  const [missions, setMissions] = useState<Mission[]>(getDefaultMissions());

  const completeMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
  };

  return (
    <div className="crt-screen crt-scanline-sweep p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="crt-label">Objetivos de Campo</span>
        <span className="text-[10px] font-mono-data text-muted-foreground uppercase tracking-widest">
          {missions.filter((m) => !m.completed).length}/{missions.length} ACTIVOS
        </span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const config = priorityConfig[mission.priority];
          return (
            <div
              key={mission.id}
              className={`border border-border rounded-sm p-3 transition-all duration-300 ${
                mission.completed ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* LED */}
                <div className="pt-1 flex flex-col items-center gap-1">
                  <div className={`led ${mission.completed ? '' : config.led}`}
                    style={mission.completed ? { background: 'hsl(220 6% 25%)', boxShadow: 'none' } : {}}
                  />
                  <span className="text-[7px] font-mono-data text-muted-foreground tracking-wider">
                    P{mission.priority}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-mono-data text-sm phosphor-text ${
                    mission.completed ? 'mission-complete' : ''
                  }`}>
                    {mission.title}
                  </p>
                  <p className="font-mono-data text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                {/* Action */}
                {!mission.completed && (
                  <button
                    onClick={() => completeMission(mission.id)}
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px]"
                    style={{
                      background: 'radial-gradient(ellipse at 40% 30%, hsl(220 6% 28%), hsl(220 8% 16%))',
                      border: '2px solid hsl(220 6% 10%)',
                      color: 'hsl(var(--phosphor))',
                      boxShadow: '0 2px 4px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
                    }}
                    title="Missão Cumprida"
                  >
                    ✓
                  </button>
                )}
                {mission.completed && (
                  <span className="text-[9px] font-mono-data text-muted-foreground shrink-0">
                    CUMPRIDA
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjetivosDeCampo;
