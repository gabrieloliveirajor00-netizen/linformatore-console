import { Mission } from '@/data/weather';
import { Folder as FolderIcon, FolderOpen, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface PastaProps {
    folder: {
        id: string;
        name: string;
        isExpanded: boolean;
    };
    missions: Mission[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    renderMission: (mission: Mission, isArchived?: boolean) => JSX.Element;
}

const Pasta = ({ folder, missions, onToggle, onDelete, renderMission }: PastaProps) => {
    return (
        <div className="folder-container border border-zinc-800/60 rounded-sm bg-black/20">
            <div
                className="folder-header flex items-center justify-between p-3 cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors"
                onClick={() => onToggle(folder.id)}
            >
                <div className="flex items-center gap-2">
                    {folder.isExpanded ? <FolderOpen className="w-4 h-4 text-gold/80" /> : <FolderIcon className="w-4 h-4 text-gold/80" />}
                    <h3 className="folder-title text-xs font-sans tracking-widest text-ivory uppercase">{folder.name}</h3>
                    <span className="folder-count text-[9px] text-zinc-600 font-mono ml-2">[{missions.length}]</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
                        className="text-[9px] text-zinc-600 hover:text-red-500 transition-colors uppercase"
                        title="Remover Pasta (Mantém as missões)"
                    >
                        [X]
                    </button>
                    <div className="text-zinc-500">
                        {folder.isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                </div>
            </div>

            {folder.isExpanded && (
                <div className="folder-content p-3 pt-1 space-y-2 border-t border-zinc-800/40">
                    {missions.length === 0 ? (
                        <p className="text-[10px] text-zinc-600 font-mono pl-6 py-2">PASTA VAZIA</p>
                    ) : (
                        <div className="folder-missions-list pl-2 border-l border-zinc-800/50 space-y-2 ml-2">
                            {missions.map(m => renderMission(m))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Pasta;
