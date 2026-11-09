import React from 'react';
import { X, Check } from 'lucide-react';
import { AVATARS } from '../game/avatars';
import { Avatar } from '../game/types';
import { sounds } from '../game/audio';

interface AvatarModalProps {
  currentAvatar: Avatar;
  onSelect: (avatar: Avatar) => void;
  onClose: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  currentAvatar,
  onSelect,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-[0_8px_0_0_#0F172A] p-6 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-300">
          <div>
            <h2 id="avatar-dialog-title" className="font-title text-2xl md:text-3xl text-slate-900 tracking-wide">
              CHOOSE YOUR HERO
            </h2>
            <p className="text-sm font-medium text-slate-600">Pick from 10 cartoonish road crossing legends!</p>
          </div>
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
            }}
            aria-label="Close character selection"
            className="p-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl border-3 border-slate-900 shadow-[0_3px_0_0_#0F172A] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Avatar Grid (10 cartoonish characters) */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-1">
          {AVATARS.map((avatar, index) => {
            const isSelected = avatar.id === currentAvatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => {
                  sounds.playSelect();
                  onSelect(avatar);
                }}
                className={`relative flex items-center gap-4 p-3.5 rounded-2xl border-3 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-amber-200 border-amber-600 shadow-[0_4px_0_0_#D97706] scale-[1.02]'
                    : 'bg-white border-slate-800 hover:bg-amber-100/60 shadow-[0_3px_0_0_#0F172A] active:translate-y-0.5'
                }`}
              >
                {/* Avatar Icon Container with colorful accent */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-3 border-slate-900 shadow-[0_2px_0_0_#0F172A] shrink-0"
                  style={{ backgroundColor: avatar.accentColor }}
                >
                  <span className="transform hover:scale-125 transition-transform duration-150">
                    {avatar.emoji}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-base truncate">
                      {avatar.name}
                    </span>
                    {index === 0 && (
                      <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-amber-700 truncate">{avatar.tagline}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                    {avatar.description}
                  </p>
                </div>

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 bg-emerald-500 text-white rounded-full border-2 border-slate-900 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t-2 border-slate-300 flex justify-end">
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
            }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-title text-base rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_0_#0F172A] active:translate-y-1 active:shadow-[0_1px_0_0_#0F172A] cursor-pointer transition-all"
          >
            CONFIRM SELECTION
          </button>
        </div>
      </div>
    </div>
  );
};
