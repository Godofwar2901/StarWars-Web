import React, { useState } from 'react';
import { 
  AntiRecruitmentOperation, 
  Sector 
} from '../types';
import { 
  ShieldAlert, 
  Sparkles, 
  Users, 
  Radio, 
  Award, 
  Copy, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  AlertTriangle,
  Building,
  Target,
  RefreshCw,
  Share2
} from 'lucide-react';
import { playTacticalClick, playLockOn, playCipherDecrypt } from '../utils/soundEffects';

interface AntiRecruitmentStudioProps {
  operations: AntiRecruitmentOperation[];
  sectors: Sector[];
  onAddOperation: (op: AntiRecruitmentOperation) => void;
}

export const AntiRecruitmentStudio: React.FC<AntiRecruitmentStudioProps> = ({
  operations,
  sectors,
  onAddOperation
}) => {
  const [targetRegion, setTargetRegion] = useState<string>('Outer Rim Mining Colonies & Core World Academies');
  const [recruitmentChannel, setRecruitmentChannel] = useState<string>('Underground Smuggler Transport & Clandestine Kyber Caches');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedOp, setSelectedOp] = useState<AntiRecruitmentOperation>(operations[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Proclamation Maker State
  const [proclamationTitle, setProclamationTitle] = useState<string>('MANDATORY BIOMETRIC FORCE SCREENING ACT');
  const [proclamationSector, setProclamationSector] = useState<string>('Coruscant (Underworld)');
  const [proclamationBounty, setProclamationBounty] = useState<number>(250000);
  const [proclamationText, setProclamationText] = useState<string>(
    'BY DECREE OF EMPEROR PALPATINE: All citizens harboring individuals with anomalous kinetic or telepathic reflexes must report immediately to the nearest ISB Garrison. Failure to report carries immediate execution. Rewards are issued in un-traceable Imperial Credits.'
  );

  const handleGenerateDoctrine = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    playCipherDecrypt();

    try {
      const res = await fetch('/api/tactical/anti-recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRegion,
          recruitmentChannel
        })
      });

      const data = await res.json();
      const newOp: AntiRecruitmentOperation = {
        id: `op-${Date.now()}`,
        codename: data.operationCodename || `OPERATION PURGE SHIELD ${Math.floor(100 + Math.random() * 900)}`,
        targetSectorId: sectors[0]?.id || 'sec-jedha',
        focusArea: 'PROJECT_HARVESTER',
        objective: data.objective || 'Neutralize HCET recruitment channels and intercept youngling transports.',
        phases: data.phases || [
          { phase: 'Phase 1', action: 'Infiltrate local education centers.' },
          { phase: 'Phase 2', action: 'Deploy Inquisitorius sweep.' }
        ],
        propagandaBroadcast: data.propagandaBroadcastMessage || 'Citizens: Report all rogue Force manifestations.',
        bountyReward: data.bountyRewardCredits || 300000,
        younglingsExtractedCount: Math.floor(3 + Math.random() * 8),
        status: 'IN_PROGRESS'
      };

      onAddOperation(newOp);
      setSelectedOp(newOp);
      playLockOn();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    playTacticalClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalExtracted = operations.reduce((acc, o) => acc + o.younglingsExtractedCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            ANTI-RECRUITMENT DOCTRINE & PROJECT HARVESTER
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Disrupt HCET Syndicate recruitment networks, intercept Force-sensitive juveniles, and seize illegal Kyber crystal pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono-tech">
          <div className="bg-[#0A0B0E] px-3 py-1.5 rounded border border-[#1F2937] flex items-center gap-2">
            <span className="text-slate-400 uppercase">Subjects Secured into Harvester:</span>
            <span className="font-bold text-amber-400 font-orbitron">{totalExtracted} Younglings</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Doctrine Generator + Active Campaigns + Wanted Poster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Doctrine Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-slate-200 uppercase">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Imperial Strategic Doctrine Generator</span>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech">
              Input target regions and suspected HCET deception methods to formulate high-clearance counter-recruitment strategies.
            </p>

            <form onSubmit={handleGenerateDoctrine} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                  Target Region / Jurisdiction:
                </label>
                <input
                  type="text"
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                  Suspected HCET Recruitment Pipeline:
                </label>
                <input
                  type="text"
                  value={recruitmentChannel}
                  onChange={(e) => setRecruitmentChannel(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-[#161B26] disabled:text-slate-500 text-white rounded font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-950/60"
              >
                <Cpu className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing Imperial Doctrine...' : 'Generate Anti-Recruitment Plan'}</span>
              </button>
            </form>
          </div>

          {/* Active Campaigns Feed */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-slate-200 uppercase">
              <span>Active Imperial Campaigns</span>
              <span className="text-amber-400 font-mono-tech">[{operations.length} Active]</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {operations.map(op => {
                const isSelected = selectedOp?.id === op.id;
                const sector = sectors.find(s => s.id === op.targetSectorId);

                return (
                  <div
                    key={op.id}
                    onClick={() => {
                      playTacticalClick();
                      setSelectedOp(op);
                    }}
                    className={`p-3 rounded border cursor-pointer transition ${
                      isSelected 
                        ? 'bg-[#161B26] border-rose-500 ring-1 ring-rose-500 shadow-sm' 
                        : 'bg-[#0A0B0E] border-[#1F2937] hover:bg-[#1A2234]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 mb-0.5">
                      <span className="font-bold text-[#F9FAFB] font-orbitron">{op.codename}</span>
                      <span className="text-amber-400 font-bold">+{op.younglingsExtractedCount} Secured</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono-tech line-clamp-1">{op.objective}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Campaign Details & HoloNet Broadcast Maker */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOp ? (
            <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-[#1F2937] pb-3">
                <div>
                  <span className="text-[10px] font-mono-tech text-rose-400 uppercase tracking-widest font-bold">
                    ISB CAMPAIGN BLUEPRINT // {selectedOp.id}
                  </span>
                  <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-0.5">
                    {selectedOp.codename}
                  </h3>
                </div>

                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded text-xs font-mono-tech uppercase font-bold">
                  {selectedOp.status.replace('_', ' ')}
                </span>
              </div>

              {/* Objective */}
              <div className="bg-[#0A0B0E] p-3.5 rounded border border-[#1F2937] text-xs font-mono-tech">
                <span className="text-slate-300 uppercase font-bold block mb-1">Primary Strategic Objective:</span>
                <p className="text-slate-200 leading-relaxed">{selectedOp.objective}</p>
              </div>

              {/* Execution Phases */}
              <div>
                <span className="text-xs font-orbitron font-bold text-slate-200 uppercase block mb-2">
                  Operation Execution Phases:
                </span>
                <div className="space-y-2">
                  {selectedOp.phases.map((ph, idx) => (
                    <div key={idx} className="bg-[#0A0B0E] p-2.5 rounded border border-[#1F2937] flex items-start space-x-2.5 text-xs font-mono-tech">
                      <span className="px-1.5 py-0.5 bg-[#4C0519] border border-rose-800 text-rose-200 rounded font-bold whitespace-nowrap">
                        {ph.phase}
                      </span>
                      <span className="text-slate-300">{ph.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Propaganda Notice Box */}
              <div className="bg-[#0A0B0E] border border-amber-900/60 p-3.5 rounded-lg space-y-2 text-xs font-mono-tech">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> Official HoloNet Public Broadcast Proclamation:
                  </span>
                  <button
                    onClick={() => copyText(selectedOp.propagandaBroadcast, selectedOp.id)}
                    className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === selectedOp.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedOp.id ? 'Copied' : 'Copy Broadcast'}</span>
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed italic bg-[#111827] p-2.5 rounded border border-[#1F2937]">
                  "{selectedOp.propagandaBroadcast}"
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono-tech">No campaign selected</div>
          )}

          {/* Interactive HoloNet WANTED Proclamation Studio */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-orbitron font-bold text-[#F9FAFB] uppercase">
                  Imperial HoloNet Proclamation Studio
                </span>
              </div>
              <button
                onClick={() => {
                  const fullNotice = `=== IMPERIAL SECURITY BUREAU PROCLAMATION ===\nTITLE: ${proclamationTitle}\nSECTOR: ${proclamationSector}\nBOUNTY REWARD: ${proclamationBounty.toLocaleString()} CREDITS\n\n${proclamationText}\n\nBY IMPERIAL DECREE - VIOLATORS SUBJECT TO ORDER 66 PURGE.`;
                  copyText(fullNotice, 'proclamation-notice');
                }}
                className="px-3 py-1 bg-[#0A0B0E] hover:bg-[#1A2234] border border-[#1F2937] text-slate-300 text-xs font-mono-tech rounded flex items-center gap-1.5 transition"
              >
                {copiedId === 'proclamation-notice' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedId === 'proclamation-notice' ? 'Copied Full Notice' : 'Export Proclamation'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
              <div>
                <label className="text-slate-300 block mb-1">PROCLAMATION TITLE:</label>
                <input
                  type="text"
                  value={proclamationTitle}
                  onChange={(e) => setProclamationTitle(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">TARGET SECTOR / JURISDICTION:</label>
                <input
                  type="text"
                  value={proclamationSector}
                  onChange={(e) => setProclamationSector(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 block mb-1">BROADCAST TEXT & WARNING:</label>
                <textarea
                  rows={2}
                  value={proclamationText}
                  onChange={(e) => setProclamationText(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
