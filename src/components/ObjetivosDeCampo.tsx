import { useState, useEffect } from 'react';
import { Mission, getDefaultMissions } from '@/data/weather';
import { Plus, Archive, RotateCcw, ChevronDown, ChevronUp, FolderPlus, Folder as FolderIcon, FolderOpen } from 'lucide-react';
import Pasta from './Pasta';

interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
}

const ObjetivosDeCampo = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [archived, setArchived] = useState<Mission[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // New Folder Inputs
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // New Mission Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<1 | 2 | 3>(2);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const [showArchive, setShowArchive] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load initial state (Total Persistence)
  useEffect(() => {
    const savedFolders = localStorage.getItem('PASTAS_OPERATIVAS');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }

    const savedMissions = localStorage.getItem('MISSOES_ATIVAS');
    if (savedMissions) {
      setMissions(JSON.parse(savedMissions));
    } else {
      setMissions(getDefaultMissions());
    }

    const savedArchive = localStorage.getItem('ARQUIVO_MORTO');
    if (savedArchive) setArchived(JSON.parse(savedArchive));
  }, []);

  // Persist changes on dependency updates
  useEffect(() => {
    localStorage.setItem('PASTAS_OPERATIVAS', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('MISSOES_ATIVAS', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('ARQUIVO_MORTO', JSON.stringify(archived));
  }, [archived]);

  // Folder actions
  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim().toUpperCase(),
      isExpanded: true
    };
    setFolders(prev => [...prev, newFolder]);
    if (!selectedFolderId) setSelectedFolderId(newFolder.id);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const toggleFolder = (id: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f));
  };

  const deleteFolder = (id: string) => {
    setMissions(prev => prev.map(m => m.folderId === id ? { ...m, folderId: undefined } : m));
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolderId === id) setSelectedFolderId('');
  };

  // Mission actions
  const addMission = () => {
    if (!newTitle.trim()) return;
    const newMission: Mission = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      completed: false,
      folderId: selectedFolderId || undefined
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

  const cyclePriority = (id: string, currentPriority: number) => {
    // Cycles: 1 (Low) -> 2 (Mid) -> 3 (High) -> 1 (Low)
    const nextPriority = currentPriority === 3 ? 1 : (currentPriority + 1) as 1 | 2 | 3;
    setMissions(prev => prev.map(m => m.id === id ? { ...m, priority: nextPriority } : m));
  };

  const getPriorityColor = (p: number) => {
    switch (p) {
      case 3: return 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'; // High
      case 2: return 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'; // Mid
      case 1: return 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]'; // Low
      default: return 'bg-zinc-500';
    }
  };

  const renderMission = (mission: Mission, isArchived: boolean = false) => {
    if (isArchived) {
      return (
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
      );
    }

    return (
      <div key={mission.id} className="group border-b border-zinc-900/50 last:border-0 pb-2 py-1">
        <div className="flex items-center justify-between">
          <div
            className="flex-1 pr-4 flex items-center gap-3 cursor-pointer"
            onClick={() => toggleExpand(mission.id)}
          >
            {/* Priority LED */}
            <div
              className={`w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform ${getPriorityColor(mission.priority)}`}
              onClick={(e) => {
                e.stopPropagation();
                cyclePriority(mission.id, mission.priority);
              }}
              title="Alterar Prioridade"
            />

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
    );
  };

  return (
    <div className="luxury-panel p-6 w-full mx-auto h-full min-h-[400px]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xs tracking-[0.2em] text-ivory uppercase whitespace-nowrap">
          Switchboard {showArchive ? '// ARQUIVO' : ''}
        </h2>

        {/* Folder Pills (Tabs) */}
        {!showArchive && (
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-center md:justify-end md:pr-4">
            <button
              onClick={() => setActiveFolderId(null)}
              className={`text-[9px] px-3 py-1 rounded-full border transition-all uppercase tracking-widest ${activeFolderId === null ? 'border-gold text-gold bg-gold/10' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              TUDO
            </button>
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`text-[9px] px-3 py-1 rounded-full border transition-all uppercase tracking-widest ${activeFolderId === f.id ? 'border-gold text-gold bg-gold/10' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
              >
                {f.name}
              </button>
            ))}
            {/* New Folder Pill */}
            <button
              onClick={() => setShowNewFolderInput(!showNewFolderInput)}
              className="text-[10px] w-6 h-6 flex items-center justify-center rounded-full border border-zinc-800 text-zinc-500 hover:border-gold hover:text-gold transition-colors"
              title="Nova Pasta"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={() => setShowArchive(!showArchive)}
          className="text-[9px] text-zinc-500 hover:text-gold uppercase tracking-widest flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          {showArchive ? 'VOLTAR' : 'HISTÓRICO'} <Archive className="w-3 h-3" />
        </button>
      </div>

      {/* Main List Area */}
      {!showArchive ? (
        <>
          {/* Create New Folder Input */}
          {showNewFolderInput && (
            <div className="mb-4 bg-zinc-900/30 border border-zinc-800 p-3 rounded-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <FolderIcon className="w-4 h-4 text-gold/70" />
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="NOME DA NOVA PASTA..."
                className="bg-transparent text-sm text-ivory placeholder-zinc-700 w-full outline-none font-sans tracking-widest uppercase border-b border-zinc-700 focus:border-gold transition-colors pb-1"
                onKeyDown={(e) => e.key === 'Enter' && addFolder()}
                autoFocus
              />
              <button
                onClick={addFolder}
                className="text-xs text-gold border border-gold/30 px-3 py-1 rounded-sm hover:bg-gold/10 transition-colors tracking-widest uppercase"
              >
                CRIAR
              </button>
            </div>
          )}

          {/* Create New Mission & Folder Container */}
          <div className="mb-6 bg-transparent border-t border-b border-zinc-800 py-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">

              <div className="flex-1 relative flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="NOVA MISSÃO"
                  className="bg-transparent text-sm text-ivory placeholder-zinc-700 w-full outline-none font-sans tracking-widest border-b border-zinc-800 focus:border-gold transition-colors pb-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="bg-obsidian text-[10px] text-zinc-400 uppercase tracking-widest outline-none border border-zinc-800 rounded-sm px-2 py-1 cursor-pointer hover:border-gold/50 transition-colors appearance-none min-w-[100px]"
                >
                  <option value="">(RAIZ)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

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
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="DESCRIÇÃO OPERACIONAL..."
                className="flex-1 bg-transparent text-[10px] text-zinc-500 placeholder-zinc-800 outline-none font-mono tracking-wide"
                onKeyDown={(e) => e.key === 'Enter' && addMission()}
              />
              <button
                onClick={addMission}
                className="w-6 h-6 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 hover:text-gold hover:border-gold transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {folders.length === 0 && missions.length === 0 && (
              <p className="text-center text-[10px] text-zinc-600 py-4 font-mono">NENHUMA MISSÃO OU PASTA ATIVA</p>
            )}

            {/* Folders Iteration */}
            {folders.filter(f => activeFolderId === null || f.id === activeFolderId).map(folder => {
              const folderMissions = missions.filter(m => m.folderId === folder.id);

              return (
                <Pasta
                  key={folder.id}
                  folder={folder}
                  missions={folderMissions}
                  onToggle={toggleFolder}
                  onDelete={deleteFolder}
                  renderMission={renderMission}
                />
              );
            })}

            {/* Root / Unassigned Missions Iteration */}
            {activeFolderId === null && missions.filter(m => !m.folderId).length > 0 && (
              <div className="root-missions-container space-y-2 pt-2">
                {folders.length > 0 && <h3 className="text-[10px] text-zinc-600 tracking-widest uppercase mb-3 ml-1">TAREFAS SOLTAS</h3>}
                {missions.filter(m => !m.folderId).map(m => renderMission(m))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Archive View */
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {archived.length === 0 && (
            <p className="text-center text-[10px] text-zinc-600 py-4 font-mono">ARQUIVO VAZIO</p>
          )}
          {archived.map(m => renderMission(m, true))}
        </div>
      )}
    </div>
  );
};

export default ObjetivosDeCampo;
