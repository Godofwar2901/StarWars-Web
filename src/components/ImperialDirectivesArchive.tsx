import React, { useState } from 'react';
import { 
  ImperialDirective, 
  Sector 
} from '../types';
import { 
  FileText, 
  Search, 
  Plus, 
  Share2, 
  CheckCircle2, 
  Copy, 
  Award, 
  ShieldAlert, 
  Flame,
  Printer
} from 'lucide-react';
import { playTacticalClick, playLockOn } from '../utils/soundEffects';

interface ImperialDirectivesArchiveProps {
  directives: ImperialDirective[];
  sectors: Sector[];
  onAddDirective: (directive: ImperialDirective) => void;
}

export const ImperialDirectivesArchive: React.FC<ImperialDirectivesArchiveProps> = ({
  directives,
  sectors,
  onAddDirective
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDirective, setSelectedDirective] = useState<ImperialDirective>(directives[0] || null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Directive Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTargetSector, setNewTargetSector] = useState(sectors[0]?.id || 'sec-jedha');
  const [newSummary, setNewSummary] = useState('');
  const [newStep1, setNewStep1] = useState('Impose orbital interdiction grid around primary jump coordinates.');
  const [newStep2, setNewStep2] = useState('Deploy Inquisitorius strike division with Cortosis suppression armor.');
  const [newReward, setNewReward] = useState<number>(400000);

  const filteredDirectives = directives.filter(d => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || 
             d.directiveCode.toLowerCase().includes(q) ||
             d.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDir: ImperialDirective = {
      id: `dir-${Date.now().toString().slice(-4)}`,
      directiveCode: `DIR-66-ISB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      author: 'Imperial Command Directorate',
      clearance: 'PRIORITY ONE',
      targetSectorId: newTargetSector,
      summary: newSummary || 'High-priority planetary quarantine and Force purge directive.',
      containmentSteps: [newStep1, newStep2].filter(Boolean),
      countermeasures: [
        { name: 'Cortosis Vanguard Blades', purpose: 'Neutralize lightsabers' },
        { name: 'Sonic Pulse Dampeners', purpose: 'Disrupt Force concentration' }
      ],
      rewardCredits: newReward,
      status: 'ACTIVE',
      createdAt: '19 BBY Standard Date'
    };

    onAddDirective(newDir);
    setSelectedDirective(newDir);
    setShowCreateModal(false);
    playLockOn();
    setNewTitle('');
    setNewSummary('');
  };

  const copyDirectiveDocument = (dir: ImperialDirective) => {
    const sector = sectors.find(s => s.id === dir.targetSectorId);
    const doc = `=====================================================
GALACTIC EMPIRE // IMPERIAL SECURITY BUREAU & INQUISITORIUS
PURGE DIRECTIVE CODE: ${dir.directiveCode}
CLEARANCE LEVEL: ${dir.clearance}
DATE: ${dir.createdAt}
AUTHORIZING OFFICER: ${dir.author}
TARGET SECTOR: ${sector?.name || 'Unknown'} (${sector?.region || 'Outer Rim'})
=====================================================

TITLE: ${dir.title}

EXECUTIVE SUMMARY:
${dir.summary}

TACTICAL CONTAINMENT STEPS:
${dir.containmentSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

SPECIALIZED COUNTERMEASURES:
${dir.countermeasures.map(cm => `- ${cm.name}: ${cm.purpose}`).join('\n')}

AUTHORIZED BOUNTY REWARD: ${dir.rewardCredits.toLocaleString()} IMPERIAL CREDITS

BY ORDER OF THE EMPEROR - STRICT COMPLIANCE MANDATED UNDER ORDER 66.
=====================================================`;

    navigator.clipboard.writeText(doc);
    setCopiedId(dir.id);
    playTacticalClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-500" />
            IMPERIAL DIRECTIVES & ORDER 66 PURGE ARCHIVE
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Classified Imperial Security Bureau directives, sector quarantine mandates, and official Imperial warrants.
          </p>
        </div>

        <button
          onClick={() => {
            playTacticalClick();
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-rose-950 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Directive</span>
        </button>
      </div>

      {/* Main Grid: Directives List + Full Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Directives Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search directive code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-slate-500 font-mono-tech focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredDirectives.map((dir) => {
              const isSelected = selectedDirective?.id === dir.id;
              const sector = sectors.find(s => s.id === dir.targetSectorId);

              return (
                <div
                  key={dir.id}
                  onClick={() => {
                    playTacticalClick();
                    setSelectedDirective(dir);
                  }}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#161B26] border-rose-500 ring-1 ring-rose-500 shadow-md shadow-rose-950/60'
                      : 'bg-[#111827] hover:bg-[#1A2234] border-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1">
                    <span className="text-rose-400 font-bold">{dir.directiveCode}</span>
                    <span className="bg-[#4C0519] text-rose-200 px-1.5 py-0.5 rounded border border-rose-700">
                      {dir.clearance}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#F9FAFB] font-orbitron">{dir.title}</h3>
                  <p className="text-xs text-slate-400 font-mono-tech line-clamp-2 mt-1">{dir.summary}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono-tech text-slate-400 border-t border-[#1F2937] pt-1.5">
                    <span>Sector: {sector?.name || 'Outer Rim'}</span>
                    <span className="text-amber-400 font-bold">{dir.rewardCredits.toLocaleString()} Credits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Official Imperial Directive Document */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1F2937] rounded-lg p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          {selectedDirective ? (
            <div className="space-y-5">
              {/* Document Header with Stamp */}
              <div className="border-b-2 border-[#1F2937] pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono-tech text-slate-400">
                    <span className="text-rose-500 font-bold">{selectedDirective.directiveCode}</span>
                    <span>//</span>
                    <span>AUTHOR: {selectedDirective.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-orbitron text-[#F9FAFB] mt-1">
                    {selectedDirective.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyDirectiveDocument(selectedDirective)}
                    className="p-2 rounded bg-[#0A0B0E] border border-[#1F2937] text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-mono-tech"
                    title="Copy Full Classified Document"
                  >
                    {copiedId === selectedDirective.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === selectedDirective.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Clearance Stamp Banner */}
              <div className="bg-[#4C0519]/70 border border-rose-600/60 p-3 rounded text-center">
                <span className="text-xs font-orbitron font-bold text-rose-200 tracking-widest uppercase">
                  CLASSIFICATION: {selectedDirective.clearance} // STRICTLY FOR ISB & INQUISITORIUS EYES ONLY
                </span>
              </div>

              {/* Summary */}
              <div className="space-y-1 text-xs font-mono-tech">
                <span className="text-slate-300 uppercase font-bold block">1. Operational Scope & Mandate:</span>
                <p className="text-slate-200 leading-relaxed bg-[#0A0B0E] p-3 rounded border border-[#1F2937]">
                  {selectedDirective.summary}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2 text-xs font-mono-tech">
                <span className="text-slate-300 uppercase font-bold block">2. Mandatory Containment Steps:</span>
                <div className="space-y-1.5">
                  {selectedDirective.containmentSteps.map((step, idx) => (
                    <div key={idx} className="bg-[#0A0B0E] p-2.5 rounded border border-[#1F2937] flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">[{idx + 1}]</span>
                      <span className="text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countermeasures */}
              {selectedDirective.countermeasures && selectedDirective.countermeasures.length > 0 && (
                <div className="space-y-2 text-xs font-mono-tech">
                  <span className="text-cyan-400 uppercase font-bold block">3. Authorized Anti-Jedi Countermeasures:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDirective.countermeasures.map((cm, i) => (
                      <div key={i} className="bg-[#0A0B0E] p-2.5 rounded border border-[#1F2937]">
                        <div className="font-bold text-slate-200">{cm.name}</div>
                        <div className="text-[10px] text-slate-400">{cm.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward Footer */}
              <div className="bg-[#0A0B0E] p-3 rounded border border-[#1F2937] flex items-center justify-between text-xs font-mono-tech">
                <span className="text-slate-400 uppercase">Target Neutralization Bounty:</span>
                <span className="text-amber-400 font-bold font-orbitron text-sm">
                  {selectedDirective.rewardCredits.toLocaleString()} IMPERIAL CREDITS
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <FileText className="w-12 h-12 text-slate-700" />
              <div className="font-orbitron text-sm font-bold mt-2">NO DIRECTIVE SELECTED</div>
            </div>
          )}
        </div>
      </div>

      {/* Create Directive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0A0B0E] border-2 border-rose-600 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
              <h3 className="text-lg font-bold font-orbitron text-[#F9FAFB] uppercase">
                Draft Imperial Purge Directive
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-3 text-xs font-mono-tech">
              <div>
                <label className="text-slate-300 block mb-1 uppercase">Directive Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Operation Void Hunt: Kashyyyk Purge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 uppercase">Target Sector:</label>
                  <select
                    value={newTargetSector}
                    onChange={(e) => setNewTargetSector(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 uppercase">Bounty Credits:</label>
                  <input
                    type="number"
                    value={newReward}
                    onChange={(e) => setNewReward(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 uppercase">Operational Summary:</label>
                <textarea
                  rows={2}
                  placeholder="Describe the threat and tactical goal..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 uppercase">Containment Step 1:</label>
                <input
                  type="text"
                  value={newStep1}
                  onChange={(e) => setNewStep1(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 uppercase">Containment Step 2:</label>
                <input
                  type="text"
                  value={newStep2}
                  onChange={(e) => setNewStep2(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1F2937] rounded px-2.5 py-1.5 text-[#F9FAFB] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-[#1F2937] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#111827] hover:bg-[#1A2234] text-slate-300 rounded border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-orbitron font-bold uppercase tracking-wider shadow-md shadow-rose-950"
                >
                  Seal & Issue Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
