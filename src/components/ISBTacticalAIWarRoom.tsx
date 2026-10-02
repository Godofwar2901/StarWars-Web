import React, { useState } from 'react';
import { 
  Sector, 
  JediFugitive, 
  TacticalStrikeLog, 
  ImperialDirective 
} from '../types';
import { 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Crosshair, 
  Terminal, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  FileText,
  AlertTriangle,
  Zap,
  BookmarkPlus
} from 'lucide-react';
import { playTacticalClick, playLockOn, playCipherDecrypt } from '../utils/soundEffects';

interface ISBTacticalAIWarRoomProps {
  sectors: Sector[];
  fugitives: JediFugitive[];
  strikeLogs: TacticalStrikeLog[];
  onSaveDirective: (directive: ImperialDirective) => void;
}

export const ISBTacticalAIWarRoom: React.FC<ISBTacticalAIWarRoomProps> = ({
  sectors,
  fugitives,
  strikeLogs,
  onSaveDirective
}) => {
  const [scenarioInput, setScenarioInput] = useState<string>(
    'HCET Syndicate operatives have established a covert Force initiate transit hub in the subterranean catacombs of Jedha. Reports indicate three Padawans and one Jedi Master are preparing an off-world escape shuttle.'
  );
  const [targetJedi, setTargetJedi] = useState<string>('Quinlan Vos & Clandestine Cell');
  const [selectedSectorName, setSelectedSectorName] = useState<string>('Jedha');
  const [threatRating, setThreatRating] = useState<string>('Omega (Extreme Priority)');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [tacticalPlan, setTacticalPlan] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const presetScenarios = [
    {
      title: 'Jedha Holy Catacomb Infiltration',
      sector: 'Jedha',
      target: 'Cere Junda & Initiate Team',
      threat: 'Omega (Extreme Priority)',
      prompt: 'HCET operatives attempting to smuggle ancient temple holocrons and 4 Force-sensitive initiates through the holy catacombs of Jedha.'
    },
    {
      title: 'Bracca Venator Scrapper Ambush',
      sector: 'Bracca',
      target: 'Cal Kestis',
      threat: 'Alpha',
      prompt: 'Fugitive Padawan Cal Kestis spotted inside decommissioned Venator Star Destroyer engine core. Local scrapper guild acting as shields.'
    },
    {
      title: 'Daiyu Underworld Spice Transport',
      sector: 'Daiyu',
      target: 'Quinlan Vos',
      threat: 'Omega (Extreme Priority)',
      prompt: 'Master Quinlan Vos utilizing spice smuggler false credentials to transport younglings across Daiyu neon district.'
    },
    {
      title: 'Ilum Crystal Cavern Lockdown',
      sector: 'Ilum',
      target: 'Kirak Infil\'a',
      threat: 'Omega (Extreme Priority)',
      prompt: 'Master Kirak Infil\'a training rogue Force wielders inside sacred crystal caves to build weapons.'
    }
  ];

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsThinking(true);
    playCipherDecrypt();

    try {
      const res = await fetch('/api/tactical/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarioInput,
          targetJedi,
          sector: selectedSectorName,
          forceThreatLevel: threatRating,
          imperialForces: ['Inquisitorius Lead Hunter', '501st Purge Battalion', 'Interdictor Cruiser', 'ID9 Seeker Droids']
        })
      });

      const data = await res.json();
      setTacticalPlan(data);
      playLockOn();
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSaveAsDirective = () => {
    if (!tacticalPlan) return;

    const newDirective: ImperialDirective = {
      id: `dir-${Date.now().toString().slice(-4)}`,
      directiveCode: tacticalPlan.directiveCode || `DIR-66-ISB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: tacticalPlan.recommendedTactic || 'Operation Imperial Cleanse',
      author: 'ISB Tactical AI Unit // Lord Vader Authorization',
      clearance: 'PRIORITY ONE',
      targetSectorId: sectors.find(s => s.name === selectedSectorName)?.id || 'sec-jedha',
      summary: tacticalPlan.threatAnalysis || 'Targeted purge operation against HCET Syndicate cell.',
      containmentSteps: tacticalPlan.containmentStrategy || ['Orbital lockdown', 'Inquisitorius deployment'],
      countermeasures: tacticalPlan.countermeasures || [{ name: 'Cortosis Blades', purpose: 'Parry lightsabers' }],
      rewardCredits: 500000,
      status: 'ACTIVE',
      createdAt: '19 BBY Imperial Standard'
    };

    onSaveDirective(newDirective);
    setSavedSuccess(true);
    playTacticalClick();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-500" />
            ISB TACTICAL AI WAR ROOM // STRATEGIC ADVISOR
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Powered by Imperial Neural Core (Gemini 3.7 Flash). Formulate real-time containment plans against emerging HCET Syndicate tactics.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0A0B0E] px-3 py-1.5 rounded border border-[#1F2937] text-xs font-mono-tech text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>NEURAL CORE ONLINE // CLEARANCE OMEGA</span>
        </div>
      </div>

      {/* Preset Scenarios Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono-tech">
        <span className="text-slate-400 uppercase flex items-center gap-1 whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Crisis Simulations:
        </span>
        {presetScenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => {
              playTacticalClick();
              setSelectedSectorName(sc.sector);
              setTargetJedi(sc.target);
              setThreatRating(sc.threat);
              setScenarioInput(sc.prompt);
            }}
            className="px-2.5 py-1 bg-[#0A0B0E] hover:bg-[#1A2234] border border-[#1F2937] hover:border-slate-700 text-slate-300 rounded whitespace-nowrap transition"
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Input Console + Tactical Plan Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical Scenario Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-slate-200 uppercase">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Tactical Engagement Parameters</span>
            </div>

            <form onSubmit={handleRunSimulation} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                  Target Jedi / HCET Cell:
                </label>
                <input
                  type="text"
                  value={targetJedi}
                  onChange={(e) => setTargetJedi(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                    Target Sector:
                  </label>
                  <select
                    value={selectedSectorName}
                    onChange={(e) => setSelectedSectorName(e.target.value)}
                    className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.region})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                    Threat Rating:
                  </label>
                  <select
                    value={threatRating}
                    onChange={(e) => setThreatRating(e.target.value)}
                    className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500"
                  >
                    <option value="Omega (Extreme Priority)">Omega (Extreme)</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Beta">Beta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono-tech text-slate-300 block mb-1 uppercase">
                  Tactical Situation & Intel Report:
                </label>
                <textarea
                  rows={4}
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isThinking}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-[#161B26] disabled:text-slate-500 text-white rounded font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-950/60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isThinking ? 'Calculating Strategic Vectors...' : 'Synthesize AI Tactical Plan'}</span>
              </button>
            </form>
          </div>

          {/* Historical After-Action Logs */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-slate-200 uppercase">
              <span>Recent Purge Raid Logs</span>
              <span className="text-rose-400 font-mono-tech">[{strikeLogs.length} Logged]</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {strikeLogs.map(log => (
                <div key={log.id} className="bg-[#0A0B0E] p-2 rounded border border-[#1F2937] text-xs font-mono-tech">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-[#F9FAFB]">{log.targetJediName}</span>
                    <span className="text-amber-400">{log.outcome.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical Strategic Blueprint Terminal */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1F2937] rounded-lg p-5 flex flex-col justify-between shadow-xl">
          {tacticalPlan ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#1F2937] pb-3">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono-tech text-rose-400 font-bold uppercase">
                    <span>{tacticalPlan.directiveCode || 'DIRECTIVE-66-ISB'}</span>
                    <span>//</span>
                    <span>SUCCESS RATIO: {tacticalPlan.estimatedSuccessRate || 88}%</span>
                  </div>
                  <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-0.5">
                    {tacticalPlan.recommendedTactic || 'Operation Dark Shroud'}
                  </h3>
                </div>

                <button
                  onClick={handleSaveAsDirective}
                  className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold uppercase tracking-wider flex items-center space-x-1.5 transition ${
                    savedSuccess 
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300' 
                      : 'bg-[#4C0519] hover:bg-rose-900 border border-rose-600 text-rose-200'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved to Archive!' : 'Save Directive'}</span>
                </button>
              </div>

              {/* Threat Analysis */}
              <div className="bg-[#0A0B0E] p-3.5 rounded border border-[#1F2937] text-xs font-mono-tech">
                <span className="text-slate-300 uppercase font-bold block mb-1">
                  ISB Intelligence Threat Analysis:
                </span>
                <p className="text-slate-200 leading-relaxed">{tacticalPlan.threatAnalysis}</p>
              </div>

              {/* Containment Steps */}
              <div>
                <span className="text-xs font-orbitron font-bold text-slate-200 uppercase block mb-2">
                  Tactical Containment Protocol:
                </span>
                <div className="space-y-1.5">
                  {tacticalPlan.containmentStrategy?.map((step: string, idx: number) => (
                    <div key={idx} className="bg-[#0A0B0E] p-2 rounded border border-[#1F2937] flex items-center space-x-2 text-xs font-mono-tech">
                      <span className="w-4 h-4 rounded-full bg-[#4C0519] border border-rose-600 text-rose-300 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialized Countermeasures */}
              {tacticalPlan.countermeasures && (
                <div>
                  <span className="text-xs font-orbitron font-bold text-cyan-400 uppercase block mb-2">
                    Anti-Force Countermeasure Matrix:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tacticalPlan.countermeasures.map((cm: any, idx: number) => (
                      <div key={idx} className="bg-[#0A0B0E] p-2 rounded border border-[#1F2937] text-xs font-mono-tech">
                        <div className="font-bold text-slate-200">{cm.name}</div>
                        <div className="text-[10px] text-slate-400">{cm.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anti-Recruitment Protocol */}
              {tacticalPlan.recruitmentDisruptionProtocol && (
                <div className="bg-[#0A0B0E] border border-amber-900/50 p-3 rounded text-xs font-mono-tech">
                  <span className="text-amber-400 font-bold uppercase block mb-0.5">
                    Recruitment Severance Directive:
                  </span>
                  <p className="text-slate-300">{tacticalPlan.recruitmentDisruptionProtocol}</p>
                </div>
              )}

              {/* Inquisitor Quote */}
              {tacticalPlan.inquisitorAdvice && (
                <div className="bg-[#4C0519]/40 border-l-2 border-rose-600 p-3 text-xs font-mono-tech italic text-rose-200">
                  "{tacticalPlan.inquisitorAdvice}"
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
              <Cpu className="w-12 h-12 text-slate-700 animate-pulse" />
              <div className="font-orbitron text-sm uppercase font-bold text-slate-400">
                Awaiting Tactical Parameters
              </div>
              <p className="text-xs font-mono-tech max-w-sm">
                Enter an operational scenario or choose a quick crisis above, then click "Synthesize AI Tactical Plan" to generate an authoritative Imperial strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
