export type SectorRegion = 
  | 'Deep Core'
  | 'Core Worlds'
  | 'Inner Rim'
  | 'Mid Rim'
  | 'Outer Rim'
  | 'Unknown Regions';

export type AlertLevel = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export type HCETActivity = 'NONE' | 'SUSPECTED' | 'CONFIRMED' | 'ACTIVE_RECRUITMENT' | 'PURGED';

export interface Sector {
  id: string;
  name: string;
  region: SectorRegion;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  kyberDisturbance: number; // 0 - 100
  alertLevel: AlertLevel;
  hcetCellActivity: HCETActivity;
  garrisonStrength: number; // 0 - 100%
  blockadeActive: boolean;
  probeDroidsCount: number;
  description: string;
  notableLocations: string[];
  lastScanTimestamp: string;
}

export type JediRank = 'Master' | 'Knight' | 'Padawan' | 'Temple Guard' | 'Jedi Shadow';

export type FugitiveStatus = 'AT_LARGE' | 'TRACKED' | 'CONTAINED' | 'ELIMINATED' | 'TURNED_TO_INQUISITOR';

export type ThreatLevel = 'Omega (Extreme Priority)' | 'Alpha' | 'Beta' | 'Gamma';

export interface JediFugitive {
  id: string;
  name: string;
  formerRank: JediRank;
  lightsaberColor: 'Blue' | 'Green' | 'Yellow' | 'Purple' | 'Cyan' | 'White' | 'Double Yellow' | 'Orange';
  lightsaberForm: string;
  threatLevel: ThreatLevel;
  forceSpecialties: string[];
  knownAliases: string[];
  currentSectorId: string;
  status: FugitiveStatus;
  syndicateRole: string;
  bountyCredits: number;
  bio: string;
  confirmedSightings: number;
  dangerNotes: string;
}

export interface InquisitorUnit {
  id: string;
  name: string;
  title: string;
  lightsaberType: string;
  specialty: string;
  assignedSectorId: string | null;
  status: 'AVAILABLE' | 'DEPLOYED' | 'IN_COMBAT';
  combatRating: number; // 1-100
  quote: string;
  purgesCompleted: number;
}

export interface TransmissionSignal {
  id: string;
  timestamp: string;
  frequency: string;
  cipherType: string;
  rawSnippet: string;
  decodedSnippet: string;
  originSectorId: string;
  recruitmentTarget: string;
  deceitLevel: 'Low' | 'Medium' | 'High (Probable Jedi Ambush)';
  status: 'ENCRYPTED' | 'DECODED' | 'TRAP_DEPLOYED';
  coordinates: string;
  imperialCounterTrap?: string;
}

export interface ImperialDirective {
  id: string;
  directiveCode: string;
  title: string;
  author: string;
  clearance: 'TOP SECRET' | 'RESTRICTED' | 'PRIORITY ONE';
  targetSectorId: string;
  summary: string;
  containmentSteps: string[];
  countermeasures: { name: string; purpose: string }[];
  rewardCredits: number;
  status: 'ACTIVE' | 'EXECUTED';
  createdAt: string;
}

export interface AntiRecruitmentOperation {
  id: string;
  codename: string;
  targetSectorId: string;
  focusArea: 'PROJECT_HARVESTER' | 'ACADEMY_INFILTRATION' | 'KYBER_EMBARGO' | 'DISINFO_BROADCAST';
  objective: string;
  phases: { phase: string; action: string }[];
  propagandaBroadcast: string;
  bountyReward: number;
  younglingsExtractedCount: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'STANDBY';
}

export interface TacticalStrikeLog {
  id: string;
  timestamp: string;
  targetJediName: string;
  sectorName: string;
  inquisitorNames: string[];
  outcome: 'FUGITIVE_ELIMINATED' | 'FUGITIVE_CAPTURED' | 'CELL_DISPERSED' | 'AMBUSH_DEFLECTED' | 'ESCAPED_TO_HYPERSPACE';
  details: string;
  successRateCalculated: number;
}
