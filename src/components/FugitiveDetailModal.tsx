import React from 'react';
import { JediFugitive, Sector } from '../types';
import { 
  ShieldAlert, 
  X, 
  Crosshair, 
  Sparkles, 
  Flame, 
  MapPin, 
  Award,
  Zap,
  Radio,
  BookOpen
} from 'lucide-react';
import { playSaberIgnition, playLockOn } from '../utils/soundEffects';

interface FugitiveDetailModalProps {
  fugitive: JediFugitive | null;
  sector: Sector | undefined;
  onClose: () => void;
  onDispatch: (fugitive: JediFugitive) => void;
}

export const FugitiveDetailModal: React.FC<FugitiveDetailModalProps> = ({
  fugitive,
  sector,
  onClose,
  onDispatch
}) => {
  if (!fugitive) return null;

  React.useEffect(() => {
    playSaberIgnition();
  }, []);

  const getSaberColorClass = (color: string) => {
    switch (color) {
      case 'Blue': return 'from-blue-500 to-cyan-400 text-blue-400 border-blue-500 shadow-blue-500/50';
      case 'Green': return 'from-emerald-500 to-green-400 text-emerald-400 border-emerald-500 shadow-emerald-500/50';
      case 'Yellow': return 'from-amber-400 to-yellow-300 text-amber-400 border-amber-400 shadow-amber-500/50';
      case 'Cyan': return 'from-cyan-400 to-sky-300 text-cyan-400 border-cyan-400 shadow-cyan-500/50';
      case 'Purple': return 'from-purple-500 to-fuchsia-400 text-purple-400 border-purple-500 shadow-purple-500/50';
      case 'Double Yellow': return 'from-yellow-500 to-amber-300 text-yellow-400 border-yellow-500 shadow-yellow-500/50';
      default: return 'from-slate-400 to-slate-200 text-slate-300 border-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A0B0E] border-2 border-rose-600/80 rounded-xl max-w-2xl w-full p-6 shadow-2xl shadow-rose-950 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#1F2937] pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono-tech bg-[#4C0519] text-rose-200 px-2 py-0.5 rounded border border-rose-600 uppercase font-bold">
                TOP SECRET // ISB TARGET CLASSIFICATION
              </span>
              <span className="text-[11px] font-mono-tech text-amber-400 font-bold">
                BOUNTY: {fugitive.bountyCredits.toLocaleString()} CREDITS
              </span>
            </div>
            <h2 className="text-2xl font-bold font-orbitron text-[#F9FAFB] mt-1 flex items-center gap-3">
              {fugitive.name}
              <span className="text-xs font-mono-tech px-2 py-0.5 bg-[#111827] border border-[#1F2937] text-slate-300 rounded font-normal">
                {fugitive.formerRank}
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#111827] border border-[#1F2937] text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 space-y-4 text-xs font-mono-tech">
          {/* Top Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#111827] p-2.5 rounded border border-[#1F2937]">
              <span className="text-[10px] text-slate-400 block uppercase">Threat Rating</span>
              <span className="font-bold text-rose-400 text-sm font-orbitron">{fugitive.threatLevel.split(' ')[0]}</span>
            </div>

            <div className="bg-[#111827] p-2.5 rounded border border-[#1F2937]">
              <span className="text-[10px] text-slate-400 block uppercase">Last Known Sector</span>
              <span className="font-bold text-cyan-300 text-sm font-orbitron truncate block">
                {sector?.name || 'Unknown'}
              </span>
            </div>

            <div className="bg-[#111827] p-2.5 rounded border border-[#1F2937]">
              <span className="text-[10px] text-slate-400 block uppercase">Combat Form</span>
              <span className="font-bold text-slate-200 text-xs truncate block">{fugitive.lightsaberForm.split('/')[0]}</span>
            </div>

            <div className="bg-[#111827] p-2.5 rounded border border-[#1F2937]">
              <span className="text-[10px] text-slate-400 block uppercase">Status</span>
              <span className={`font-bold text-xs uppercase ${
                fugitive.status === 'ELIMINATED' ? 'text-slate-500' : fugitive.status === 'CONTAINED' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {fugitive.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Lightsaber Blade Visualizer */}
          <div className="bg-[#111827] p-3.5 rounded-lg border border-[#1F2937] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-orbitron font-bold uppercase text-[11px] flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-rose-500" /> Lightsaber Telemetry & Frequency
              </span>
              <span className="font-bold text-slate-200">{fugitive.lightsaberColor} Kyber Crystal</span>
            </div>
            
            {/* Glowing Saber bar */}
            <div className="w-full h-3 bg-[#0A0B0E] rounded-full overflow-hidden p-0.5 border border-[#1F2937] relative">
              <div className={`h-full rounded-full bg-gradient-to-r ${getSaberColorClass(fugitive.lightsaberColor)} shadow-lg animate-pulse`}></div>
            </div>
          </div>

          {/* Dossier Bio */}
          <div className="bg-[#111827] p-3.5 rounded-lg border border-[#1F2937] space-y-1">
            <span className="text-slate-300 font-orbitron font-bold uppercase text-[11px] block">
              ISB Tactical Profile & Intelligence:
            </span>
            <p className="text-slate-300 leading-relaxed">{fugitive.bio}</p>
          </div>

          {/* HCET Syndicate Function */}
          <div className="bg-[#111827] p-3.5 rounded-lg border border-[#1F2937] space-y-1">
            <span className="text-amber-400 font-orbitron font-bold uppercase text-[11px] block">
              HCET Syndicate Role & Activity:
            </span>
            <p className="text-slate-300 leading-relaxed">{fugitive.syndicateRole}</p>
          </div>

          {/* Force Specialties & Danger Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#111827] p-3 rounded-lg border border-[#1F2937] space-y-2">
              <span className="text-cyan-400 font-orbitron font-bold uppercase text-[11px] block">
                Force Specialties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fugitive.forceSpecialties.map((spec, i) => (
                  <span key={i} className="bg-[#0A0B0E] px-2 py-0.5 rounded border border-[#1F2937] text-slate-300 text-[11px]">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] p-3 rounded-lg border border-[#1F2937] space-y-1">
              <span className="text-rose-400 font-orbitron font-bold uppercase text-[11px] block">
                Inquisitor Hazard Warning:
              </span>
              <p className="text-rose-200/90 text-[11px] leading-relaxed">{fugitive.dangerNotes}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-[#1F2937] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#111827] hover:bg-[#1A2234] text-slate-300 font-orbitron text-xs font-semibold uppercase rounded border border-[#1F2937] transition"
          >
            Close Dossier
          </button>
          <button
            onClick={() => {
              playLockOn();
              onDispatch(fugitive);
              onClose();
            }}
            disabled={fugitive.status === 'ELIMINATED'}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-[#161B26] disabled:text-slate-500 text-white font-orbitron text-xs font-bold uppercase tracking-wider rounded transition flex items-center space-x-1.5 shadow-lg shadow-rose-950"
          >
            <Crosshair className="w-4 h-4" />
            <span>Launch Inquisitor Strike Force</span>
          </button>
        </div>
      </div>
    </div>
  );
};
