import React, { useState } from 'react';
import { 
  Sector, 
  JediFugitive, 
  InquisitorUnit, 
  SectorRegion,
  AlertLevel
} from '../types';
import { 
  Compass, 
  Shield, 
  Radio, 
  Crosshair, 
  Flame, 
  Layers, 
  MapPin, 
  Search, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Navigation,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { playTacticalClick, playLockOn, playRadarPing } from '../utils/soundEffects';

interface GalacticStarmapProps {
  sectors: Sector[];
  fugitives: JediFugitive[];
  inquisitors: InquisitorUnit[];
  onSelectSector: (sector: Sector) => void;
  selectedSector: Sector | null;
  onToggleBlockade: (sectorId: string) => void;
  onDeployProbes: (sectorId: string) => void;
  onDispatchToSector: (sector: Sector) => void;
}

export const GalacticStarmap: React.FC<GalacticStarmapProps> = ({
  sectors,
  fugitives,
  inquisitors,
  onSelectSector,
  selectedSector,
  onToggleBlockade,
  onDeployProbes,
  onDispatchToSector
}) => {
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showKyberHeatmap, setShowKyberHeatmap] = useState<boolean>(true);
  const [showBlockades, setShowBlockades] = useState<boolean>(true);
  const [showPatrols, setShowPatrols] = useState<boolean>(true);

  // Filtered sectors
  const filteredSectors = sectors.filter(s => {
    if (regionFilter !== 'ALL' && s.region !== regionFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.region.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getAlertColor = (level: AlertLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-600 text-white border-rose-400 shadow-rose-500/50';
      case 'HIGH': return 'bg-orange-600 text-white border-orange-400 shadow-orange-500/50';
      case 'ELEVATED': return 'bg-amber-600 text-white border-amber-400 shadow-amber-500/50';
      case 'GUARDED': return 'bg-cyan-700 text-white border-cyan-400 shadow-cyan-500/50';
      default: return 'bg-slate-700 text-slate-200 border-slate-500';
    }
  };

  const getSectorFugitives = (sectorId: string) => {
    return fugitives.filter(f => f.currentSectorId === sectorId && f.status !== 'ELIMINATED');
  };

  const getSectorInquisitors = (sectorId: string) => {
    return inquisitors.filter(i => i.assignedSectorId === sectorId);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Toolbar */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        {/* Search & Region Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search planet or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono-tech"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'Core Worlds', 'Inner Rim', 'Mid Rim', 'Outer Rim', 'Unknown Regions'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => {
                  playTacticalClick();
                  setRegionFilter(reg);
                }}
                className={`px-3 py-1 text-xs rounded font-orbitron transition whitespace-nowrap border ${
                  regionFilter === reg
                    ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-sm'
                    : 'bg-[#0A0B0E] text-slate-400 hover:text-slate-200 hover:bg-[#1A2234] border-[#1F2937]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Layer Toggles */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono-tech text-slate-300">
          <span className="text-slate-500 uppercase flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" /> Overlays:
          </span>
          <button
            onClick={() => setShowKyberHeatmap(!showKyberHeatmap)}
            className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
              showKyberHeatmap 
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300' 
                : 'bg-[#0A0B0E] border-[#1F2937] text-slate-500'
            }`}
          >
            Kyber Resonance
          </button>
          <button
            onClick={() => setShowBlockades(!showBlockades)}
            className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
              showBlockades 
                ? 'bg-rose-950/80 border-rose-500 text-rose-300' 
                : 'bg-[#0A0B0E] border-[#1F2937] text-slate-500'
            }`}
          >
            Blockade Fleet
          </button>
          <button
            onClick={() => setShowPatrols(!showPatrols)}
            className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
              showPatrols 
                ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                : 'bg-[#0A0B0E] border-[#1F2937] text-slate-500'
            }`}
          >
            Inquisitor Patrols
          </button>
        </div>
      </div>

      {/* Main Grid: Star Chart + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Galactic Chart Canvas View */}
        <div className="lg:col-span-8 bg-[#0A0B0E] border border-[#1F2937] rounded-lg relative overflow-hidden p-6 min-h-[560px] flex flex-col justify-between shadow-2xl holo-grid">
          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-[180%] h-[180%] -left-[40%] -top-[40%] rounded-full border border-rose-500/20 absolute animate-radar bg-gradient-to-tr from-transparent via-rose-500/5 to-transparent"></div>
          </div>

          {/* Deep Galactic Core Visual */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-900/10 blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-[#1F2937] pointer-events-none flex items-center justify-center text-[10px] text-slate-600 font-mono-tech">
            GALACTIC CORE
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-[#1F2937]/70 pointer-events-none"></div>

          {/* Starmap Header / Coordinate readout */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono-tech border-b border-[#1F2937] pb-2.5">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-rose-500" />
              <span className="text-[#F9FAFB] font-bold uppercase">AUREK-7 TACTICAL STAR CHART</span>
              <span className="text-rose-400">[{filteredSectors.length} Sectors Tracked]</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>PROBE GRID: OPTIMAL</span>
              <span>GRID MATRIX: 120 x 80 LY</span>
            </div>
          </div>

          {/* Interactive Sector Nodes */}
          <div className="relative w-full h-[440px] my-4">
            {/* Sector Points */}
            {filteredSectors.map((sector) => {
              const isSelected = selectedSector?.id === sector.id;
              const fugitiveCount = getSectorFugitives(sector.id).length;
              const inquisitorCount = getSectorInquisitors(sector.id).length;

              return (
                <div
                  key={sector.id}
                  id={`sector-node-${sector.id}`}
                  style={{ left: `${sector.x}%`, top: `${sector.y}%` }}
                  onClick={() => {
                    playLockOn();
                    onSelectSector(sector);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-20`}
                >
                  {/* Kyber Disturbance Halo */}
                  {showKyberHeatmap && sector.kyberDisturbance > 60 && (
                    <div 
                      className={`absolute -inset-3 rounded-full animate-ping pointer-events-none opacity-40 ${
                        sector.kyberDisturbance > 85 ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}
                    ></div>
                  )}

                  {/* Marker Pin */}
                  <div className={`relative p-2 rounded-full border transition-all transform group-hover:scale-125 ${
                    isSelected 
                      ? 'bg-rose-600 border-white ring-4 ring-rose-500/40 scale-125 shadow-lg shadow-rose-600/70' 
                      : sector.hcetCellActivity === 'ACTIVE_RECRUITMENT'
                      ? 'bg-rose-950 border-rose-500 shadow-md shadow-rose-900/60'
                      : sector.hcetCellActivity === 'CONFIRMED'
                      ? 'bg-amber-950 border-amber-500'
                      : 'bg-[#111827] border-[#1F2937]'
                  }`}>
                    {/* Icon based on state */}
                    {sector.blockadeActive && showBlockades ? (
                      <Shield className="w-3.5 h-3.5 text-rose-400" />
                    ) : fugitiveCount > 0 ? (
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                    )}

                    {/* Badge for Jedi Count */}
                    {fugitiveCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 rounded-full font-bold text-[9px] flex items-center justify-center">
                        {fugitiveCount}
                      </span>
                    )}

                    {/* Badge for Inquisitor */}
                    {inquisitorCount > 0 && showPatrols && (
                      <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-rose-600 text-white rounded-full font-bold text-[9px] flex items-center justify-center border border-white">
                        {inquisitorCount}
                      </span>
                    )}
                  </div>

                  {/* Planet Label */}
                  <div className={`mt-1 text-center whitespace-nowrap transition pointer-events-none ${
                    isSelected ? 'font-bold text-rose-400' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    <div className="text-[11px] font-orbitron drop-shadow">{sector.name}</div>
                    <div className="text-[9px] font-mono-tech text-slate-400">
                      {sector.alertLevel} // {sector.kyberDisturbance}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Starmap Legend */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#1F2937] text-[11px] font-mono-tech text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span>Critical / Active Recruitment</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Confirmed HCET Cell</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>High Kyber Resonance</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span>Guarded / Purged</span>
            </div>
          </div>
        </div>

        {/* Sector Tactical Intelligence Inspector */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-lg p-5 flex flex-col justify-between shadow-xl">
          {selectedSector ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="border-b border-[#1F2937] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest">SECTOR INTEL // {selectedSector.region}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-orbitron border ${getAlertColor(selectedSector.alertLevel)}`}>
                    {selectedSector.alertLevel} ALERT
                  </span>
                </div>
                <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-1 flex items-center gap-2">
                  {selectedSector.name}
                  {selectedSector.blockadeActive && (
                    <span className="text-[10px] bg-rose-900/80 text-rose-300 px-2 py-0.5 rounded border border-rose-600 font-mono-tech">
                      BLOCKADE ACTIVE
                    </span>
                  )}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0A0B0E] p-3 rounded border border-[#1F2937]">
                {selectedSector.description}
              </p>

              {/* Telemetry Gauges */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono-tech text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" /> Kyber Disturbance Index
                    </span>
                    <span className="font-bold text-cyan-300">{selectedSector.kyberDisturbance}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0B0E] rounded overflow-hidden border border-[#1F2937]">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        selectedSector.kyberDisturbance > 80 ? 'bg-rose-500' : selectedSector.kyberDisturbance > 50 ? 'bg-cyan-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${selectedSector.kyberDisturbance}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono-tech text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-rose-400" /> Imperial Garrison Strength
                    </span>
                    <span className="font-bold text-rose-300">{selectedSector.garrisonStrength}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0B0E] rounded overflow-hidden border border-[#1F2937]">
                    <div 
                      className="h-full bg-rose-600 transition-all duration-500"
                      style={{ width: `${selectedSector.garrisonStrength}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Active Fugitives in this sector */}
              <div>
                <div className="text-xs font-orbitron font-bold text-slate-200 mb-2 uppercase flex items-center justify-between">
                  <span>Tracked Jedi Fugitives</span>
                  <span className="text-amber-400 font-mono-tech">{getSectorFugitives(selectedSector.id).length} Sighted</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {getSectorFugitives(selectedSector.id).length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-2 bg-[#0A0B0E] rounded border border-[#1F2937]">
                      No active Jedi fugitives confirmed at current coordinates.
                    </div>
                  ) : (
                    getSectorFugitives(selectedSector.id).map(f => (
                      <div key={f.id} className="bg-[#0A0B0E] border border-[#1F2937] p-2 rounded flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#F9FAFB]">{f.name}</div>
                          <div className="text-[10px] text-amber-400 font-mono-tech">{f.formerRank} // {f.lightsaberColor} Saber</div>
                        </div>
                        <span className="text-[10px] bg-[#4C0519] text-rose-200 px-1.5 py-0.5 rounded border border-rose-800">
                          {f.threatLevel.split(' ')[0]}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notable Locations */}
              <div>
                <div className="text-xs font-orbitron font-bold text-slate-200 mb-1.5 uppercase">
                  Notable Hotspots & Catacombs
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSector.notableLocations.map((loc, i) => (
                    <span key={i} className="text-[11px] font-mono-tech bg-[#0A0B0E] px-2 py-0.5 rounded border border-[#1F2937] text-slate-300">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sector Actions */}
              <div className="pt-3 border-t border-[#1F2937] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playTacticalClick();
                      onToggleBlockade(selectedSector.id);
                    }}
                    className={`py-2 px-2 rounded font-orbitron text-xs font-semibold uppercase tracking-wider transition border ${
                      selectedSector.blockadeActive
                        ? 'bg-[#1A2234] hover:bg-[#253046] text-slate-300 border-[#374151]'
                        : 'bg-[#4C0519] hover:bg-[#881337] text-rose-200 border-rose-600'
                    }`}
                  >
                    {selectedSector.blockadeActive ? 'Lift Blockade' : 'Impose Blockade'}
                  </button>

                  <button
                    onClick={() => {
                      playRadarPing();
                      onDeployProbes(selectedSector.id);
                    }}
                    className="py-2 px-2 rounded font-orbitron text-xs font-semibold uppercase tracking-wider bg-[#0A0B0E] hover:bg-[#1A2234] text-cyan-300 border border-cyan-800 hover:border-cyan-500 transition"
                  >
                    +5 Probe Droids ({selectedSector.probeDroidsCount})
                  </button>
                </div>

                <button
                  onClick={() => {
                    playLockOn();
                    onDispatchToSector(selectedSector);
                  }}
                  className="w-full py-2.5 rounded font-orbitron text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60 transition flex items-center justify-center space-x-1.5"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Launch Inquisitor Strike Squad</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
              <Crosshair className="w-12 h-12 text-slate-700 animate-pulse" />
              <div className="font-orbitron text-sm uppercase font-bold text-slate-400">
                NO SECTOR TARGETED
              </div>
              <p className="text-xs font-mono-tech max-w-xs text-slate-500">
                Select any planetary node on the Aurek-7 Star Chart to inspect Force disturbances, scan for HCET cells, and deploy Imperial fleet assets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
