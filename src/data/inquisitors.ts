import { InquisitorUnit } from '../types';

export const INITIAL_INQUISITORS: InquisitorUnit[] = [
  {
    id: 'inq-grand',
    name: 'The Grand Inquisitor',
    title: 'Master of the Inquisitorius',
    lightsaberType: 'Double-Bladed Spinning Crimson Lightsaber',
    specialty: 'Jedi Temple Guard Knowledge & Psychological Warfare',
    assignedSectorId: 'sec-jedha',
    status: 'AVAILABLE',
    combatRating: 97,
    quote: 'There are some things far more frightening than death.',
    purgesCompleted: 24
  },
  {
    id: 'inq-second',
    name: 'Second Sister (Trilla Suduri)',
    title: 'Inquisitorius Hunter Lead',
    lightsaberType: 'Modified Dual-Phase Spinning Red Saber',
    specialty: 'Acrobatic Form VII, Telepathic Probing & Speed Strike',
    assignedSectorId: 'sec-bracca',
    status: 'DEPLOYED',
    combatRating: 93,
    quote: 'You cannot run from what you are. The past always catches you.',
    purgesCompleted: 19
  },
  {
    id: 'inq-ninth',
    name: 'Ninth Sister (Masana Tide)',
    title: 'Inquisitorius Heavy Enforcer',
    lightsaberType: 'Reinforced Heavy Crimson Double-Blade',
    specialty: 'Brute Force, Empathic Reading & Armor Crushing',
    assignedSectorId: 'sec-kashyyyk',
    status: 'AVAILABLE',
    combatRating: 89,
    quote: 'I can read your fear, little Jedi. It tastes sweet.',
    purgesCompleted: 14
  },
  {
    id: 'inq-fifth',
    name: 'Fifth Brother',
    title: 'Inquisitorius Vanguard',
    lightsaberType: 'Heavy Broad Crimson Ring Saber',
    specialty: 'Telekinetic Earth Shocks & Frontline Armor Assault',
    assignedSectorId: null,
    status: 'AVAILABLE',
    combatRating: 86,
    quote: 'Resistance only guarantees a more agonizing end.',
    purgesCompleted: 11
  },
  {
    id: 'inq-seventh',
    name: 'Seventh Sister',
    title: 'Inquisitorius Reconnaissance Specialist',
    lightsaberType: 'Fast-Spinning Dual Crimson Saber + ID9 Seeker Droids',
    specialty: 'Micro-Droid Tracking, Agile Traps & Interrogation',
    assignedSectorId: 'sec-daiyu',
    status: 'AVAILABLE',
    combatRating: 88,
    quote: 'My droids have found your scent. There is nowhere in this galaxy to hide.',
    purgesCompleted: 16
  },
  {
    id: 'inq-purge-cmdr',
    name: 'Commander Fox (Purge Airborne Div.)',
    title: 'Imperial Purge Trooper Battalion Commander',
    lightsaberType: 'Electrostaff & DC-15LE Heavy Blaster with Ion Charge',
    specialty: 'Anti-Lightsaber Cortosis Tactics & Sonic Disruption',
    assignedSectorId: 'sec-coruscant',
    status: 'AVAILABLE',
    combatRating: 82,
    quote: 'No force trick will stop 500 rounds of sustained rapid plasma fire.',
    purgesCompleted: 31
  }
];
