import React from 'react';
import { RotateCcw, Home, Trophy, Award, Zap } from 'lucide-react';
import { sounds } from '../game/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  roadsCrossed: number;
  maxForwardSteps: number;
  isNewHigh: boolean;
  onReplay: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  roadsCrossed,
  maxForwardSteps,
  isNewHigh,
  onReplay,
  onHome,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 select-none"
    >
      <div className="relative w-full max-w-md bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-[0_8px_0_0_#0F172A] p-6 text-center overflow-hidden">
        {/* Animated background stripes */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-rose-500 border-b-2 border-slate-900" />

        {/* Bold Red "GAME OVER" as requested */}
        <div className="mt-2 mb-4">
          <h2
            id="game-over-title"
            className="font-title text-4xl sm:text-5xl text-red-600 tracking-wider uppercase font-black filter drop-shadow-[0_4px_0_#0F172A] [text-shadow:_-2px_-2px_0_#0F172A,_2px_-2px_0_#0F172A,_-2px_2px_0_#0F172A,_2px_2px_0_#0F172A]"
          >
            GAME OVER
          </h2>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">
            Bumper to Bumper Collision!
          </p>
        </div>

        {/* Score Display (Right below Game Over as requested) */}
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[0_4px_0_0_#0F172A] mb-4">
          <div className="text-xs font-pixel text-slate-500 uppercase tracking-widest mb-1">
            FINAL SCORE
          </div>
          <div className="font-title text-5xl sm:text-6xl text-slate-950 leading-none tabular-nums">
            {score}
          </div>

          {isNewHigh && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400 border-2 border-slate-900 px-3 py-1 rounded-full text-slate-950 font-bold text-xs uppercase shadow-xs animate-bounce">
              <Trophy className="w-4 h-4 fill-amber-600" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}
        </div>

        {/* Run Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          <div className="bg-amber-100/80 border-2 border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Roads Crossed</div>
              <div className="font-title text-lg text-slate-900">{roadsCrossed} (+{roadsCrossed * 10} pts)</div>
            </div>
          </div>

          <div className="bg-sky-100/80 border-2 border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">All-Time Best</div>
              <div className="font-title text-lg text-slate-900">{highScore}</div>
            </div>
          </div>
        </div>

        {/* Actions: Replay & Return to Home */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Replay Button */}
          <button
            onClick={() => {
              sounds.playSelect();
              onReplay();
            }}
            data-start="true"
            className="flex-1 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-title text-xl tracking-wider rounded-2xl border-4 border-slate-900 shadow-[0_5px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex items-center justify-center gap-2.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" />
            <span>PLAY AGAIN</span>
          </button>

          {/* Return to Home Button */}
          <button
            onClick={() => {
              sounds.playSelect();
              onHome();
            }}
            className="py-3.5 px-4 bg-sky-400 hover:bg-sky-300 text-slate-950 font-title text-base tracking-wide rounded-2xl border-4 border-slate-900 shadow-[0_5px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-5 h-5" />
            <span>HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
