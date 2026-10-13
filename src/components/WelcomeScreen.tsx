import React, { useState } from 'react';
import { Flame, Clock, Users, MapPin, Sparkles, ArrowRight, Play } from 'lucide-react';
import { VotingRoom } from '../types';

interface WelcomeScreenProps {
  onStartWar: (config: {
    roomName: string;
    hostName: string;
    durationSeconds: number;
    initialRadius: number | 'all';
  }) => void;
  existingRoom: VotingRoom | null;
  onResumeWar: () => void;
  availableSpotsCount: number;
  onOpenAddSpot: () => void;
  onLoadTestPreset: () => void;
}

const ROOM_NAME_PRESETS = [
  'Friday Dum Squad 🍗',
  'Midnight Zafran Adda 🌙',
  'Old City Biryani Crawl 🕌',
  'Techies @ Hitec City Feast 💻',
  'Sunday Family Dawat 👑',
];

const TIMER_OPTIONS = [
  { label: '1 Min', sub: 'Lightning Dum', seconds: 60 },
  { label: '3 Mins', sub: 'Quick Vote', seconds: 180 },
  { label: '5 Mins', sub: 'Squad Debate', seconds: 300, popular: true },
  { label: '10 Mins', sub: 'Relaxed Dawat', seconds: 600 },
  { label: 'No Limit', sub: 'Manual End', seconds: 0 },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartWar,
  existingRoom,
  onResumeWar,
  availableSpotsCount,
  onOpenAddSpot,
  onLoadTestPreset,
}) => {
  const [roomName, setRoomName] = useState('Friday Dum Squad 🍗');
  const [hostName, setHostName] = useState('Mawa Ustaad');
  const [selectedTimer, setSelectedTimer] = useState<number>(300);
  const [initialRadius, setInitialRadius] = useState<number | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    onStartWar({
      roomName: roomName.trim(),
      hostName: hostName.trim() || 'Ustaad',
      durationSeconds: selectedTimer,
      initialRadius,
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between">
      {/* Background Hero Banner with High Contrast Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/biryani_hero_handi_1791879713480.jpg"
          alt="Hyderabadi Clay Handi Dum Biryani"
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101014]/80 via-[#101014]/90 to-[#101014]" />
        {/* Warm saffron ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Resume Active War Banner if existing */}
        {existingRoom && (
          <div className="mb-6 p-4 rounded-2xl bg-[#1A1A24]/90 border border-amber-500/30 backdrop-blur-md flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Active Battle Found</p>
                <h4 className="text-sm md:text-base font-bold text-white truncate">{existingRoom.roomName}</h4>
                <p className="text-xs text-slate-400">
                  {existingRoom.spots.length} spots · {existingRoom.voterCount} votes cast
                </p>
              </div>
            </div>
            <button
              onClick={onResumeWar}
              className="px-4 py-2 text-xs md:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 shrink-0 cursor-pointer"
            >
              Resume War →
            </button>
          </div>
        )}

        {/* Hero Copy */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Authentic Hyderabadi Showdown</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Friends can't decide where to eat?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
              Start a Biryani War!
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            No more endless WhatsApp arguments or hungry standoffs. Create a voting room, filter by distance, cast your vote, and crown Hyderabad's true biryani king!
          </p>
        </div>

        {/* War Room Setup Form */}
        <div className="bg-[#171720]/95 backdrop-blur-xl border border-[#272736] rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top saffron accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name & Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>War Room Name</span>
                </label>
                <span className="text-[11px] text-amber-400/90 font-medium">Custom Name or Preset</span>
              </div>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Friday Dum Squad, Tolichowki Boys Dawat..."
                className="w-full px-4 py-3 bg-[#111117] border border-[#2B2B3D] focus:border-amber-500 focus:outline-none rounded-xl text-white placeholder-slate-500 text-sm md:text-base font-medium transition-colors"
                required
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {ROOM_NAME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRoomName(preset)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      roomName === preset
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-[#121218] text-slate-400 border-[#252533] hover:text-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Voter / Host Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Your Name (Voter)</span>
                </label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Mawa, Adnan, Sameer, Pooja..."
                  className="w-full px-4 py-3 bg-[#111117] border border-[#2B2B3D] focus:border-amber-500 focus:outline-none rounded-xl text-white placeholder-slate-500 text-sm font-medium transition-colors"
                  required
                />
              </div>

              {/* Initial Radius Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Initial Distance Radius</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'All', value: 'all' as const },
                    { label: '3 km', value: 3 },
                    { label: '5 km', value: 5 },
                    { label: '10 km', value: 10 },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => setInitialRadius(option.value)}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        initialRadius === option.value
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-[#111117] text-slate-400 border-[#2B2B3D] hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voting Countdown Timer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Voting Countdown Timer</span>
                </label>
                <span className="text-[11px] text-slate-400">Timer closes voting automatically</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TIMER_OPTIONS.map((timer) => (
                  <button
                    key={timer.seconds}
                    type="button"
                    onClick={() => setSelectedTimer(timer.seconds)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      selectedTimer === timer.seconds
                        ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 text-white border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#111117] text-slate-400 border-[#2B2B3D] hover:border-slate-600'
                    }`}
                  >
                    {timer.popular && (
                      <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                        Popular
                      </span>
                    )}
                    <div className="font-display font-bold text-sm text-white">{timer.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{timer.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Secret Spots Status Notification */}
            <div className="p-3.5 rounded-xl bg-[#111117] border border-[#2B2B3B] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-slate-300">
                  <strong className="text-amber-300 tabular-nums">{availableSpotsCount}</strong> local spots ready in arena pool
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAddSpot}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  + Add Spot
                </button>
                {availableSpotsCount === 0 && (
                  <>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={onLoadTestPreset}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      Load Sample Preview
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-display font-black text-lg md:text-xl tracking-tight shadow-xl shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Biryani War</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Hyderabad Street Slang Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-400 max-w-lg mx-auto">
          <p className="italic">
            "Arey miyan, late nakko karo, 10 baje tak zafrani dum pot khatam ho jata!"
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Built with pure Hyderabadi passion · Zero compromise on masala
          </p>
        </div>
      </div>
    </div>
  );
};
