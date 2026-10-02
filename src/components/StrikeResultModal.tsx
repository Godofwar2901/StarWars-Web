import React from 'react';
import { TacticalStrikeLog } from '../types';
import { 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  Crosshair,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playRedAlert, playLockOn } from '../utils/soundEffects';

interface StrikeResultModalProps {
  log: TacticalStrikeLog | null;
  onClose: () => void;
}

export const StrikeResultModal: React.FC<StrikeResultModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const isSuccess = log.outcome === 'FUGITIVE_ELIMINATED' || log.outcome === 'FUGITIVE_CAPTURED';

  React.useEffect(() => {
    if (isSuccess) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#06b6d4', '#ffffff']
        });
      } catch {}
    }
  }, [isSuccess]);

  const getOutcomeBadge = () => {
    switch (log.outcome) {
      case 'FUGITIVE_ELIMINATED':
        return (
          <div className="bg-rose-950/90 border border-rose-500 text-rose-300 px-3 py-1 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 uppercase">
            <Flame className="w-4 h-4 text-rose-500" />
            TARGET ELIMINATED
          </div>
        );
      case 'FUGITIVE_CAPTURED':
        return (
          <div className="bg-amber-950/90 border border-amber-500 text-amber-300 px-3 py-1 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 uppercase">
            <UserCheck className="w-4 h-4 text-amber-400" />
            CAPTURED FOR RE-EDUCATION
          </div>
        );
      case 'CELL_DISPERSED':
        return (
          <div className="bg-cyan-950/90 border border-cyan-500 text-cyan-300 px-3 py-1 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            HCET CELL DISPERSED
          </div>
        );
      default:
        return (
          <div className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 uppercase">
            <XCircle className="w-4 h-4 text-rose-400" />
            FUGITIVE JUMPED TO HYPERSPACE
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0B0E] border-2 border-rose-600/80 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/80 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-4">
          <div>
            <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest">
              ISB STRIKE AFTER-ACTION REPORT // LOG {log.id}
            </span>
            <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-0.5">
              Operation Outcome
            </h3>
          </div>
          {getOutcomeBadge()}
        </div>

        {/* Strike Details Body */}
        <div className="space-y-4 text-xs font-mono-tech">
          <div className="grid grid-cols-2 gap-2 bg-[#111827] p-3 rounded border border-[#1F2937]">
            <div>
              <span className="text-slate-400 block">TARGET JEDI:</span>
              <span className="text-[#F9FAFB] font-bold text-sm font-orbitron">{log.targetJediName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">SECTOR THEATER:</span>
              <span className="text-[#F9FAFB] font-bold text-sm font-orbitron">{log.sectorName}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-[#1F2937] flex items-center justify-between">
              <div>
                <span className="text-slate-400">DEPLOYED INQUISITORIUS: </span>
                <span className="text-rose-400 font-bold">{log.inquisitorNames.join(', ')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">EST. SUCCESS: </span>
                <span className="text-emerald-400 font-bold">{log.successRateCalculated}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-3.5 rounded text-slate-200 leading-relaxed space-y-2">
            <span className="text-rose-400 font-bold block uppercase font-orbitron text-[11px]">
              Tactical Combat Narrative:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{log.details}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-orbitron text-xs font-bold uppercase tracking-wider rounded transition shadow-lg shadow-rose-950"
          >
            Acknowledge & Archive Report
          </button>
        </div>
      </div>
    </div>
  );
};
