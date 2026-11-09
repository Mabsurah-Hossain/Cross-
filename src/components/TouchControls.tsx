import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { sounds } from '../game/audio';

interface TouchControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onMove }) => {
  const handlePress = (direction: 'up' | 'down' | 'left' | 'right', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.playHop();
    onMove(direction);
  };

  return (
    <div
      className="pointer-events-auto select-none touch-none flex flex-col items-center gap-1.5 p-2 bg-slate-900/40 backdrop-blur-xs rounded-3xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A]"
      aria-label="Directional arrow controls panel"
    >
      {/* Up Button (Forward) */}
      <button
        onPointerDown={(e) => handlePress('up', e)}
        aria-label="Move Forward"
        className="w-14 h-13 sm:w-16 sm:h-14 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex flex-col items-center justify-center cursor-pointer transition-all"
      >
        <ArrowUp className="w-6 h-6 stroke-[3]" />
        <span className="text-[9px] font-pixel font-bold uppercase tracking-tighter leading-none mt-0.5">
          UP
        </span>
      </button>

      {/* Middle Row: Left, Center Accent, Right */}
      <div className="flex items-center gap-1.5">
        {/* Left Button */}
        <button
          onPointerDown={(e) => handlePress('left', e)}
          aria-label="Move Left"
          className="w-14 h-13 sm:w-16 sm:h-14 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-pixel font-bold uppercase tracking-tighter leading-none mt-0.5">
            LEFT
          </span>
        </button>

        {/* Center Pad Hub Icon */}
        <div className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-amber-400 shadow-inner">
          CROSS
        </div>

        {/* Right Button */}
        <button
          onPointerDown={(e) => handlePress('right', e)}
          aria-label="Move Right"
          className="w-14 h-13 sm:w-16 sm:h-14 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <ArrowRight className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-pixel font-bold uppercase tracking-tighter leading-none mt-0.5">
            RIGHT
          </span>
        </button>
      </div>

      {/* Down Button (Back) */}
      <button
        onPointerDown={(e) => handlePress('down', e)}
        aria-label="Move Back"
        className="w-14 h-13 sm:w-16 sm:h-14 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] flex flex-col items-center justify-center cursor-pointer transition-all"
      >
        <ArrowDown className="w-6 h-6 stroke-[3]" />
        <span className="text-[9px] font-pixel font-bold uppercase tracking-tighter leading-none mt-0.5">
          DOWN
        </span>
      </button>
    </div>
  );
};
