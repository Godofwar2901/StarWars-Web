import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Radio, 
  Flame, 
  Radar, 
  AlertTriangle,
  Compass,
  Cpu
} from 'lucide-react';
import { 
  isSoundEnabled, 
  setSoundEnabled, 
  playTacticalClick, 
  playRedAlert, 
  playRadarPing 
} from '../utils/soundEffects';

interface HeaderProps {
  activeThreatCount: number;
  totalKyberDisturbance: number;
  onEmergencyScan: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeThreatCount,
  totalKyberDisturbance,
  onEmergencyScan,
  isScanning
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [imperialTime, setImperialTime] = useState('');
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const st = `IMPERIAL ST-CYCLE ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')} // 19 BBY`;
      setImperialTime(st);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTacticalClick();
  };

  const triggerAlert = () => {
    setEmergencyAlert(true);
    playRedAlert();
    setTimeout(() => setEmergencyAlert(false), 5000);
  };

  return (
    <header className="relative border-b border-[#1F2937] bg-[#0A0B0E]/95 backdrop-blur-md z-30">
      {/* Top Warning Ribbon */}
      <div className="bg-[#4C0519]/80 border-b border-rose-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-rose-300 font-mono-tech tracking-wider">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span className="font-bold text-rose-400">GALACTIC PURGE DIRECTIVE // ORDER 66 IN EFFECT</span>
          <span className="hidden sm:inline text-rose-400/60">|</span>
          <span className="hidden sm:inline text-slate-400">TARGET: HCET SYNDICATE & JEDI COALITION</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 hidden md:inline">{imperialTime}</span>
          <div className="flex items-center space-x-1 bg-[#881337]/50 px-2 py-0.5 border border-rose-500/40 text-[11px] text-rose-200 uppercase rounded">
            <Flame className="w-3 h-3 text-rose-400" />
            <span className="font-semibold tracking-wider">Clearance: Inquisitorius Prime</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Imperial Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-rose-900 via-[#1F121A] to-[#0A0B0E] border border-rose-500/50 flex items-center justify-center shadow-lg shadow-rose-950/50">
            {/* Custom SVG Galactic Imperial Crest Symbol */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-rose-500 fill-current">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" fill="none" />
              <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="4" fill="none" />
              <line x1="50" y1="6" x2="50" y2="28" stroke="currentColor" strokeWidth="6" />
              <line x1="50" y1="72" x2="50" y2="94" stroke="currentColor" strokeWidth="6" />
              <line x1="6" y1="50" x2="28" y2="50" stroke="currentColor" strokeWidth="6" />
              <line x1="72" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="6" />
              <line x1="18.9" y1="18.9" x2="34.5" y2="34.5" stroke="currentColor" strokeWidth="5" />
              <line x1="65.5" y1="65.5" x2="81.1" y2="81.1" stroke="currentColor" strokeWidth="5" />
              <line x1="18.9" y1="81.1" x2="34.5" y2="65.5" stroke="currentColor" strokeWidth="5" />
              <line x1="65.5" y1="34.5" x2="81.1" y2="18.9" stroke="currentColor" strokeWidth="5" />
            </svg>
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-rose-500/20 pointer-events-none"></div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-wider text-[#F9FAFB] font-orbitron flex items-center gap-2">
                IMPERIAL PURGE COMMAND
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-600 text-white tracking-widest uppercase shadow-sm">
                  ISB-INQ
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech tracking-wide">
              GALACTIC TRACKING, HCET INTERCEPTION & ANTI-RECRUITMENT PORTAL
            </p>
          </div>
        </div>

        {/* Tactical Telemetry Metrics & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Active Threats Counter */}
          <div className="bg-[#111827] border border-[#1F2937] px-3 py-1.5 rounded flex items-center space-x-2.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-mono-tech uppercase">Active Jedi Fugitives</div>
              <div className="text-sm font-bold text-amber-400 font-orbitron">{activeThreatCount} Targets</div>
            </div>
          </div>

          {/* Kyber Disturbance Index */}
          <div className="bg-[#111827] border border-[#1F2937] px-3 py-1.5 rounded flex items-center space-x-2.5 shadow-sm">
            <Radio className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-mono-tech uppercase">Kyber Disturbance</div>
              <div className="text-sm font-bold text-cyan-300 font-orbitron">{totalKyberDisturbance}% Anomaly</div>
            </div>
          </div>

          {/* Quick Scan Action */}
          <button
            id="btn-emergency-scan"
            onClick={() => {
              playRadarPing();
              onEmergencyScan();
            }}
            disabled={isScanning}
            className={`px-3.5 py-1.5 rounded font-orbitron text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition border ${
              isScanning 
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 cursor-wait' 
                : 'bg-rose-600 hover:bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-950/60'
            }`}
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">{isScanning ? 'Scanning Galaxy...' : 'Sector Sweep'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            title={soundOn ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
            className="p-2 rounded bg-[#111827] hover:bg-[#1A2234] border border-[#1F2937] text-slate-300 hover:text-white transition"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Alert Simulator */}
          <button
            id="btn-red-alert"
            onClick={triggerAlert}
            title="Broadcast Level 5 Force Alarm"
            className="p-2 rounded bg-[#111827] hover:bg-rose-950 border border-[#1F2937] hover:border-rose-600 text-slate-300 hover:text-rose-400 transition"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if triggered */}
      {emergencyAlert && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold font-orbitron tracking-widest uppercase animate-pulse flex items-center justify-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>[ALERT 66] PRIORITY DISTURBANCE DETECTED — INQUISITORIUS SQUADS STAND BY FOR IMMEDIATE HYPERSPACE VECTORING</span>
          <AlertTriangle className="w-4 h-4" />
        </div>
      )}
    </header>
  );
};
