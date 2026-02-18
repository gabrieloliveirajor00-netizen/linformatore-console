import { useState, useEffect } from 'react';
import { Mission, getDefaultMissions } from '@/data/weather';
import { Plus, Archive, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const ObjetivosDeCampo = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [archived, setArchived] = useState<Mission[]>([]);

  // New Mission Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<1 | 2 | 3>(2);

  const [showArchive, setShowArchive] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load initial state
  useEffect(() => {
    const savedArchive = localStorage.getItem('ARQUIVO_MORTO');
    if (savedArchive) setArchived(JSON.parse(savedArchive));
    setMissions(getDefaultMissions());
  }, []);

  // Persist archive changes
  useEffect(() => {
    localStorage.setItem('ARQUIVO_MORTO', JSON.stringify(archived));
  }, [archived]);

  const addMission = () => {
    if (!newTitle.trim()) return;
    const newMission: Mission = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      completed: false
    };
    setMissions(prev => [newMission, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority(2);
  };

  const archiveMission = (id: string) => {
    const missionToArchive = missions.find(m => m.id === id);
    if (missionToArchive) {
      setMissions(prev => prev.filter(m => m.id !== id));
      setArchived(prev => [{ ...missionToArchive, completed: true }, ...prev]);
    }
  };

  const restoreMission = (id: string) => {
    const missionToRestore = archived.find(m => m.id === id);
    if (missionToRestore) {
      setArchived(prev => prev.filter(m => m.id !== id));
      setMissions(prev => [{ ...missionToRestore, completed: false }, ...prev]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getPriorityColor = (p: number) => {
    switch (p) {
      case 3: return 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'; // High
      case 2: return 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'; // Mid
      case 1: return 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]'; // Low
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="luxury-panel p-6 w-full mx-auto h-full min-h-[400px]">

      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs tracking-[0.2em] text-ivory uppercase">
          Switchboard {showArchive ? '// ARQUIVO' : 'Operativo'}
        </h2>

        <button
          onClick={() => setShowArchive(!showArchive)}
          className="text-[9px] text-zinc-500 hover:text-gold uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          {showArchive ? 'VOLTAR' : 'HISTÓRICO'} <Archive className="w-3 h-3" />
        </button>
      </div>

      {/* Main List Area */}
      {!showArchive ? (
        <>
          {/* Create New Mission */}
          <div className="mb-6 bg-transparent border-t border-b border-zinc-800 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="NOVA MISSÃO"
                  className="bg-transparent text-sm text-ivory placeholder-zinc-700 w-full outline-none font-sans tracking-widest uppercase border-b border-zinc-800 focus:border-gold transition-colors pb-1"
                />
              </div>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(Number(e.target.value) as 1 | 2 | 3)}
                className="bg-transparent text-[10px] text-gold uppercase tracking-widest outline-none border border-gold/30 rounded-sm px-2 py-1 cursor-pointer hover:border-gold transition-colors appearance-none text-center min-w-[80px]"
                style={{ backgroundImage: 'none' }}
              >
                <option value={3} className="bg-obsidian text-zinc-400">Alta</option>
                <option value={2} className="bg-obsidian text-zinc-400">Média</option>
                <option value={1} className="bg-obsidian text-zinc-400">Baixa</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="DESCRIÇÃO OPERACIONAL..."
                className="flex-1 bg-transparent text-[10px] text-zinc-500 placeholder-zinc-800 outline-none font-mono tracking-wide"
              />
              <button
                onClick={addMission}
                className="w-6 h-6 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 hover:text-gold hover:border-gold transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {missions.length === 0 && (
              <p className="text-center text-[10px] text-zinc-600 py-4 font-mono">NENHUMA MISSÃO ATIVA</p>
            )}
            {missions.map((mission) => (
              <div key={mission.id} className="group border-b border-zinc-900/50 last:border-0 pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className="flex-1 pr-4 flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleExpand(mission.id)}
                  >
                    {/* Priority LED */}
                    <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(mission.priority)}`} />

                    <p className="font-sans text-xs text-ivory tracking-wide leading-5 hover:text-gold transition-colors">
                      {mission.title}
                    </p>

                    {mission.description && (
                      <div className="text-zinc-600">
                        {expandedId === mission.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                    )}
                  </div>

                  {/* Switch -> Archive */}
                  <div
                    onClick={() => archiveMission(mission.id)}
                    className="cursor-pointer group/switch"
                    title="Concluir e Arquivar"
                  >
                    <div className="w-8 h-4 border border-zinc-700 rounded-full flex items-center px-0.5 transition-all duration-300 hover:border-gold">
                      <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full transition-all duration-300 group-hover/switch:bg-gold group-hover/switch:translate-x-4" />
                    </div>
                  </div>
                </div>

                {/* Accordion Description */}
                {expandedId === mission.id && mission.description && (
                  <div className="mt-2 pl-4 pr-12 animate-in slide-in-from-top-1 duration-200">
                    <p className="font-mono text-[10px] text-zinc-500 leading-relaxed border-l border-zinc-800 pl-2">
                      {mission.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Archive View */
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {archived.length === 0 && (
            <p className="text-center text-[10px] text-zinc-600 py-4 font-mono">ARQUIVO VAZIO</p>
          )}
          {archived.map((mission) => (
            <div key={mission.id} className="flex items-center justify-between border-b border-zinc-900 pb-2 last:border-0 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 max-w-[80%]">
                <div className={`w-1 h-1 rounded-full ${getPriorityColor(mission.priority)}`} />
                <p className="font-mono text-xs text-zinc-400 line-through truncate">
                  {mission.title}
                </p>
              </div>
              <button
                onClick={() => restoreMission(mission.id)}
                className="text-zinc-600 hover:text-gold transition-colors"
                title="Restaurar"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjetivosDeCampo;
