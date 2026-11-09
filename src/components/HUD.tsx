import React from 'react';
import { Trophy, Volume2, VolumeX, Pause, Play, Award, Zap } from 'lucide-react';
import { Avatar, Difficulty } from '../game/types';
import { sounds } from '../game/audio';

interface HUDProps {
  score: number;
  highScore: number;
  roadsCrossed: number;
  difficulty: Difficulty;
  avatar: Avatar;
  isPaused: boolean;
  isMuted: boolean;
  roadCrossNotice: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  roadsCrossed,
  difficulty,
  avatar,
  isPaused,
  isMuted,
  roadCrossNotice,
  onTogglePause,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Bar Cluster */}
      <header className="flex items-start justify-between w-full max-w-5xl mx-auto gap-2">
        {/* Left: Score & Roads Crossed */}
        <div className="flex flex-col gap-2">
          {/* Main Score Readout */}
          <div className="pointer-events-auto flex items-center gap-3 bg-white/95 border-3 border-slate-900 px-3.5 py-2 rounded-2xl shadow-[0_4px_0_0_#0F172A]">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-slate-900 shadow-xs shrink-0"
              style={{ backgroundColor: avatar.accentColor }}
            >
              {avatar.emoji}
            </div>
            <div>
              <div className="text-[10px] font-pixel text-slate-500 uppercase tracking-wider">
                SCORE
              </div>
              <div className="font-title text-2xl sm:text-3xl text-slate-950 leading-none tabular-nums">
                {score}
              </div>
            </div>
          </div>

          {/* Roads Crossed & High Score Badges */}
          <div className="flex items-center gap-2">
            <div className="pointer-events-auto flex items-center gap-1.5 bg-amber-400 border-2 border-slate-900 px-2.5 py-1 rounded-xl shadow-[0_2px_0_0_#0F172A] text-slate-950">
              <Award className="w-4 h-4 fill-amber-600 text-slate-900" />
              <span className="font-bold text-xs">
                ROADS: <span className="font-title text-sm">{roadsCrossed}</span>
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 bg-sky-200 border-2 border-slate-900 px-2.5 py-1 rounded-xl shadow-[0_2px_0_0_#0F172A] text-slate-900">
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-bold text-xs">
                BEST: <span className="font-title text-sm">{highScore}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Road Cross Celebration Banner */}
        {roadCrossNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce">
            <div className="bg-emerald-400 border-4 border-slate-900 px-5 py-2.5 rounded-2xl shadow-[0_6px_0_0_#0F172A] flex items-center gap-2 text-slate-950 font-title text-base sm:text-lg tracking-wide">
              <Zap className="w-5 h-5 fill-yellow-300 text-slate-900" />
              <span>ROAD CROSSED! +10 PTS</span>
            </div>
          </div>
        )}

        {/* Right: Difficulty badge, Audio toggle & Pause button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Difficulty pill */}
          <div className="hidden sm:flex items-center bg-slate-800 text-amber-300 border-2 border-slate-900 px-2.5 py-1.5 rounded-xl font-pixel text-[10px] uppercase shadow-[0_2px_0_0_#0F172A]">
            {difficulty}
          </div>

          {/* Mute button */}
          <button
            onClick={() => {
              sounds.playSelect();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-900 border-3 border-slate-900 rounded-2xl shadow-[0_3px_0_0_#0F172A] active:translate-y-1 active:shadow-none cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          {/* Pause button */}
          <button
            onClick={() => {
              sounds.playSelect();
              onTogglePause();
            }}
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
            className="p-2.5 bg-amber-300 hover:bg-amber-200 text-slate-900 border-3 border-slate-900 rounded-2xl shadow-[0_3px_0_0_#0F172A] active:translate-y-1 active:shadow-none cursor-pointer transition-all"
          >
            {isPaused ? <Play className="w-5 h-5 fill-slate-900" /> : <Pause className="w-5 h-5 fill-slate-900" />}
          </button>
        </div>
      </header>
    </div>
  );
};
