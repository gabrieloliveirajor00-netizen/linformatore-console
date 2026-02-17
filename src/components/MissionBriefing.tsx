import { useState } from 'react';

interface MissionBriefingProps {
  briefing: string;
}

const MissionBriefing = ({ briefing }: MissionBriefingProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleConfirm = () => {
    if (confirmed) return;
    setAnimating(true);
    setTimeout(() => {
      setConfirmed(true);
      setAnimating(false);
    }, 1500);
  };

  return (
    <div className="dossier-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="dossier-stamp">Riservato</span>
        <span className="text-[10px] font-mono-data text-muted-foreground uppercase tracking-widest">
          Istruzioni Operative
        </span>
      </div>

      <div className="min-h-[80px] flex items-center">
        <p
          className={`font-typewriter text-sm sm:text-base leading-relaxed text-foreground transition-opacity duration-1000 ${
            animating ? 'typewriter-confirm' : ''
          } ${confirmed ? 'opacity-50' : ''}`}
        >
          « {briefing} »
        </p>
      </div>

      <hr className="dossier-divider" />

      <div className="flex items-center justify-between">
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          className={`
            font-mono-data text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-300
            ${
              confirmed
                ? 'border-muted-foreground text-muted-foreground cursor-default opacity-50'
                : 'border-ink text-ink hover:bg-primary hover:text-primary-foreground cursor-pointer'
            }
          `}
        >
          {confirmed ? '✓ Lettura Confermata' : 'Conferma Lettura'}
        </button>

        {confirmed && (
          <span className="text-[10px] font-mono-data text-muted-foreground italic">
            {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} — ricevuto
          </span>
        )}
      </div>
    </div>
  );
};

export default MissionBriefing;
