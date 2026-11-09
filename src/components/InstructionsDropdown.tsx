import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Award, Zap, Shield, ArrowRight } from 'lucide-react';
import { sounds } from '../game/audio';

export const InstructionsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    sounds.playSelect();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-md mx-auto my-1">
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-lg rounded-2xl border-4 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-slate-900 fill-amber-200" />
          <span className="font-title tracking-wide">HOW TO PLAY</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm bg-slate-900/10 px-2.5 py-1 rounded-xl">
          <span>{isOpen ? 'Close' : 'View Rules'}</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-2.5 p-4 bg-amber-50 border-4 border-slate-900 rounded-2xl shadow-[0_4px_0_0_#0F172A] text-slate-800 text-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 border-2 border-emerald-500 rounded-xl text-emerald-700 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Forward Progress = Points</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Earn 1 point for every new step forward! If you take a step back and step forward again, you will not receive repeat points for spots you already explored.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 border-2 border-amber-500 rounded-xl text-amber-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">+10 Bonus per Road Cross</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every road features a line of 4 car lanes. Dodge all 4 cars and reach the next safe pavement to earn a whopping +10 road cross bonus!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 border-2 border-blue-500 rounded-xl text-blue-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Controls & Speed Ramp</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use the 4 on-screen arrow buttons or keyboard <span className="font-mono font-bold bg-white px-1 border border-slate-300 rounded">W A S D</span> / <span className="font-mono font-bold bg-white px-1 border border-slate-300 rounded">Arrows</span>. Vehicles speed up as you advance!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
