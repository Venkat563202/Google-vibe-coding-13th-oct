import React from 'react';
import { Flame, Plus, RotateCcw, Share2 } from 'lucide-react';

interface HeaderProps {
  onNewWar: () => void;
  onOpenAddSpot: () => void;
  onOpenShare?: () => void;
  isInRoom: boolean;
  roomName?: string;
  onResetRoom?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewWar,
  onOpenAddSpot,
  onOpenShare,
  isInRoom,
  roomName,
  onResetRoom,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#121217]/95 backdrop-blur-md border-b border-[#23232E] px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20 text-white">
            <Flame className="w-5 h-5 fill-amber-200 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                Biryani Wars
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wide uppercase">
                Hyderabad
              </span>
            </div>
            {isInRoom && roomName && (
              <p className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-[240px]">
                Arena: <span className="text-amber-200 font-medium">{roomName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links / Actions */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onOpenAddSpot}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-500" />
            <span>Add Secret Spot</span>
          </button>
          {isInRoom && onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share Summary</span>
            </button>
          )}
          {isInRoom && onResetRoom && (
            <button
              onClick={onResetRoom}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors whitespace-nowrap cursor-pointer"
              title="Reset current war"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Arena</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddSpot}
            className="md:hidden p-2 rounded-lg bg-[#1E1E28] hover:bg-[#282836] text-amber-400 border border-[#2E2E3E] transition-colors"
            title="Add Spot"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onNewWar}
            className="px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>{isInRoom ? 'New War' : 'Start War'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
