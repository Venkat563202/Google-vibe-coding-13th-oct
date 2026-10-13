import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  MapPin,
  Car,
  Navigation,
  CheckCircle2,
  Trophy,
  Plus,
  Share2,
  AlertCircle,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp,
  UserPlus
} from 'lucide-react';
import { VotingRoom, RestaurantSpot, DistanceFilter } from '../types';
import { HYDERABADI_EMPTY_STATE } from '../data/restaurants';

interface VotingRoomViewProps {
  room: VotingRoom;
  onVote: (spotId: string) => void;
  onSimulateFriendVote: (spotId: string) => void;
  onFinishVoting: () => void;
  onOpenAddSpot: () => void;
  onOpenShare: () => void;
  onLoadTestPreset: () => void;
  voterName: string;
}

export const VotingRoomView: React.FC<VotingRoomViewProps> = ({
  room,
  onVote,
  onSimulateFriendVote,
  onFinishVoting,
  onOpenAddSpot,
  onOpenShare,
  onLoadTestPreset,
  voterName,
}) => {
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [expandedIntelId, setExpandedIntelId] = useState<string | null>(null);

  // Timer countdown hook
  useEffect(() => {
    if (!room.expiresAt) {
      setTimeLeftSeconds(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((room.expiresAt! - now) / 1000));
      setTimeLeftSeconds(diff);

      if (diff === 0 && room.status === 'active') {
        // Automatically finish voting when timer runs out!
        onFinishVoting();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room.expiresAt, room.status, onFinishVoting]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter spots by distance
  const filteredSpots = room.spots.filter((spot) => {
    if (distanceFilter === 'all') return true;
    return spot.distanceKm <= distanceFilter;
  });

  // Total votes cast across all spots
  const totalVotesCast = room.spots.reduce((sum, s) => sum + s.votes, 0);

  // Identify current leader
  const highestVotes = Math.max(0, ...room.spots.map((s) => s.votes));
  const leadingSpotId = highestVotes > 0 ? room.spots.find((s) => s.votes === highestVotes)?.id : null;

  // Selected spot details
  const myVotedSpot = room.spots.find((s) => s.id === room.userVoteId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 pb-32">
      {/* Room Information Bar */}
      <div className="bg-[#171722]/95 border border-[#272738] rounded-2xl p-4 md:p-6 mb-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Live Battle Arena
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">Host: {room.hostName}</span>
            </div>
            <h1 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
              {room.roomName}
            </h1>
          </div>

          {/* Right side metrics: Timer & Voters */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Timer Display */}
            {timeLeftSeconds !== null ? (
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border tabular-nums transition-all ${
                  timeLeftSeconds <= 30
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    : 'bg-[#111118] text-amber-300 border-amber-500/30'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold leading-none">Time Left</div>
                  <div className="text-base font-extrabold tracking-tight font-mono">
                    {formatTime(timeLeftSeconds)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-[#272738] text-slate-300 text-xs">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Unlimited Time</span>
              </div>
            )}

            {/* Total votes */}
            <div className="px-3.5 py-2 rounded-xl bg-[#111118] border border-[#272738] text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold leading-none">Votes Cast</div>
              <div className="text-base font-extrabold text-white tabular-nums">{totalVotesCast}</div>
            </div>

            {/* Share CTA */}
            <button
              onClick={onOpenShare}
              className="p-2.5 rounded-xl bg-[#1D1D2B] hover:bg-[#252538] border border-[#2E2E42] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Share Room / Results"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voting Status Kicker */}
        <div className="mt-4 pt-3 border-t border-[#232332] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Voting as <strong className="text-white">{voterName}</strong>
            </span>
            {myVotedSpot ? (
              <span className="text-amber-300">
                · You voted for <strong className="text-white">{myVotedSpot.name}</strong>
              </span>
            ) : (
              <span className="text-orange-400 italic">· You haven't voted yet, miyan!</span>
            )}
          </div>
          <button
            onClick={onOpenAddSpot}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another spot</span>
          </button>
        </div>
      </div>

      {/* Distance Filter Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#15151F] border border-[#242434] rounded-xl overflow-x-auto">
          {[
            { id: 'all' as DistanceFilter, label: 'All Distances' },
            { id: 3 as DistanceFilter, label: 'Within 3 km' },
            { id: 5 as DistanceFilter, label: 'Within 5 km' },
            { id: 10 as DistanceFilter, label: 'Within 10 km' },
          ].map((tab) => {
            const count = room.spots.filter((s) => tab.id === 'all' || s.distanceKm <= tab.id).length;
            const isActive = distanceFilter === tab.id;
            return (
              <button
                key={String(tab.id)}
                type="button"
                onClick={() => setDistanceFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E1E2C]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isActive ? 'bg-amber-600/30 text-slate-950 font-bold' : 'bg-[#222230] text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 self-end sm:self-auto">
          <span>Showing <strong className="text-white tabular-nums">{filteredSpots.length}</strong> of <strong className="text-white tabular-nums">{room.spots.length}</strong> spots</span>
        </div>
      </div>

      {/* EMPTY STATE (When SECRET_LOCAL_SPOTS is empty and no spots added yet) */}
      {room.spots.length === 0 ? (
        <div className="bg-[#171722]/90 border border-[#2D2D40] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-lg">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 fill-amber-400/20 text-amber-400" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            Challenge Data Rule Active
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {HYDERABADI_EMPTY_STATE.headline}
          </h2>

          <p className="text-slate-300 text-sm md:text-base max-w-lg mx-auto mb-2 leading-relaxed">
            {HYDERABADI_EMPTY_STATE.subtext}
          </p>

          <p className="text-amber-400 text-xs font-semibold italic mb-8">
            "{HYDERABADI_EMPTY_STATE.slangPunch}"
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={onOpenAddSpot}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Secret Spot to Battle</span>
            </button>
            <button
              onClick={onLoadTestPreset}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#20202E] hover:bg-[#28283C] text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Load 6 Spots Preview</span>
            </button>
          </div>

          {/* Developer guidance note */}
          <div className="mt-8 pt-6 border-t border-[#242436] text-[11px] text-slate-400 max-w-md mx-auto text-left space-y-1">
            <p className="font-mono text-slate-300">
              💡 Code Location: <span className="text-amber-300">/src/data/restaurants.ts</span>
            </p>
            <p>
              Paste your curated list inside <code className="text-amber-300 font-mono">SECRET_LOCAL_SPOTS = [...]</code> and they will automatically load here!
            </p>
          </div>
        </div>
      ) : filteredSpots.length === 0 ? (
        /* Empty state when filter doesn't match any */
        <div className="p-8 text-center bg-[#151520] border border-[#252535] rounded-2xl">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white mb-1">No spots within {distanceFilter} km</h3>
          <p className="text-xs text-slate-400 mb-4">
            Arey ustaad, is range mein koi biryani adda nahi hai! Radius thoda badao ya naya spot add karo.
          </p>
          <button
            onClick={() => setDistanceFilter('all')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 cursor-pointer"
          >
            Show All Spots
          </button>
        </div>
      ) : (
        /* RESTAURANT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpots.map((spot) => {
            const isMyVote = room.userVoteId === spot.id;
            const isLeading = spot.id === leadingSpotId && spot.votes > 0;
            const votePercentage = totalVotesCast > 0 ? Math.round((spot.votes / totalVotesCast) * 100) : 0;
            const isIntelOpen = expandedIntelId === spot.id;

            return (
              <div
                key={spot.id}
                className={`relative bg-[#161622] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isMyVote
                    ? 'border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'border-[#262638] hover:border-slate-600'
                }`}
              >
                {/* Leader Ribbon */}
                {isLeading && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider py-1 px-3 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Current Battle Leader
                    </span>
                    <span className="font-mono">{votePercentage}% of votes</span>
                  </div>
                )}

                {/* Card Main Body */}
                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-display text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                        {spot.name}
                      </h3>
                      {/* Quiet Unboxed Metadata per Zero-Pill discipline */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{spot.area}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="tabular-nums font-medium text-emerald-400">
                          {spot.distanceKm} km
                        </span>
                      </div>
                    </div>

                    {/* Big Bold Vote Counter */}
                    <div className="text-right shrink-0 bg-[#111117] px-3 py-1.5 rounded-xl border border-[#272738]">
                      <div className="font-display font-black text-2xl text-white tabular-nums leading-none">
                        {spot.votes}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                        {spot.votes === 1 ? 'vote' : 'votes'}
                      </div>
                    </div>
                  </div>

                  {/* Specialty Dish */}
                  {spot.specialty && (
                    <div className="text-xs text-amber-200/90 font-medium my-2 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10">
                      🍲 <span className="italic">{spot.specialty}</span>
                    </div>
                  )}

                  {/* Vote Progress Bar */}
                  <div className="w-full bg-[#111117] h-2 rounded-full overflow-hidden mt-3 mb-2">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isMyVote
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-slate-600 to-slate-400'
                      }`}
                      style={{ width: `${votePercentage}%` }}
                    />
                  </div>

                  {/* Hyderabadi Ground Intel Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedIntelId(isIntelOpen ? null : spot.id)}
                    className="w-full mt-2 pt-2 border-t border-[#222230] flex items-center justify-between text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-1">
                      <span>Hyderabadi Ground Intel</span>
                      {(spot.parkingAlert || spot.trafficAlert) && (
                        <span className="text-[10px] text-amber-400 font-bold">•</span>
                      )}
                    </span>
                    {isIntelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Intel Content (Slang Parking & Traffic Warnings) */}
                  {isIntelOpen && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#101016] border border-[#232332] text-xs space-y-2.5 animate-in fade-in duration-150">
                      {spot.parkingAlert && (
                        <div className="flex items-start gap-2">
                          <Car className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-amber-300 font-semibold block">Parking Alert:</span>
                            <span className="text-slate-300 italic">{spot.parkingAlert}</span>
                          </div>
                        </div>
                      )}

                      {spot.trafficAlert && (
                        <div className="flex items-start gap-2">
                          <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-emerald-300 font-semibold block">Traffic Route:</span>
                            <span className="text-slate-300 italic">{spot.trafficAlert}</span>
                          </div>
                        </div>
                      )}

                      {spot.khansamaNote && (
                        <div className="text-[11px] text-slate-400 border-t border-[#1C1C28] pt-1.5">
                          <strong className="text-slate-300">Khansama Advice:</strong> {spot.khansamaNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-[#12121A] border-t border-[#222232] flex items-center gap-2">
                  {/* Primary Vote Button */}
                  <button
                    onClick={() => onVote(spot.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isMyVote
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/10 active:scale-95'
                    }`}
                  >
                    {isMyVote ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Voted! (Tap to change)</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 fill-slate-950" />
                        <span>Vote For This Spot</span>
                      </>
                    )}
                  </button>

                  {/* Simulate Friend Vote Button (To test multi-voter wars!) */}
                  <button
                    onClick={() => onSimulateFriendVote(spot.id)}
                    className="p-2.5 rounded-xl bg-[#1B1B26] hover:bg-[#252536] border border-[#2B2B3E] text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                    title="Simulate a friend's vote for this spot (+1)"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Sticky Action Bar (Ergonomic Thumb-Zone) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-[#111118]/95 backdrop-blur-md border-t border-[#232332]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] text-slate-400 leading-tight">Your Choice:</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {myVotedSpot ? myVotedSpot.name : 'No spot voted yet, ustaad!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1C1C28] hover:bg-[#262638] text-slate-300 text-xs font-semibold border border-[#2B2B3E] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Battle</span>
            </button>

            <button
              onClick={onFinishVoting}
              className="py-2.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>Declare Winner!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
