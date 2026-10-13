import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Share2,
  RotateCcw,
  MapPin,
  Car,
  Navigation,
  X,
  Sparkles,
  Flame
} from 'lucide-react';
import { VotingRoom, RestaurantSpot } from '../types';
import { HYDERABADI_VICTORY_MESSAGES } from '../data/restaurants';

interface WinnerRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: VotingRoom;
  onShareResult: () => void;
  onRestartWar: () => void;
}

export const WinnerRevealModal: React.FC<WinnerRevealModalProps> = ({
  isOpen,
  onClose,
  room,
  onShareResult,
  onRestartWar,
}) => {
  // Fire confetti on reveal
  useEffect(() => {
    if (isOpen) {
      // Golden saffron and mint festive confetti
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#F59E0B', '#F97316', '#10B981', '#FBBF24', '#EF4444'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine sorted spots by votes
  const sortedSpots = [...room.spots].sort((a, b) => b.votes - a.votes);
  const winner: RestaurantSpot | undefined = sortedSpots[0];
  const runnerUp: RestaurantSpot | undefined = sortedSpots[1];

  const totalVotes = room.spots.reduce((sum, s) => sum + s.votes, 0);
  const winnerPercentage = totalVotes > 0 && winner ? Math.round((winner.votes / totalVotes) * 100) : 0;

  // Pick Hyderabadi victory quote
  const victoryQuote = HYDERABADI_VICTORY_MESSAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#171724] border border-amber-500/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8">
        {/* Saffron & Gold decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Modal Top Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-white bg-[#101016]/80 hover:bg-[#20202E] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Crown Header */}
        <div className="p-6 md:p-8 text-center relative border-b border-[#28283C] bg-gradient-to-b from-[#1E1E2F] to-[#171724]">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl shadow-orange-500/30">
              <Crown className="w-10 h-10 fill-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </span>
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
            Hyderabad Biryani Sultan Crowned!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
            {winner ? winner.name : 'Tie Battle!'}
          </h2>

          {winner && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{winner.area}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">{winner.distanceKm} km away</span>
            </div>
          )}

          {/* Victory Metric Tag */}
          {winner && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mt-4">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-300" />
              <span>
                {winner.votes} {winner.votes === 1 ? 'Vote' : 'Votes'} ({winnerPercentage}% Majority)
              </span>
            </div>
          )}
        </div>

        {/* Victory Message & Ground Intel */}
        <div className="p-5 md:p-7 space-y-5 max-h-[50vh] overflow-y-auto">
          {/* Hyderabadi Style Victory Punch */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left">
            <h4 className="font-display font-bold text-amber-300 text-base md:text-lg mb-1 flex items-center gap-1.5">
              <span>{victoryQuote.headline}</span>
            </h4>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {victoryQuote.subtext}
            </p>
          </div>

          {/* Winner Ground Intel & Alerts */}
          {winner && (winner.parkingAlert || winner.trafficAlert) && (
            <div className="p-4 rounded-2xl bg-[#111118] border border-[#262638] space-y-2.5 text-xs">
              <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Winner Ground Intel (Hyderabad Street Advisory)</span>
              </h5>

              {winner.parkingAlert && (
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">Parking:</span>
                  <span className="text-slate-300 italic">{winner.parkingAlert}</span>
                </div>
              )}

              {winner.trafficAlert && (
                <div className="flex items-start gap-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 italic">{winner.trafficAlert}</span>
                </div>
              )}

              {winner.specialty && (
                <div className="pt-2 border-t border-[#222232] text-amber-200/90 font-medium">
                  <strong>Must Order:</strong> {winner.specialty}
                </div>
              )}
            </div>
          )}

          {/* Runner Up Notice */}
          {runnerUp && runnerUp.votes > 0 && (
            <div className="p-3.5 rounded-xl bg-[#12121B] border border-[#242436] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <span className="text-slate-400">Runner Up: </span>
                  <strong className="text-white">{runnerUp.name}</strong>
                  <span className="text-slate-500 text-[11px] block">{runnerUp.area}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white tabular-nums">{runnerUp.votes} votes</span>
                <span className="text-[10px] text-slate-400 block italic">Sharafat se 2nd!</span>
              </div>
            </div>
          )}

          {/* Complete Battle Vote Tally */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Squad Tally ({room.roomName})
            </h5>
            <div className="space-y-1.5">
              {sortedSpots.map((spot, index) => {
                const pct = totalVotes > 0 ? Math.round((spot.votes / totalVotes) * 100) : 0;
                return (
                  <div
                    key={spot.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#111118] border border-[#222232] text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 font-mono text-[11px] w-4">
                        #{index + 1}
                      </span>
                      <span className="text-slate-200 font-medium truncate">{spot.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-400 font-mono text-[11px]">{pct}%</span>
                      <span className="text-white font-bold tabular-nums bg-[#1E1E2C] px-2 py-0.5 rounded-md">
                        {spot.votes}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 md:p-6 border-t border-[#28283C] bg-[#14141E] flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onShareResult}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 fill-slate-950" />
            <span>Share Result Summary</span>
          </button>
          <button
            onClick={onRestartWar}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#1E1E2C] hover:bg-[#28283C] text-slate-300 hover:text-white font-semibold text-sm border border-[#2D2D42] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New War</span>
          </button>
        </div>
      </div>
    </div>
  );
};
