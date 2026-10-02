import React, { useState, useEffect } from 'react';
import { 
  Sector, 
  JediFugitive, 
  InquisitorUnit, 
  TransmissionSignal, 
  ImperialDirective, 
  AntiRecruitmentOperation, 
  TacticalStrikeLog 
} from './types';
import { INITIAL_SECTORS } from './data/galaxyData';
import { INITIAL_JEDI_DOSSIERS } from './data/jediDossiers';
import { INITIAL_INQUISITORS } from './data/inquisitors';
import { 
  INITIAL_SIGNALS, 
  INITIAL_DIRECTIVES, 
  INITIAL_ANTI_RECRUITMENT_OPS, 
  INITIAL_STRIKE_LOGS 
} from './data/tacticsLibrary';
import { Header } from './components/Header';
import { GalacticStarmap } from './components/GalacticStarmap';
import { SignalInterception } from './components/SignalInterception';
import { JediHuntDossiers } from './components/JediHuntDossiers';
import { AntiRecruitmentStudio } from './components/AntiRecruitmentStudio';
import { ISBTacticalAIWarRoom } from './components/ISBTacticalAIWarRoom';
import { ImperialDirectivesArchive } from './components/ImperialDirectivesArchive';
import { 
  Compass, 
  Radio, 
  Flame, 
  Users, 
  Cpu, 
  FileText, 
  ShieldAlert, 
  RefreshCw,
  Crosshair
} from 'lucide-react';
import { playTacticalClick, playRadarPing } from './utils/soundEffects';

type ActiveTab = 'starmap' | 'signals' | 'dossiers' | 'anti-recruitment' | 'war-room' | 'directives';

