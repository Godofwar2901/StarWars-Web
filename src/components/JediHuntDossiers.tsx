import React, { useState } from 'react';
import { 
  JediFugitive, 
  InquisitorUnit, 
  Sector, 
  TacticalStrikeLog,
  ThreatLevel,
  FugitiveStatus
} from '../types';
import { 
  ShieldAlert, 
  Search, 
  Crosshair, 
  Flame, 
  UserCheck, 
  XCircle, 
  Zap, 
  Award, 
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Radio,
  Sparkles,
  Users
} from 'lucide-react';
import { FugitiveDetailModal } from './FugitiveDetailModal';
import { StrikeResultModal } from './StrikeResultModal';
import { 
  playTacticalClick, 
  playLockOn, 
  playSaberIgnition,
  playCipherDecrypt
} from '../utils/soundEffects';

interface JediHuntDossiersProps {
  fugitives: JediFugitive[];
  inquisitors: InquisitorUnit[];
  sectors: Sector[];
  onUpdateFugitive: (updated: JediFugitive) => void;
  onAddStrikeLog: (log: TacticalStrikeLog) => void;
}

export const JediHuntDossiers: React.FC<JediHuntDossiersProps> = ({
  fugitives,
  inquisitors,
  sectors,
  onUpdateFugitive,
  onAddStrikeLog
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFugitive, setSelectedFugitive] = useState<JediFugitive | null>(null);

  // Strike Dispatcher Modal State
  const [dispatchTarget, setDispatchTarget] = useState<JediFugitive | null>(null);
  const [selectedInquisitorIds, setSelectedInquisitorIds] = useState<string[]>([inquisitors[0]?.id || 'inq-grand']);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    'Cortosis Vibroblades & Electro-staffs',
    'High-Frequency Sonic Pulse Cannons'
  ]);
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [latestStrikeResult, setLatestStrikeResult] = useState<TacticalStrikeLog | null>(null);

  const availableAssets = [
    { id: 'cortosis', name: 'Cortosis Vibroblades & Electro-staffs', bonus: 12, desc: 'Short-circuits lightsabers upon blade contact' },
    { id: 'sonic', name: 'High-Frequency Sonic Pulse Cannons', bonus: 10, desc: 'Shatters Jedi mental concentration & Force focus' },
    { id: 'gravity', name: 'Interdictor Gravity Well Cruiser', bonus: 15, desc: 'Suppresses hyperspace escape vectors completely' },
    { id: 'gas', name: 'Stun Gas Aerosol Bombardment', bonus: 8, desc: 'Non-lethal incapacitation for Project Harvester extraction' },
    { id: 'drones', name: 'Midi-chlorian Bio-Scanner Drones', bonus: 6, desc: 'Tracks biological Force resonance through solid rock' }
  ];

  const filteredFugitives = fugitives.filter(f => {
    if (threatFilter !== 'ALL' && !f.threatLevel.includes(threatFilter)) return false;
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || 
             f.formerRank.toLowerCase().includes(q) ||
             f.syndicateRole.toLowerCase().includes(q) ||
             f.forceSpecialties.some(s => s.toLowerCase().includes(q));
    }
    return true;
  });

  const getSaberBadge = (color: string) => {
    switch (color) {
      case 'Blue': return 'text-blue-400 border-blue-500/50 bg-blue-950/40';
      case 'Green': return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
      case 'Yellow': return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
      case 'Cyan': return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40';
      case 'Purple': return 'text-purple-400 border-purple-500/50 bg-purple-950/40';
      case 'Double Yellow': return 'text-yellow-400 border-yellow-500/50 bg-yellow-950/40';
      default: return 'text-slate-300 border-slate-700 bg-slate-900';
    }
  };

  const getThreatBadge = (threat: ThreatLevel) => {
    if (threat.includes('Omega')) {
      return 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
    } else if (threat.includes('Alpha')) {
      return 'bg-orange-950 text-orange-300 border-orange-600 font-bold';
    } else {
      return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const calculateSuccessOdds = () => {
    if (!dispatchTarget) return 75;
    let base = 65;
    
    // Inquisitor combat ratings
    selectedInquisitorIds.forEach(id => {
      const inq = inquisitors.find(i => i.id === id);
      if (inq) base += (inq.combatRating - 80) / 2;
    });

    // Asset bonuses
    selectedAssets.forEach(assetName => {
      const asset = availableAssets.find(a => a.name === assetName);
      if (asset) base += asset.bonus;
    });

    // Threat penalty
    if (dispatchTarget.threatLevel.includes('Omega')) base -= 15;
    if (dispatchTarget.threatLevel.includes('Alpha')) base -= 8;

    return Math.min(Math.max(Math.round(base), 45), 98);
  };

  const handleExecuteStrike = async () => {
    if (!dispatchTarget) return;
    setIsStriking(true);
    playSaberIgnition();

    const sector = sectors.find(s => s.id === dispatchTarget.currentSectorId);
    const assignedInqs = inquisitors.filter(i => selectedInquisitorIds.includes(i.id));
    const calculatedOdds = calculateSuccessOdds();

    try {
      const res = await fetch('/api/tactical/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: `Simulate an intense tactical Inquisitorius raid and lightsaber duel against HCET Jedi fugitive ${dispatchTarget.name} (${dispatchTarget.formerRank}, Form: ${dispatchTarget.lightsaberForm}) in sector ${sector?.name || 'Outer Rim'}. Deployed Inquisitors: ${assignedInqs.map(i => i.name).join(', ')}. Tactical Assets: ${selectedAssets.join(', ')}.`,
          targetJedi: dispatchTarget.name,
          sector: sector?.name || 'Outer Rim',
          forceThreatLevel: dispatchTarget.threatLevel,
          imperialForces: assignedInqs.map(i => i.name).concat(selectedAssets)
        })
      });

      const data = await res.json();
      const isEliminated = calculatedOdds > 80;
      const outcome: TacticalStrikeLog['outcome'] = isEliminated 
        ? 'FUGITIVE_ELIMINATED' 
        : calculatedOdds > 65 
        ? 'FUGITIVE_CAPTURED' 
        : 'ESCAPED_TO_HYPERSPACE';

      const newLog: TacticalStrikeLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        targetJediName: dispatchTarget.name,
        sectorName: sector?.name || 'Sector Grid 4',
        inquisitorNames: assignedInqs.map(i => i.name),
        outcome,
        details: data.threatAnalysis || `${assignedInqs[0]?.name || 'Inquisitorius Squad'} confronted ${dispatchTarget.name}. Following a fierce lightsaber clash, Imperial tactical suppression overwhelmed the Jedi.`,
        successRateCalculated: calculatedOdds
      };

      onAddStrikeLog(newLog);
      setLatestStrikeResult(newLog);

      // Update Fugitive Status
      const nextStatus: FugitiveStatus = outcome === 'FUGITIVE_ELIMINATED' 
        ? 'ELIMINATED' 
        : outcome === 'FUGITIVE_CAPTURED' 
        ? 'CONTAINED' 
        : 'AT_LARGE';

      onUpdateFugitive({
        ...dispatchTarget,
        status: nextStatus
      });

      setDispatchTarget(null);
    } catch (err) {
      console.error(err);
      const newLog: TacticalStrikeLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        targetJediName: dispatchTarget.name,
        sectorName: sector?.name || 'Outer Rim',
        inquisitorNames: assignedInqs.map(i => i.name),
        outcome: 'FUGITIVE_CAPTURED',
        details: `Imperial strike force successfully ambushed ${dispatchTarget.name} at their safehouse perimeter. Subject detained for Inquisitorius interrogation.`,
        successRateCalculated: calculatedOdds
      };
      onAddStrikeLog(newLog);
      setLatestStrikeResult(newLog);
      onUpdateFugitive({
        ...dispatchTarget,
        status: 'CONTAINED'
      });
      setDispatchTarget(null);
    } finally {
      setIsStriking(false);
    }
  };

  const toggleInquisitor = (id: string) => {
    playTacticalClick();
    if (selectedInquisitorIds.includes(id)) {
      if (selectedInquisitorIds.length > 1) {
        setSelectedInquisitorIds(selectedInquisitorIds.filter(i => i !== id));
      }
    } else {
      if (selectedInquisitorIds.length < 3) {
        setSelectedInquisitorIds([...selectedInquisitorIds, id]);
      }
    }
  };

  const toggleAsset = (name: string) => {
    playTacticalClick();
    if (selectedAssets.includes(name)) {
      setSelectedAssets(selectedAssets.filter(a => a !== name));
    } else {
      setSelectedAssets([...selectedAssets, name]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            JEDI FUGITIVE DOSSIERS & INQUISITORIUS STRIKE WINGS
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Identify surviving Jedi Masters, Knights & HCET recruiters. Dispatch Purge Troopers and Inquisitors for decisive eradication.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono-tech">
          <div className="bg-[#0A0B0E] px-3 py-1.5 rounded border border-[#1F2937] flex items-center gap-2">
            <span className="text-slate-400 uppercase">Eliminated / Contained:</span>
            <span className="font-bold text-rose-400 font-orbitron">
              {fugitives.filter(f => f.status === 'ELIMINATED' || f.status === 'CONTAINED').length} / {fugitives.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Jedi by name, rank, or Force specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono-tech"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400 uppercase">Threat:</span>
          {['ALL', 'Omega', 'Alpha'].map(th => (
            <button
              key={th}
              onClick={() => {
                playTacticalClick();
                setThreatFilter(th);
              }}
              className={`px-3 py-1 rounded font-orbitron transition border ${
                threatFilter === th
                  ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-sm'
                  : 'bg-[#0A0B0E] text-slate-400 hover:text-slate-200 hover:bg-[#1A2234] border-[#1F2937]'
              }`}
            >
              {th}
            </button>
          ))}

          <span className="text-slate-400 uppercase ml-2">Status:</span>
          {['ALL', 'AT_LARGE', 'TRACKED', 'CONTAINED', 'ELIMINATED'].map(st => (
            <button
              key={st}
              onClick={() => {
                playTacticalClick();
                setStatusFilter(st);
              }}
              className={`px-2.5 py-1 rounded transition text-[11px] font-mono-tech border ${
                statusFilter === st
                  ? 'bg-[#4C0519] border-rose-500 text-rose-200 font-bold'
                  : 'bg-[#0A0B0E] text-slate-400 hover:text-slate-200 hover:bg-[#1A2234] border-[#1F2937]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Fugitive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFugitives.map((fugitive) => {
          const sector = sectors.find(s => s.id === fugitive.currentSectorId);

          return (
            <div
              key={fugitive.id}
              id={`jedi-card-${fugitive.id}`}
              className={`bg-[#111827] border rounded-lg p-4 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg ${
                fugitive.status === 'ELIMINATED'
                  ? 'border-[#1F2937] opacity-60'
                  : 'border-[#1F2937] hover:border-rose-600/70 hover:shadow-rose-950/40'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                      ID: {fugitive.id} // {fugitive.formerRank}
                    </span>
                    <h3 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
                      {fugitive.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-mono-tech ${getThreatBadge(fugitive.threatLevel)}`}>
                    {fugitive.threatLevel.split(' ')[0]}
                  </span>
                </div>

                {/* Bounty & Sector Tag */}
                <div className="flex items-center justify-between text-xs font-mono-tech py-1.5 border-y border-[#1F2937] my-2">
                  <span className="text-amber-400 font-bold">
                    {fugitive.bountyCredits.toLocaleString()} CREDITS
                  </span>
                  <span className="text-cyan-400">
                    Sector: {sector?.name || 'Outer Rim'}
                  </span>
                </div>

                {/* Lightsaber Form & Color Badge */}
                <div className="flex items-center space-x-2 my-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-mono-tech font-bold ${getSaberBadge(fugitive.lightsaberColor)}`}>
                    {fugitive.lightsaberColor} Blade
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-tech truncate">
                    {fugitive.lightsaberForm.split('/')[0]}
                  </span>
                </div>

                {/* Syndicate Role */}
                <p className="text-xs text-slate-400 font-mono-tech line-clamp-2 my-2">
                  {fugitive.syndicateRole}
                </p>

                {/* Force Specialty Chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {fugitive.forceSpecialties.slice(0, 2).map((spec, i) => (
                    <span key={i} className="text-[10px] bg-[#0A0B0E] text-slate-300 px-1.5 py-0.5 rounded border border-[#1F2937] font-mono-tech">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-[#1F2937] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    playTacticalClick();
                    setSelectedFugitive(fugitive);
                  }}
                  className="px-3.5 py-1.5 bg-[#0A0B0E] hover:bg-[#1A2234] text-slate-300 text-xs font-orbitron rounded border border-[#1F2937] transition"
                >
                  Dossier
                </button>

                <button
                  onClick={() => {
                    playLockOn();
                    setDispatchTarget(fugitive);
                  }}
                  disabled={fugitive.status === 'ELIMINATED'}
                  className={`px-3.5 py-1.5 text-xs font-orbitron font-bold rounded uppercase tracking-wider flex items-center gap-1.5 transition ${
                    fugitive.status === 'ELIMINATED'
                      ? 'bg-[#161B26] text-slate-500 cursor-not-allowed border border-[#1F2937]'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/60'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{fugitive.status === 'ELIMINATED' ? 'Neutralized' : 'Deploy Strike'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strike Force Dispatcher Modal */}
      {dispatchTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0A0B0E] border-2 border-rose-600 rounded-xl max-w-2xl w-full p-6 shadow-2xl shadow-rose-950 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono-tech text-rose-400 uppercase tracking-widest font-bold">
                  INQUISITORIUS TASK FORCE DISPATCH // TARGET LOCK
                </span>
                <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-0.5">
                  Assault on {dispatchTarget.name}
                </h3>
              </div>
              <button
                onClick={() => setDispatchTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs font-mono-tech">
              {/* Target Summary */}
              <div className="bg-[#111827] p-3 rounded border border-[#1F2937] grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block">THEATER:</span>
                  <span className="text-cyan-300 font-bold font-orbitron">
                    {sectors.find(s => s.id === dispatchTarget.currentSectorId)?.name || 'Outer Rim'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">COMBAT FORM:</span>
                  <span className="text-slate-200 font-bold truncate block">{dispatchTarget.lightsaberForm.split('/')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">CALCULATED ODDS:</span>
                  <span className="text-emerald-400 font-bold text-sm font-orbitron">{calculateSuccessOdds()}% Success</span>
                </div>
              </div>

              {/* Select Inquisitors */}
              <div>
                <span className="text-xs font-orbitron font-bold text-slate-200 uppercase block mb-2">
                  1. Assign Inquisitor Hunters (Max 3):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inquisitors.map(inq => {
                    const isSelected = selectedInquisitorIds.includes(inq.id);
                    return (
                      <div
                        key={inq.id}
                        onClick={() => toggleInquisitor(inq.id)}
                        className={`p-2.5 rounded border cursor-pointer transition ${
                          isSelected 
                            ? 'bg-[#4C0519] border-rose-500 text-white ring-1 ring-rose-500' 
                            : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-[#F9FAFB] flex items-center justify-between">
                          <span>{inq.name}</span>
                          <span className="text-[10px] text-amber-400 font-orbitron">{inq.combatRating} Rating</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono-tech mt-0.5">{inq.specialty}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Select Imperial Tactical Assets */}
              <div>
                <span className="text-xs font-orbitron font-bold text-slate-200 uppercase block mb-2">
                  2. Equip Specialized Anti-Force Ordnance & Assets:
                </span>
                <div className="space-y-1.5">
                  {availableAssets.map(asset => {
                    const isEquipped = selectedAssets.includes(asset.name);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => toggleAsset(asset.name)}
                        className={`p-2 rounded border cursor-pointer transition flex items-center justify-between ${
                          isEquipped
                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                            : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-200 text-[11px]">{asset.name}</div>
                          <div className="text-[10px] text-slate-400">{asset.desc}</div>
                        </div>
                        <span className="text-emerald-400 font-bold text-xs">+{asset.bonus}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 pt-3 border-t border-[#1F2937] flex items-center justify-between">
              <div className="text-xs font-mono-tech text-slate-400">
                <span>ESTIMATED SUCCESS PROBABILITY: </span>
                <span className="text-emerald-400 font-bold font-orbitron">{calculateSuccessOdds()}%</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setDispatchTarget(null)}
                  className="px-4 py-2 bg-[#111827] hover:bg-[#1A2234] text-slate-300 text-xs font-orbitron rounded border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteStrike}
                  disabled={isStriking}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-orbitron text-xs font-bold uppercase tracking-wider rounded shadow-lg shadow-rose-950 flex items-center gap-1.5 transition"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isStriking ? 'Engaging in Combat...' : 'Authorize Raid & Purge'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Dossier Modal */}
      <FugitiveDetailModal
        fugitive={selectedFugitive}
        sector={sectors.find(s => s.id === selectedFugitive?.currentSectorId)}
        onClose={() => setSelectedFugitive(null)}
        onDispatch={(f) => setDispatchTarget(f)}
      />

      {/* Strike Result After-Action Report Modal */}
      <StrikeResultModal
        log={latestStrikeResult}
        onClose={() => setLatestStrikeResult(null)}
      />
    </div>
  );
};
