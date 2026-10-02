import { 
  TransmissionSignal, 
  ImperialDirective, 
  AntiRecruitmentOperation, 
  TacticalStrikeLog 
} from '../types';

export const INITIAL_SIGNALS: TransmissionSignal[] = [
  {
    id: 'sig-101',
    timestamp: '08:42 Imperial Standard',
    frequency: '148.92 MHz Subspace',
    cipherType: 'Old Republic Jedi Beacon 9-Delta',
    rawSnippet: '0x8F94... [ENCRYPTED] ... KYBER_PING ... RENDEZVOUS_OUTPOST_4 ... [CORRUPTED DATA]',
    decodedSnippet: 'ATTENTION ALL REMNANTS: HCET safehouse on Bracca is compromised. Re-routing all Force-sensitive initiates to Jedha Holy Catacombs before the Imperial Star Destroyer arrives. May the Force be with us.',
    originSectorId: 'sec-bracca',
    recruitmentTarget: 'Youngling Initiate Transport Team',
    deceitLevel: 'Low',
    status: 'DECODED',
    coordinates: '32.14 // +11.89 // Sector 4B',
    imperialCounterTrap: 'Transmit false Jedi beacon confirmation with coordinate redirect into awaiting Imperial Interdictor cruiser gravity well.'
  },
  {
    id: 'sig-102',
    timestamp: '09:15 Imperial Standard',
    frequency: '211.04 MHz Narrowband',
    cipherType: 'Underground Smuggler Dialect C-3',
    rawSnippet: '0x99A1... [ENCRYPTED] ... SPICE_CARGO_3_UNITS ... DAIYU_HANGAR ... [SUSPICIOUS ENCRYPTION]',
    decodedSnippet: 'Package secured. Three children with high blood cell anomaly ready for off-world transit to Kashyyyk. Smuggler payment guaranteed by HCET representative Quinlan Vos.',
    originSectorId: 'sec-daiyu',
    recruitmentTarget: '3 Force-sensitive orphans aged 4-7',
    deceitLevel: 'High (Probable Jedi Ambush)',
    status: 'ENCRYPTED',
    coordinates: '48.91 // -33.10 // Daiyu Neon Row',
  },
  {
    id: 'sig-103',
    timestamp: '11:02 Imperial Standard',
    frequency: '330.18 MHz Deep Sub-space',
    cipherType: 'Ancient Jedi Temple Resonator',
    rawSnippet: '0x44B2... [ENCRYPTED] ... ILUM_ICE_CHAMBER ... GATHERING_PULSE ... [RESTRICTED]',
    decodedSnippet: 'Master Kirak Infil\'a to all who listen: The Kyber caves still sing. Bring the fledglings here to forge their sabers. We will build an army to reclaim the Temple.',
    originSectorId: 'sec-ilum',
    recruitmentTarget: 'Rogue Force-sensitives & fugitive Padawans',
    deceitLevel: 'Low',
    status: 'ENCRYPTED',
    coordinates: '18.02 // +90.12 // Ilum Cavern Depth 3',
  },
  {
    id: 'sig-104',
    timestamp: '11:38 Imperial Standard',
    frequency: '092.45 MHz Low Wave',
    cipherType: 'Agril-Corps Emergency Cipher',
    rawSnippet: '0x33F8... [ENCRYPTED] ... SEED_HARVEST_FAIL ... CALDERA_NURSERY ...',
    decodedSnippet: 'Medical supplies exhausted on Saleucami. Inquisitors spotted in outer orbit. Seeking immediate HCET extraction for infant Force-users.',
    originSectorId: 'sec-saleucami',
    recruitmentTarget: 'Infant Force-users in agricultural colony',
    deceitLevel: 'Medium',
    status: 'DECODED',
    coordinates: '82.01 // -12.44 // Caldera Sector 9',
    imperialCounterTrap: 'Dispatched 501st Purge Vanguard with medical transport decoy.'
  }
];