export default function App() {
  // Persistent or initial states
  const [sectors, setSectors] = useState<Sector[]>(() => {
    const saved = localStorage.getItem('imperial_sectors');
    return saved ? JSON.parse(saved) : INITIAL_SECTORS;
  });

  const [fugitives, setFugitives] = useState<JediFugitive[]>(() => {
    const saved = localStorage.getItem('imperial_fugitives');
    return saved ? JSON.parse(saved) : INITIAL_JEDI_DOSSIERS;
  });

  const [inquisitors, setInquisitors] = useState<InquisitorUnit[]>(() => {
    const saved = localStorage.getItem('imperial_inquisitors');
    return saved ? JSON.parse(saved) : INITIAL_INQUISITORS;
  });

  const [signals, setSignals] = useState<TransmissionSignal[]>(() => {
    const saved = localStorage.getItem('imperial_signals');
    return saved ? JSON.parse(saved) : INITIAL_SIGNALS;
  });

  const [directives, setDirectives] = useState<ImperialDirective[]>(() => {
    const saved = localStorage.getItem('imperial_directives');
    return saved ? JSON.parse(saved) : INITIAL_DIRECTIVES;
  });

  const [operations, setOperations] = useState<AntiRecruitmentOperation[]>(() => {
    const saved = localStorage.getItem('imperial_operations');
    return saved ? JSON.parse(saved) : INITIAL_ANTI_RECRUITMENT_OPS;
  });

  const [strikeLogs, setStrikeLogs] = useState<TacticalStrikeLog[]>(() => {
    const saved = localStorage.getItem('imperial_strike_logs');
    return saved ? JSON.parse(saved) : INITIAL_STRIKE_LOGS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('starmap');
  const [selectedSector, setSelectedSector] = useState<Sector | null>(INITIAL_SECTORS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('imperial_sectors', JSON.stringify(sectors));
  }, [sectors]);
  useEffect(() => {
    localStorage.setItem('imperial_fugitives', JSON.stringify(fugitives));
  }, [fugitives]);
  useEffect(() => {
    localStorage.setItem('imperial_inquisitors', JSON.stringify(inquisitors));
  }, [inquisitors]);
  useEffect(() => {
    localStorage.setItem('imperial_signals', JSON.stringify(signals));
  }, [signals]);
  useEffect(() => {
    localStorage.setItem('imperial_directives', JSON.stringify(directives));
  }, [directives]);
  useEffect(() => {
    localStorage.setItem('imperial_operations', JSON.stringify(operations));
  }, [operations]);
  useEffect(() => {
    localStorage.setItem('imperial_strike_logs', JSON.stringify(strikeLogs));
  }, [strikeLogs]);

  // Handlers
  const handleToggleBlockade = (sectorId: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === sectorId) {
        const nextState = !s.blockadeActive;
        const nextAlert = nextState ? 'CRITICAL' : s.alertLevel;
        return {
          ...s,
          blockadeActive: nextState,
          alertLevel: nextAlert,
          garrisonStrength: nextState ? Math.min(100, s.garrisonStrength + 15) : Math.max(30, s.garrisonStrength - 15)
        };
      }
      return s;
    }));
    if (selectedSector?.id === sectorId) {
      setSelectedSector(prev => prev ? { ...prev, blockadeActive: !prev.blockadeActive } : null);
    }
  };

  const handleDeployProbes = (sectorId: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === sectorId) {
        return {
          ...s,
          probeDroidsCount: s.probeDroidsCount + 5,
          kyberDisturbance: Math.max(20, Math.min(99, s.kyberDisturbance + Math.floor(Math.random() * 8) - 4))
        };
      }
      return s;
    }));
    if (selectedSector?.id === sectorId) {
      setSelectedSector(prev => prev ? { ...prev, probeDroidsCount: prev.probeDroidsCount + 5 } : null);
    }
  };

  const handleDispatchToSector = (sector: Sector) => {
    setSelectedSector(sector);
    setActiveTab('dossiers');
  };

  const handleUpdateSignal = (updated: TransmissionSignal) => {
    setSignals(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeployTrapToSector = (signal: TransmissionSignal) => {
    const updated: TransmissionSignal = {
      ...signal,
      status: 'TRAP_DEPLOYED'
    };
    handleUpdateSignal(updated);
    setSectors(prev => prev.map(s => {
      if (s.id === signal.originSectorId) {
        return { ...s, garrisonStrength: Math.min(100, s.garrisonStrength + 10) };
      }
      return s;
    }));
  };

  const handleUpdateFugitive = (updated: JediFugitive) => {
    setFugitives(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const handleAddStrikeLog = (newLog: TacticalStrikeLog) => {
    setStrikeLogs(prev => [newLog, ...prev]);
  };

  const handleAddDirective = (newDirective: ImperialDirective) => {
    setDirectives(prev => [newDirective, ...prev]);
  };

  const handleAddOperation = (newOp: AntiRecruitmentOperation) => {
    setOperations(prev => [newOp, ...prev]);
  };

  const handleEmergencyScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSectors(prev => prev.map(s => ({
        ...s,
        kyberDisturbance: Math.max(15, Math.min(99, s.kyberDisturbance + Math.floor(Math.random() * 10) - 5))
      })));
    }, 1500);
  };

  // Metrics
  const activeThreats = fugitives.filter(f => f.status !== 'ELIMINATED').length;
  const avgKyber = Math.round(sectors.reduce((acc, s) => acc + s.kyberDisturbance, 0) / sectors.length);

  const navItems = [
    { id: 'starmap', label: 'Galactic Starmap', icon: Compass, badge: `${sectors.length} Sectors` },
    { id: 'signals', label: 'Signal Intercepts', icon: Radio, badge: `${signals.filter(s => s.status === 'ENCRYPTED').length} Encrypted` },
    { id: 'dossiers', label: 'Jedi Hunt & Strikes', icon: Flame, badge: `${activeThreats} At Large` },
    { id: 'anti-recruitment', label: 'Anti-Recruitment & Harvester', icon: Users, badge: `${operations.length} Active` },
    { id: 'war-room', label: 'ISB Tactical AI', icon: Cpu, badge: 'Neural Core' },
    { id: 'directives', label: 'Purge Directives', icon: FileText, badge: `${directives.length} Issued` },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F3F4F6] flex flex-col selection:bg-rose-600 selection:text-white font-sans antialiased relative">
      {/* Background Ambience Layer */}
      <div className="fixed inset-0 pointer-events-none holo-grid opacity-30 z-0"></div>
      <div className="fixed inset-0 pointer-events-none imperial-scanlines opacity-40 z-10"></div>

      {/* Main Imperial Header */}
      <Header
        activeThreatCount={activeThreats}
        totalKyberDisturbance={avgKyber}
        onEmergencyScan={handleEmergencyScan}
        isScanning={isScanning}
      />

      {/* Navigation Tabs Bar */}
      <div className="relative z-20 bg-[#0E121A]/95 border-b border-[#1F2937] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  playTacticalClick();
                  setActiveTab(item.id as ActiveTab);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-orbitron text-xs uppercase tracking-wider transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-rose-600 border-rose-500 text-white font-bold shadow-lg shadow-rose-950/80 ring-1 ring-rose-400/50'
                    : 'bg-[#111827]/90 hover:bg-[#1A2234] border-[#1F2937] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-tech ${
                    isActive ? 'bg-[#4C0519] text-rose-200' : 'bg-[#0A0B0E] text-slate-400 border border-[#1F2937]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Viewport */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'starmap' && (
          <GalacticStarmap
            sectors={sectors}
            fugitives={fugitives}
            inquisitors={inquisitors}
            onSelectSector={(sector) => setSelectedSector(sector)}
            selectedSector={selectedSector}
            onToggleBlockade={handleToggleBlockade}
            onDeployProbes={handleDeployProbes}
            onDispatchToSector={handleDispatchToSector}
          />
        )}

        {activeTab === 'signals' && (
          <SignalInterception
            signals={signals}
            sectors={sectors}
            onUpdateSignal={handleUpdateSignal}
            onDeployTrapToSector={handleDeployTrapToSector}
          />
        )}

        {activeTab === 'dossiers' && (
          <JediHuntDossiers
            fugitives={fugitives}
            inquisitors={inquisitors}
            sectors={sectors}
            onUpdateFugitive={handleUpdateFugitive}
            onAddStrikeLog={handleAddStrikeLog}
          />
        )}

        {activeTab === 'anti-recruitment' && (
          <AntiRecruitmentStudio
            operations={operations}
            sectors={sectors}
            onAddOperation={handleAddOperation}
          />
        )}

        {activeTab === 'war-room' && (
          <ISBTacticalAIWarRoom
            sectors={sectors}
            fugitives={fugitives}
            strikeLogs={strikeLogs}
            onSaveDirective={handleAddDirective}
          />
        )}

        {activeTab === 'directives' && (
          <ImperialDirectivesArchive
            directives={directives}
            sectors={sectors}
            onAddDirective={handleAddDirective}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#1F2937] bg-[#0A0B0E]/95 py-3.5 px-4 text-center text-xs font-mono-tech text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>IMPERIAL SECURITY BUREAU // INQUISITORIUS TACTICAL DIRECTIVE 66</span>
          <span className="text-slate-400">UNAUTHORIZED ACCESS PUNISHABLE BY IMMEDIATE DISINTEGRATION</span>
          <span className="text-rose-500 font-semibold tracking-wider">FOR THE GLORY OF THE GALACTIC EMPIRE</span>
        </div>
      </footer>
    </div>
  );
}
