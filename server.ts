import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. ISB Tactical Advisor Engine
app.post("/api/tactical/evaluate", async (req, res) => {
  const { scenario, targetJedi, sector, forceThreatLevel, imperialForces } = req.body;

  const prompt = `You are the Imperial Security Bureau (ISB) Chief Tactical Strategist and Inquisitorius Coordinator serving directly under Emperor Palpatine and Lord Vader.
The galaxy is under Order 66. The surviving Jedi have banded together into "The HCET Syndicate" (a clandestine Jedi coalition devising evasive maneuvers, concealment techniques, and covert recruitment rings).

A tactical assessment has been requested by an Imperial Commander with the following telemetry:
- Target Jedi / Fugitive Cell: ${targetJedi || "Unknown HCET Syndicate Cell"}
- Target Sector / Planet: ${sector || "Outer Rim / Unknown Coordinates"}
- Force Disturbance / Threat Rating: ${forceThreatLevel || "High / Master Grade"}
- Available Imperial Garrison & Assets: ${JSON.stringify(imperialForces || ["Inquisitor Task Force", "Purge Trooper Detachment", "Imperial Star Destroyer", "Probe Droids"])}
- Tactical Intel / Situation: ${scenario || "HCET Syndicate cell detected mobilizing Force-sensitive initiates."}

Provide a comprehensive, authoritative Imperial Military & Inquisitorial Tactical Directive in valid JSON format:
{
  "directiveCode": "string (e.g., DIRECTIVE-66-ISB-XXXX)",
  "threatAnalysis": "string (succinct analysis of the Jedi's expected evasive or Force tactics)",
  "recommendedTactic": "string (title of tactical plan)",
  "containmentStrategy": [
    "step 1: orbital & planetary lockdown",
    "step 2: sensor dampening / kyber resonance scanning",
    "step 3: inquisitorial strike / Purge Trooper deployment",
    "step 4: interdiction / anti-recruitment purge"
  ],
  "countermeasures": [
    { "name": "e.g. Cortosis Blades / Electro-staffs", "purpose": "e.g. Lightsaber resistance" },
    { "name": "e.g. Sonic Dampeners & Flash Charges", "purpose": "e.g. Disrupt Force focus" },
    { "name": "e.g. Interdictor Gravity Well", "purpose": "e.g. Prevent hyperspace jump" }
  ],
  "recruitmentDisruptionProtocol": "string (specific action to halt HCET from training or extracting younglings)",
  "estimatedSuccessRate": number (between 70 and 99),
  "inquisitorAdvice": "string (grim, calculated quote or tactical reminder in true Imperial fashion)"
}`;

  try {
    const ai = getGenAIClient();
    if (!ai) {
      // High-quality fallback if no API key
      return res.json({
        directiveCode: `DIRECTIVE-66-ISB-${Math.floor(1000 + Math.random() * 9000)}`,
        threatAnalysis: `The HCET Syndicate operative ${targetJedi || 'subject'} is relying on localized Force suppression techniques and clandestine smugglers to establish an off-grid sanctuary in sector ${sector || 'Outer Rim'}.`,
        recommendedTactic: "Operation Dark Veil: Orbital Quarantine & Inquisitorius Insertion",
        containmentStrategy: [
          "Deploy Interdictor Cruisers to lock down primary and shadow hyperspace routes.",
          "Release Imperial Probe Droids to sweep sub-surface frequencies for Kyber resonance.",
          "Dispatch Purge Trooper Squadrons equipped with Cortosis vibroblades and sonic suppressors.",
          "Execute immediate detention of suspected Force-sensitive youth under Project Harvester."
        ],
        countermeasures: [
          { name: "Cortosis-weave armor & Electro-staffs", purpose: "Neutralize lightsaber deflection and parry offensive strikes." },
          { name: "High-Frequency Sonic Disruptors", purpose: "Shatter Jedi mental focus and prevent telekinetic manipulation." },
          { name: "Midi-chlorian Tracking Scanners", purpose: "Pinpoint biological Force surges within a 20km planetary radius." }
        ],
        recruitmentDisruptionProtocol: "Establish total orbital trade embargo and initiate biometric registration across all local academies.",
        estimatedSuccessRate: 88,
        inquisitorAdvice: "Let them believe they have found sanctuary. Fear will break their discipline before our blades do."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Gemini evaluate error:", err);
    return res.json({
      directiveCode: `DIRECTIVE-66-ISB-ERR-${Math.floor(1000 + Math.random() * 9000)}`,
      threatAnalysis: "HCET Syndicate encryption identified. Fallback tactical protocols engaged.",
      recommendedTactic: "Standard Sector Purge & Quarantine",
      containmentStrategy: [
        "Seal all orbital egress points.",
        "Scramble Inquisitorius hunter wings.",
        "Arrest all known confederates and sympathizers."
      ],
      countermeasures: [
        { name: "Sonic Pulse Cannon", purpose: "Disrupt Force concentration." },
        { name: "Cortosis Shields", purpose: "Absorb plasma discharge." }
      ],
      recruitmentDisruptionProtocol: "Immediate lockdown of all educational archives and Force-sensitive candidates.",
      estimatedSuccessRate: 85,
      inquisitorAdvice: "The Jedi cannot hide forever. The Dark Side will illuminate their shadows."
    });
  }
});

// 3. HCET Syndicate Signal Decryption & Deception Trap Generator
app.post("/api/tactical/decrypt", async (req, res) => {
  const { rawSignal, cipherType, frequency } = req.body;

  const prompt = `You are the Imperial Signal Intelligence Director (ISB Cryptography Division).
We have intercepted an encrypted sub-space broadcast from the HCET Syndicate (the underground Jedi coalition).

Intercepted Data:
- Frequency: ${frequency || "148.92 MHz Subspace Wave"}
- Cipher Encoding: ${cipherType || "Old Republic Jedi Beacon Protocol"}
- Raw Signal Snippet / Clues: ${rawSignal || "Distress ping detected near abandoned mining station with high Kyber reading"}

Analyze this signal, crack the hidden coordinates, detect if it is a Jedi trap or genuine recruit broadcast, and generate an Imperial Counter-Deception Trap.
Return in valid JSON:
{
  "decryptedContent": "string (the plain text message decoded from the Jedi)",
  "originSector": "string (e.g. Saleucami Outpost Beta, Bracca Junkyard Sector 4)",
  "recruitmentTarget": "string (who the Jedi were trying to contact or save)",
  "deceitLevel": "Low" | "Medium" | "High (Probable Jedi Ambush)",
  "hiddenCoordinates": "string (e.g. 04.92 // -88.14)",
  "imperialCounterTrap": "string (the fake Jedi transmission or beacon modification we will transmit to lure them into an Imperial ambush)",
  "recommendedStrikeUnit": "string (e.g. Second Sister & 501st Purge Battalion)"
}`;

  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        decryptedContent: "BROADCAST TO ALL SURVIVING SENTINELS: The HCET safehouse on Saleucami is active. If you sense the light, follow the twin suns beacon. We have three younglings ready for transport.",
        originSector: "Saleucami - Outer Rim Grid 7",
        recruitmentTarget: "Unregistered Force-sensitive youth hidden in agricultural colony",
        deceitLevel: "Medium",
        hiddenCoordinates: "07.44 // -19.82 // Sector 4A",
        imperialCounterTrap: "Broadcast modified Republic beacon confirm code acknowledging arrival of Jedi Master 'Kenobi', redirecting transport shuttle straight into an Imperial Interdictor hangar bay.",
        recommendedStrikeUnit: "Grand Inquisitor & Purge Airborne Division"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const text = response.text || "{}";
    return res.json(JSON.parse(text));
  } catch (err) {
    console.error("Signal decryption error:", err);
    return res.json({
      decryptedContent: "EMERGENCY HCET PROTOCOL: Rendezvous at coordinates. Avoid Imperial patrols.",
      originSector: "Mid Rim - Kashyyyk Shadow Lands",
      recruitmentTarget: "Exiled Jedi Padawan",
      deceitLevel: "Low",
      hiddenCoordinates: "12.09 // +44.31",
      imperialCounterTrap: "Deploy decoy HCET transponder transmitting corrupted Jedi code.",
      recommendedStrikeUnit: "Ninth Sister & Imperial Purge Armor Unit"
    });
  }
});

// 4. Anti-Recruitment Strategy Studio
app.post("/api/tactical/anti-recruitment", async (req, res) => {
  const { targetRegion, recruitmentChannel } = req.body;

  const prompt = `You are Grand Moff Tarkin and the Grand Inquisitor devising a strategic campaign to sever HCET Syndicate Jedi recruitment pipelines across the galaxy.
Target Region: ${targetRegion || "Outer Rim Mining Colonies & Core World Universities"}
Known Recruitment Channel: ${recruitmentChannel || "Covert Temple Holocron Networks & Underground Smuggler Safehouses"}

Create an actionable Imperial Anti-Recruitment Doctrine in valid JSON:
{
  "operationCodename": "string (e.g. OPERATION HARVESTER SHADOW)",
  "objective": "string (concise goal)",
  "phases": [
    { "phase": "Phase 1: Infiltration", "action": "string" },
    { "phase": "Phase 2: Kyber & Relic Interdiction", "action": "string" },
    { "phase": "Phase 3: Public Disinformation & Bounty Proclamation", "action": "string" },
    { "phase": "Phase 4: Inquisitorius Extraction / Elimination", "action": "string" }
  ],
  "propagandaBroadcastMessage": "string (Imperial HoloNet notice warning citizens against aiding HCET Syndicate)",
  "bountyRewardCredits": number (e.g. 250000),
  "projectHarvesterTargetingRules": [
    "string rule 1",
    "string rule 2",
    "string rule 3"
  ]
}`;

  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        operationCodename: "OPERATION HARVESTER VEIL",
        objective: "Dismantle clandestine HCET underground academies and intercept all Force-sensitive recruits before they can be unified.",
        phases: [
          { phase: "Phase 1: Infiltration", action: "Deploy ISB sleeper agents posing as sympathetic rogue cargo pilots offering Jedi extraction." },
          { phase: "Phase 2: Kyber & Relic Interdiction", action: "Impose total galactic embargo on all Kyber crystal shipments and seize Jedi artifacts from black markets." },
          { phase: "Phase 3: Public Disinformation", action: "Broadcast HoloNet reports labeling the HCET Syndicate as violent anarchists threatening galactic peace." },
          { phase: "Phase 4: Extraction & Re-education", action: "Deploy Inquisitorius transport wings to round up identified younglings for Imperial re-education." }
        ],
        propagandaBroadcastMessage: "CITIZENS OF THE EMPIRE: Harboring Jedi traitors or concealing Force anomalies carries immediate execution. Report all suspicious meditative practices to your local ISB garrison.",
        bountyRewardCredits: 500000,
        projectHarvesterTargetingRules: [
          "Mandatory biometric blood testing on all children aged 2-14 in regional sectors.",
          "Surveillance of high-altitude temples and subterranean crystal caves.",
          "Continuous scanning for telekinetic disturbances during mining or transport accidents."
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    return res.json(JSON.parse(text));
  } catch (err) {
    console.error("Anti-recruitment error:", err);
    return res.status(500).json({ error: "Failed to generate anti-recruitment doctrine" });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Imperial Command Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