export const INITIAL_DIRECTIVES: ImperialDirective[] = [
  {
    id: 'dir-001',
    directiveCode: 'DIR-66-ISB-9921',
    title: 'Operation Iron Shroud: Jedha Kyber Embargo',
    author: 'Grand Moff Tarkin',
    clearance: 'PRIORITY ONE',
    targetSectorId: 'sec-jedha',
    summary: 'Total orbital blockade of the Jedha moon to prevent HCET agents from harvesting natural Kyber crystals or establishing covert monastic training grounds.',
    containmentSteps: [
      'Deploy 3 Imperial-class Star Destroyers to establish overlapping sensor grids.',
      'Impose immediate death penalty for possession of uncut Kyber or lightsaber components.',
      'Deploy Grand Inquisitor to purge suspected Pilgrim temples in Holy City.'
    ],
    countermeasures: [
      { name: 'Seismic Resonator Scanners', purpose: 'Detect subterranean caverns housing Force gatherings' },
      { name: 'Cortosis Vanguard Shields', purpose: 'Repel close-quarters lightsaber strikes from Temple Guardians' }
    ],
    rewardCredits: 500000,
    status: 'ACTIVE',
    createdAt: 'Standard Date 19 BBY'
  },
  {
    id: 'dir-002',
    directiveCode: 'DIR-66-ISB-4402',
    title: 'Project Harvester: Corellian & Daiyu Youngling Sweep',
    author: 'The Grand Inquisitor',
    clearance: 'TOP SECRET',
    targetSectorId: 'sec-daiyu',
    summary: 'Systematic biometric blood analysis across all orphanages, academies, and medical centers to locate and abduct Force-sensitive children before HCET recruiters reach them.',
    containmentSteps: [
      'Mandatory blood testing under the guise of an Imperial vaccine initiative.',
      'Instant arrest of parents or guardians refusing Imperial biometric registration.',
      'Transfer all high-potency subjects directly to the Fortress Inquisitorius on Nur for re-education.'
    ],
    countermeasures: [
      { name: 'Midi-chlorian Bio-Scanners', purpose: 'Instant biological verification of Force potency' },
      { name: 'Stun Gas Aerosol Cannons', purpose: 'Non-lethal extraction of high-value juvenile targets' }
    ],
    rewardCredits: 350000,
    status: 'ACTIVE',
    createdAt: 'Standard Date 19 BBY'
  }
];

export const INITIAL_ANTI_RECRUITMENT_OPS: AntiRecruitmentOperation[] = [
  {
    id: 'op-harvester-01',
    codename: 'OPERATION HARVESTER VEIL',
    targetSectorId: 'sec-coruscant',
    focusArea: 'PROJECT_HARVESTER',
    objective: 'Intercept underground nurseries and kindergarten facilities harboring high-potency Force infants on Coruscant Level 1313.',
    phases: [
      { phase: 'Phase 1', action: 'Infiltrate medical centers via ISB sleeper physicians.' },
      { phase: 'Phase 2', action: 'Confiscate delivery records and identify all newborns with abnormal reflex metrics.' },
      { phase: 'Phase 3', action: 'Deploy Inquisitorius Shadow Shuttles to extract targets into Imperial custody.' }
    ],
    propagandaBroadcast: 'CITIZENS OF IMPERIAL CENTER: Report all children exhibiting unnatural telekinetic agitation. Harboring unregistered Force wielders is high treason against the Emperor.',
    bountyReward: 300000,
    younglingsExtractedCount: 14,
    status: 'IN_PROGRESS'
  },
  {
    id: 'op-kyber-02',
    codename: 'OPERATION CRYSTAL SHADOW',
    targetSectorId: 'sec-ilum',
    focusArea: 'KYBER_EMBARGO',
    objective: 'Destroy or seal ancient crystal caves on Ilum to ensure HCET cannot arm new Jedi recruits with lightsabers.',
    phases: [
      { phase: 'Phase 1', action: 'Orbital bombardment of sacred canyon entrances.' },
      { phase: 'Phase 2', action: 'Install heavy seismic seismic drillers and garrison 2 Purge Trooper battalions.' },
      { phase: 'Phase 3', action: 'Electrify all cavern passageways and monitor for heat signatures.' }
    ],
    propagandaBroadcast: 'MINING NOTICE: Ilum is under permanent Imperial mining quarantine. Unauthorized approach will result in instant destruction.',
    bountyReward: 450000,
    younglingsExtractedCount: 0,
    status: 'IN_PROGRESS'
  }
];

export const INITIAL_STRIKE_LOGS: TacticalStrikeLog[] = [
  {
    id: 'log-01',
    timestamp: '2 hours ago',
    targetJediName: 'Jedi Knight Valin Hess',
    sectorName: 'Bracca',
    inquisitorNames: ['Second Sister', 'Purge Squadron Beta'],
    outcome: 'FUGITIVE_ELIMINATED',
    details: 'Target attempted to flee through Scrapper Rig 9. Second Sister engaged in duel; target neutralized after lightsaber parry collapse.',
    successRateCalculated: 94
  },
  {
    id: 'log-02',
    timestamp: '6 hours ago',
    targetJediName: 'Eeth Koth',
    sectorName: 'Saleucami',
    inquisitorNames: ['The Grand Inquisitor', 'Fifth Brother'],
    outcome: 'FUGITIVE_CAPTURED',
    details: 'Sanctuary surrounded. Subject surrendered to protect infant. Infant transferred into Project Harvester pipeline.',
    successRateCalculated: 98
  }
];
