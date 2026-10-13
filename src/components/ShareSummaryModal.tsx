import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Flame } from 'lucide-react';
import { VotingRoom } from '../types';

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: VotingRoom;
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({
  isOpen,
  onClose,
  room,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sortedSpots = [...room.spots].sort((a, b) => b.votes - a.votes);
  const winner = sortedSpots[0];
  const runnerUp = sortedSpots[1];
  const totalVotes = room.spots.reduce((sum, s) => sum + s.votes, 0);

  // Generate WhatsApp-friendly formatted summary
  const summaryText = `🍗 *BIRYANI WARS — HYDERABAD* 🏆
━━━━━━━━━━━━━━━━━━━━
⚔️ *Arena:* ${room.roomName}
👑 *WINNER:* ${winner ? winner.name : 'Tie Battle'} (${winner ? winner.area : ''})
🔥 *Votes:* ${winner ? winner.votes : 0} of ${totalVotes} votes (${totalVotes > 0 && winner ? Math.round((winner.votes / totalVotes) * 100) : 0}%)
${runnerUp && runnerUp.votes > 0 ? `🥈 *Runner-Up:* ${runnerUp.name} (${runnerUp.votes} votes)` : ''}

🚗 *Ground Intel:* ${winner?.parkingAlert || 'Auto leko sidha jao, tension nakko lo!'}
🍲 *Must Order:* ${winner?.specialty || 'Double Masala Zafrani Dum Biryani'}

*Verdict:* Faisla hogaya ustaad! Table book karo aur sidha toot pado!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#171724] border border-[#2B2B3E] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#262638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base md:text-lg text-white">
                Share Battle Result
              </h3>
              <p className="text-xs text-slate-400">Send verdict to your WhatsApp group</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#252536] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Card Preview */}
          <div className="p-4 rounded-2xl bg-[#101016] border border-[#242436] font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto select-all">
            {summaryText}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className={`py-3 px-4 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-[#20202F] hover:bg-[#28283C] text-white border border-[#2F2F44]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copied, Miyan! ✅</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copy Text Summary</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm tracking-wide shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Share to WhatsApp</span>
            </a>
          </div>

          <p className="text-center text-[11px] text-slate-500 italic">
            "WhatsApp group pe daalo, jisko rona hai rone do, winner tayyar hai!"
          </p>
        </div>
      </div>
    </div>
  );
};
