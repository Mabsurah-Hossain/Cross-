import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../game/audio';

interface PauseModalProps {
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  onResume,
  onRestart,
  onHome,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in select-none"
    >
      <div className="relative w-full max-w-sm bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-[0_8px_0_0_#0F172A] p-6 text-center">
        <h2 id="pause-dialog-title" className="font-title text-3xl text-amber-500 uppercase tracking-wide drop-shadow-[0_2px_0_#0F172A]">
          GAME PAUSED
        </h2>
        <p className="text-xs font-bold text-slate-600 uppercase mt-1 mb-4">
          Current Score: <span className="font-title text-base text-slate-900">{score}</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              sounds.playSelect();
              onResume();
            }}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-title text-lg tracking-wide rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>RESUME</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelect();
              onRestart();
            }}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-title text-base tracking-wide rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>RESTART</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelect();
              onHome();
            }}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-title text-sm tracking-wide rounded-2xl border-3 border-slate-900 shadow-[0_3px_0_0_#0F172A] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
