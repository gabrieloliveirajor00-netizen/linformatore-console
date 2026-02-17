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
    }, 600);
  };

  return (
    <div className="crt-screen crt-scanline-sweep p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="crt-label">Briefing de Campo</span>
        <div className="flex items-center gap-2">
          <div className={`led ${confirmed ? 'led-green' : 'led-amber'}`} />
          <span className="text-[9px] font-mono-data text-muted-foreground">
            {confirmed ? 'CONFIRMADO' : 'PENDENTE'}
          </span>
        </div>
      </div>

      {/* Agent header */}
      <div className="mb-3 pb-2 border-b border-border">
        <p className="font-mono-data text-[10px] uppercase tracking-[0.15em] amber-text">
          Agente: G. Oliveira — Status: Activo
        </p>
      </div>

      <div className="min-h-[60px] flex items-center">
        <p
          className={`font-mono-data text-sm sm:text-base leading-relaxed phosphor-text transition-opacity duration-500 ${
            animating ? 'mission-complete' : ''
          } ${confirmed ? 'opacity-30' : ''}`}
        >
          « {briefing} »
        </p>
      </div>

      <hr className="panel-divider" />

      <div className="flex items-center justify-between">
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          className="btn-bakelite"
        >
          {confirmed ? '✓ Leitura Confirmada' : 'Confirmar Leitura'}
        </button>

        {confirmed && (
          <span className="text-[10px] font-mono-data text-muted-foreground">
            {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} — recebido
          </span>
        )}
      </div>
    </div>
  );
};

export default MissionBriefing;
