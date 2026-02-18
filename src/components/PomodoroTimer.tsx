import { useState, useEffect, useRef } from 'react';
import { Play, Square, Coffee, Brain, RotateCcw } from 'lucide-react';

type TimerMode = 'FOCUS' | 'BREAK';

const PomodoroTimer = () => {
    const [mode, setMode] = useState<TimerMode>('FOCUS');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // Play sound or alert? For now, visual strict alert
        // In a real browser app we'd play an Audio

        if (mode === 'FOCUS') {
            setSessionCount(s => s + 1);
            // Wait for user to start break
            alert("Ciclo de Foco Completo. Iniciar Pausa?");
            setMode('BREAK');
            setTimeLeft(BREAK_TIME);
        } else {
            alert("Pausa Terminada. Voltar ao Foco?");
            setMode('FOCUS');
            setTimeLeft(FOCUS_TIME);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'FOCUS') setTimeLeft(FOCUS_TIME);
        else setTimeLeft(BREAK_TIME);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'FOCUS'
        ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100
        : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

    return (
        <div className="luxury-panel w-full p-6 flex items-center justify-between relative overflow-hidden group">

            {/* Background Progress Bar */}
            <div
                className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${mode === 'FOCUS' ? 'bg-gold' : 'bg-green-500'}`}
                style={{ width: `${progress}%` }}
            />

            {/* Left Info */}
            <div className="flex items-center gap-4">
                {/* Status LED */}
                <div className="relative flex items-center justify-center w-3 h-3">
                    {isActive && mode === 'FOCUS' && (
                        <div className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${isActive && mode === 'FOCUS' ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>

                <div className={`p-3 rounded-full border ${mode === 'FOCUS' ? 'border-gold text-gold' : 'border-green-500 text-green-500'}`}>
                    {mode === 'FOCUS' ? <Brain size={20} /> : <Coffee size={20} />}
                </div>
                <div>
                    <h3 className={`text-xs tracking-[0.2em] font-sans uppercase ${mode === 'FOCUS' ? 'text-ivory' : 'text-zinc-400'}`}>
                        {mode === 'FOCUS' ? 'Modo Foco' : 'Recuperação'}
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-mono mt-1">
                        SESSÃO #{sessionCount + 1}
                    </p>
                </div>
            </div>

            {/* Center Timer */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className={`font-mono text-5xl font-light tracking-tighter ${mode === 'FOCUS' ? 'text-ivory' : 'text-green-500'}`}>
                    {formatTime(timeLeft)}
                </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={resetTimer}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-zinc-700 text-zinc-500 hover:text-ivory hover:border-ivory transition-all duration-300"
                    title="Reset Timer"
                >
                    <RotateCcw size={12} />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`
            w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300
            ${isActive
                            ? 'border-red-500 text-red-500 hover:bg-red-500/10'
                            : 'border-gold text-gold hover:bg-gold hover:text-obsidian'
                        }
          `}
                >
                    {isActive ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </button>
            </div>

        </div>
    );
};

export default PomodoroTimer;
