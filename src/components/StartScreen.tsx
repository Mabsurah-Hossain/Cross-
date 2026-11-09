import React, { useState } from 'react';
import { Trophy, Play, User, Sparkles, Volume2, VolumeX, Flame } from 'lucide-react';
import { Avatar, Difficulty } from '../game/types';
import { DIFFICULTY_PRESETS } from '../game/rules';
import { AvatarModal } from './AvatarModal';
import { InstructionsDropdown } from './InstructionsDropdown';
import { sounds } from '../game/audio';

interface StartScreenProps {
  currentAvatar: Avatar;
  difficulty: Difficulty;
  highScore: number;
  onSelectAvatar: (avatar: Avatar) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  currentAvatar,
  difficulty,
  highScore,
  onSelectAvatar,
  onSelectDifficulty,
  onStartGame,
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-6 md:py-8 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 overflow-x-hidden select-none">
      {/* Cartoon City Skyline & Cloud Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-85">
        {/* Pixel style cartoon clouds drifting */}
        <div className="absolute top-6 left-10 w-28 h-12 bg-white/80 rounded-full border-3 border-slate-900 shadow-[0_3px_0_0_#0F172A] animate-pulse" />
        <div className="absolute top-14 right-1/4 w-36 h-14 bg-white/70 rounded-full border-3 border-slate-900 shadow-[0_3px_0_0_#0F172A]" />
        <div className="absolute top-28 left-1/3 w-24 h-10 bg-white/60 rounded-full border-3 border-slate-900 shadow-[0_2px_0_0_#0F172A]" />

        {/* City buildings silhouette along bottom/middle */}
        <div className="absolute bottom-16 left-0 right-0 flex items-end justify-around opacity-40">
          <div className="w-16 h-36 bg-indigo-900/60 rounded-t-lg border-2 border-slate-900" />
          <div className="w-24 h-52 bg-purple-900/60 rounded-t-lg border-2 border-slate-900" />
          <div className="w-20 h-44 bg-blue-900/60 rounded-t-lg border-2 border-slate-900" />
          <div className="w-28 h-60 bg-emerald-900/60 rounded-t-lg border-2 border-slate-900 hidden md:block" />
          <div className="w-20 h-40 bg-pink-900/60 rounded-t-lg border-2 border-slate-900 hidden sm:block" />
          <div className="w-24 h-48 bg-amber-900/60 rounded-t-lg border-2 border-slate-900" />
        </div>

        {/* Road line preview at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-800 border-t-4 border-slate-900 flex items-center justify-around">
          <div className="w-12 h-3 bg-amber-400 rounded-sm" />
          <div className="w-12 h-3 bg-amber-400 rounded-sm" />
          <div className="w-12 h-3 bg-amber-400 rounded-sm" />
          <div className="w-12 h-3 bg-amber-400 rounded-sm" />
          <div className="w-12 h-3 bg-amber-400 rounded-sm hidden sm:block" />
        </div>
      </div>

      {/* Top Header Row: High Score on Left, Audio toggle, and Current Avatar Preview on Right */}
      <header className="relative z-10 w-full max-w-5xl flex items-start justify-between gap-4">
        {/* High Score Area */}
        <div className="flex items-center gap-3 bg-amber-300 border-4 border-slate-900 px-4 py-2.5 rounded-2xl shadow-[0_5px_0_0_#0F172A] transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="p-1.5 bg-amber-400 rounded-xl border-2 border-slate-900 text-amber-900">
            <Trophy className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-[11px] font-pixel tracking-wider text-slate-800 uppercase">
              HIGH SCORE
            </div>
            <div className="font-title text-2xl text-slate-900 leading-none">
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right Corner: Sound Toggle + Current Avatar Display (as requested by user) */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-3 bg-white hover:bg-slate-100 text-slate-900 border-3 border-slate-900 rounded-2xl shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-rose-500" /> : <Volume2 className="w-6 h-6 text-emerald-600" />}
          </button>

          {/* Current Avatar Card on Right Corner */}
          <div
            onClick={() => setIsAvatarModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsAvatarModalOpen(true)}
            className="flex items-center gap-2.5 bg-white border-4 border-slate-900 px-3.5 py-2 rounded-2xl shadow-[0_5px_0_0_#0F172A] cursor-pointer hover:bg-amber-50 transition-all group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-3 border-slate-900 shadow-[0_2px_0_0_#0F172A] group-hover:scale-110 transition-transform"
              style={{ backgroundColor: currentAvatar.accentColor }}
            >
              <span>{currentAvatar.emoji}</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ACTIVE HERO
              </div>
              <div className="font-bold text-slate-900 text-sm leading-tight truncate max-w-[120px]">
                {currentAvatar.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Stage: Spacious Title, Instructions, Start & Difficulty */}
      <main className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto py-4 space-y-5">
        {/* Title Lockup "CROSS!" */}
        <div className="relative py-2">
          {/* Decorative cartoon road stripes behind title */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 h-8 bg-amber-400/80 -rotate-3 rounded-lg border-3 border-slate-900 pointer-events-none" />
          <h1 className="relative font-title text-6xl sm:text-7xl md:text-8xl text-yellow-300 tracking-wider uppercase stroke-slate-900 filter drop-shadow-[0_6px_0_#0F172A] [text-shadow:_-3px_-3px_0_#0F172A,_3px_-3px_0_#0F172A,_-3px_3px_0_#0F172A,_3px_3px_0_#0F172A]">
            CROSS!
          </h1>
          <p className="font-cartoon font-bold text-base sm:text-lg text-slate-800 tracking-wide mt-1 bg-white/80 px-4 py-1 rounded-full border-2 border-slate-900 inline-block shadow-[0_3px_0_0_#0F172A]">
            🚦 Dodge the Rush Hour Traffic! 🚸
          </p>
        </div>

        {/* Instructions Button with Dropdown Menu */}
        <InstructionsDropdown />

        {/* Difficulty Panel: Easy, Medium, Hard */}
        <div className="w-full max-w-md bg-white/95 border-4 border-slate-900 p-4 rounded-3xl shadow-[0_6px_0_0_#0F172A]">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-400" />
            <span className="font-title text-sm tracking-wider text-slate-900">
              CHOOSE DIFFICULTY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const active = difficulty === d;
              const meta = DIFFICULTY_PRESETS[d];
              let activeColor = 'bg-emerald-400 border-emerald-700 text-slate-900';
              if (d === 'medium') activeColor = 'bg-amber-400 border-amber-700 text-slate-900';
              if (d === 'hard') activeColor = 'bg-rose-500 border-rose-800 text-white';

              return (
                <button
                  key={d}
                  onClick={() => {
                    sounds.playSelect();
                    onSelectDifficulty(d);
                  }}
                  className={`py-2 px-1 rounded-2xl border-3 font-title text-sm tracking-wide transition-all cursor-pointer ${
                    active
                      ? `${activeColor} shadow-[0_4px_0_0_#0F172A] scale-105`
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {meta.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          <p className="text-[12px] text-slate-600 mt-2 font-medium">
            {DIFFICULTY_PRESETS[difficulty].description}
          </p>
        </div>

        {/* Buttons Row: Start Game & Choose Character */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3.5">
          {/* Start Game Button */}
          <button
            onClick={() => {
              sounds.playSelect();
              onStartGame();
            }}
            data-start="true"
            className="w-full sm:flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-title text-2xl tracking-wider rounded-2xl border-4 border-slate-900 shadow-[0_6px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_2px_0_0_#0F172A] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
            <span>START GAME</span>
          </button>

          {/* Choose a Character Button */}
          <button
            onClick={() => {
              sounds.playSelect();
              setIsAvatarModalOpen(true);
            }}
            className="w-full sm:w-auto py-4 px-5 bg-sky-400 hover:bg-sky-300 text-slate-900 font-title text-lg tracking-wide rounded-2xl border-4 border-slate-900 shadow-[0_6px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_2px_0_0_#0F172A] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-6 h-6" />
            <span>HEROES (10)</span>
          </button>
        </div>
      </main>

      {/* Bottom Text in smaller font: "Ready To Begin?" as requested */}
      <footer className="relative z-10 w-full text-center pb-2">
        <p className="font-cartoon font-bold text-slate-800 text-sm tracking-wider uppercase opacity-90">
          Ready To Begin?
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          Use W A S D / Arrow Keys or the On-Screen Arrow Pad to Move
        </p>
      </footer>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <AvatarModal
          currentAvatar={currentAvatar}
          onSelect={(avatar) => {
            onSelectAvatar(avatar);
            setIsAvatarModalOpen(false);
          }}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </div>
  );
};
