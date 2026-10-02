import React, { useState } from 'react';
import { 
  TransmissionSignal, 
  Sector 
} from '../types';
import { 
  Radio, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  ShieldAlert, 
  Crosshair, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Cpu,
  RefreshCw,
  Terminal,
  Send,
  Zap
} from 'lucide-react';
import { 
  playCipherDecrypt, 
  playLockOn, 
  playTacticalClick 
} from '../utils/soundEffects';

interface SignalInterceptionProps {
  signals: TransmissionSignal[];
  sectors: Sector[];
  onUpdateSignal: (updated: TransmissionSignal) => void;
  onDeployTrapToSector: (signal: TransmissionSignal) => void;
}

export const SignalInterception: React.FC<SignalInterceptionProps> = ({
  signals,
  sectors,
  onUpdateSignal,
  onDeployTrapToSector
}) => {
  const [selectedSignal, setSelectedSignal] = useState<TransmissionSignal>(signals[0] || null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [customFrequency, setCustomFrequency] = useState<string>('284.19 MHz');
  const [customCipher, setCustomCipher] = useState<string>('Jedi Temple Beacon Standard');
  const [customSnippet, setCustomSnippet] = useState<string>('Encrypted signal intercepted near Outer Rim trading outpost. Mention of three Force-sensitive children and safehouse coordinates.');
  const [isSynthesizingTrap, setIsSynthesizingTrap] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDecrypt = async (signal: TransmissionSignal) => {
    setIsDecrypting(true);
    playCipherDecrypt();

    try {
      const res = await fetch('/api/tactical/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawSignal: signal.rawSnippet,
          cipherType: signal.cipherType,
          frequency: signal.frequency
        })
      });

      const data = await res.json();
      const updated: TransmissionSignal = {
        ...signal,
        status: 'DECODED',
        decodedSnippet: data.decryptedContent || signal.decodedSnippet,
        recruitmentTarget: data.recruitmentTarget || signal.recruitmentTarget,
        deceitLevel: data.deceitLevel || signal.deceitLevel,
        coordinates: data.hiddenCoordinates || signal.coordinates,
        imperialCounterTrap: data.imperialCounterTrap || signal.imperialCounterTrap || 'Modified Republic frequency broadcast redirecting escape shuttle to Imperial Interdictor.'
      };

      onUpdateSignal(updated);
      setSelectedSignal(updated);
      playLockOn();
    } catch (err) {
      console.error('Decryption failed', err);
      // Fallback
      const updated: TransmissionSignal = {
        ...signal,
        status: 'DECODED',
        imperialCounterTrap: 'Broadcast corrupted Jedi rendezvous beacon directly into Imperial sensor net.'
      };
      onUpdateSignal(updated);
      setSelectedSignal(updated);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCreateCustomSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSnippet.trim()) return;

    setIsDecrypting(true);
    playCipherDecrypt();

    try {
      const res = await fetch('/api/tactical/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawSignal: customSnippet,
          cipherType: customCipher,
          frequency: customFrequency
        })
      });

      const data = await res.json();
      const newSignal: TransmissionSignal = {
        id: `sig-${Date.now()}`,
        timestamp: 'Just now',
        frequency: customFrequency,
        cipherType: customCipher,
        rawSnippet: customSnippet,
        decodedSnippet: data.decryptedContent || 'DECODED: HCET operative confirmed. Transmitting rendezvous coordinates.',
        originSectorId: sectors[0]?.id || 'sec-bracca',
        recruitmentTarget: data.recruitmentTarget || 'Unknown Force Initiates',
        deceitLevel: data.deceitLevel || 'Medium',
        status: 'DECODED',
        coordinates: data.hiddenCoordinates || '44.12 // -80.99',
        imperialCounterTrap: data.imperialCounterTrap || 'Establish false beacon redirecting to Imperial Cruiser.'
      };

      onUpdateSignal(newSignal);
      setSelectedSignal(newSignal);
      playLockOn();
      setCustomSnippet('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleSynthesizeTrap = async () => {
    if (!selectedSignal) return;
    setIsSynthesizingTrap(true);
    playCipherDecrypt();

    try {
      const res = await fetch('/api/tactical/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: `Synthesize a lethal Imperial counter-deception trap for intercepted transmission: "${selectedSignal.decodedSnippet}". Target is in sector ${selectedSignal.originSectorId}.`,
          sector: selectedSignal.originSectorId,
          targetJedi: selectedSignal.recruitmentTarget
        })
      });
      const data = await res.json();
      const trapPlan = data.recruitmentDisruptionProtocol || `Operation False Light: Broadcast modified Jedi beacon signature verifying safe transport, redirecting to Garrison 4.`;

      const updated: TransmissionSignal = {
        ...selectedSignal,
        imperialCounterTrap: trapPlan
      };
      onUpdateSignal(updated);
      setSelectedSignal(updated);
      playLockOn();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizingTrap(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playTacticalClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-orbitron text-[#F9FAFB] flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500" />
            SUB-SPACE SIGNAL INTELLIGENCE & CIPHER BREAKER
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Intercept HCET Syndicate sub-space beacons, analyze deceit probabilities, and deploy automated Imperial counter-traps.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-[#0A0B0E] px-3 py-1.5 rounded border border-[#1F2937] text-xs font-mono-tech text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>ARRAY: 12 INTERCEPT NODES ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Signals List + Inspector / Decoder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Signals Feed List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-orbitron font-bold text-slate-400 uppercase border-b border-[#1F2937] pb-2">
            <span>Intercepted Sub-space Feed</span>
            <span className="text-rose-400 font-mono-tech">[{signals.length} Signals Captured]</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {signals.map((sig) => {
              const isSelected = selectedSignal?.id === sig.id;
              const sector = sectors.find(s => s.id === sig.originSectorId);

              return (
                <div
                  key={sig.id}
                  id={`signal-card-${sig.id}`}
                  onClick={() => {
                    playTacticalClick();
                    setSelectedSignal(sig);
                  }}
                  className={`p-3.5 rounded-lg border transition cursor-pointer relative ${
                    isSelected 
                      ? 'bg-[#161B26] border-rose-500 shadow-md shadow-rose-950/60 ring-1 ring-rose-500' 
                      : 'bg-[#111827] hover:bg-[#1A2234] border-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Radio className="w-3 h-3" /> {sig.frequency}
                    </span>
                    <span className="text-slate-500">{sig.timestamp}</span>
                  </div>

                  <div className="font-bold text-sm text-[#F9FAFB] flex items-center justify-between">
                    <span>{sector?.name || 'Unknown Sector'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-tech uppercase font-semibold border ${
                      sig.status === 'TRAP_DEPLOYED'
                        ? 'bg-[#4C0519] text-rose-200 border-rose-600'
                        : sig.status === 'DECODED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}>
                      {sig.status === 'TRAP_DEPLOYED' ? 'Trap Active' : sig.status === 'DECODED' ? 'Decoded' : 'Encrypted'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono-tech mt-1 line-clamp-2">
                    {sig.status === 'DECODED' || sig.status === 'TRAP_DEPLOYED' ? sig.decodedSnippet : sig.rawSnippet}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono-tech text-slate-400 border-t border-[#1F2937] pt-1.5">
                    <span>Cipher: {sig.cipherType}</span>
                    <span className={`font-bold ${sig.deceitLevel.includes('High') ? 'text-rose-400' : 'text-slate-400'}`}>
                      Deceit: {sig.deceitLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Signal Injection Form */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-slate-200 uppercase">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Manual Signal Interception Scanner</span>
            </div>

            <form onSubmit={handleCreateCustomSignal} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Frequency (e.g. 199.4 MHz)"
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(e.target.value)}
                  className="bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Cipher Type"
                  value={customCipher}
                  onChange={(e) => setCustomCipher(e.target.value)}
                  className="bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-cyan-500"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Paste raw transmission / subspace encrypted packet..."
                value={customSnippet}
                onChange={(e) => setCustomSnippet(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#1F2937] rounded px-2.5 py-1.5 text-xs text-[#F9FAFB] font-mono-tech focus:outline-none focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={isDecrypting}
                className="w-full py-2 bg-[#0A0B0E] hover:bg-[#1A2234] border border-cyan-700 hover:border-cyan-500 text-cyan-300 rounded font-orbitron text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intercept & AI Decode Signal</span>
              </button>
            </form>
          </div>
        </div>

        {/* Selected Signal Cryptanalysis & Deception Trap Terminal */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1F2937] rounded-lg p-5 flex flex-col justify-between shadow-xl">
          {selectedSignal ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="border-b border-[#1F2937] pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono-tech text-slate-400">
                    <span>SIGNAL ID: {selectedSignal.id}</span>
                    <span>//</span>
                    <span className="text-cyan-400">{selectedSignal.frequency}</span>
                  </div>
                  <h3 className="text-xl font-bold font-orbitron text-[#F9FAFB] mt-0.5">
                    {sectors.find(s => s.id === selectedSignal.originSectorId)?.name || 'Unknown Planet'} Sector Transmission
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(selectedSignal.decodedSnippet || selectedSignal.rawSnippet, selectedSignal.id)}
                    className="p-1.5 rounded bg-[#0A0B0E] border border-[#1F2937] text-slate-400 hover:text-white transition"
                    title="Copy Text"
                  >
                    {copiedId === selectedSignal.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Status / Deceit Probability Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0A0B0E] p-3 rounded border border-[#1F2937]">
                  <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Encryption Status</div>
                  <div className="text-sm font-bold font-orbitron mt-0.5 flex items-center gap-1.5 text-slate-200">
                    {selectedSignal.status === 'DECODED' || selectedSignal.status === 'TRAP_DEPLOYED' ? (
                      <>
                        <Unlock className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">DECRYPTED</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400">ENCRYPTED</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-[#0A0B0E] p-3 rounded border border-[#1F2937]">
                  <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Jedi Deceit Probability</div>
                  <div className={`text-sm font-bold font-orbitron mt-0.5 flex items-center gap-1.5 ${
                    selectedSignal.deceitLevel.includes('High') ? 'text-rose-400' : selectedSignal.deceitLevel === 'Medium' ? 'text-amber-400' : 'text-cyan-400'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{selectedSignal.deceitLevel}</span>
                  </div>
                </div>

                <div className="bg-[#0A0B0E] p-3 rounded border border-[#1F2937]">
                  <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Target Coordinates</div>
                  <div className="text-sm font-bold font-mono-tech text-slate-200 mt-0.5 truncate">
                    {selectedSignal.coordinates || 'TRIPANGULATING...'}
                  </div>
                </div>
              </div>

              {/* Raw vs Decrypted Box */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-mono-tech text-slate-400 mb-1 flex items-center justify-between">
                    <span className="text-slate-400 uppercase">RAW SUB-SPACE TELEMETRY PACKET:</span>
                    <span className="text-slate-500">{selectedSignal.cipherType}</span>
                  </div>
                  <div className="bg-[#0A0B0E] border border-[#1F2937] p-3 rounded font-mono-tech text-xs text-rose-300/80 leading-relaxed break-all">
                    {selectedSignal.rawSnippet}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono-tech text-slate-400 mb-1 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> ISB DECRYPTED INTELLIGENCE:
                    </span>
                    <span className="text-slate-500 font-mono-tech">Target: {selectedSignal.recruitmentTarget}</span>
                  </div>
                  <div className="bg-[#0A0B0E] border border-emerald-900/60 p-3.5 rounded font-mono-tech text-xs text-slate-200 leading-relaxed">
                    {selectedSignal.status === 'ENCRYPTED' ? (
                      <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                        <Lock className="w-6 h-6 text-amber-500" />
                        <span className="text-amber-400 font-orbitron">SIGNAL ENCRYPTED BY HCET CYPHER</span>
                        <p className="text-[11px] text-slate-500 max-w-sm">
                          Run the ISB Cryptographic Cracker to reveal safehouse coordinates and initiate identities.
                        </p>
                        <button
                          onClick={() => handleDecrypt(selectedSignal)}
                          disabled={isDecrypting}
                          className="mt-2 px-4 py-1.5 bg-[#881337] hover:bg-rose-600 text-white rounded font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-rose-500 transition shadow-sm"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{isDecrypting ? 'Cracking Cipher...' : 'Execute ISB Cipher Decryption'}</span>
                        </button>
                      </div>
                    ) : (
                      <p>{selectedSignal.decodedSnippet}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Imperial Counter-Deception Trap Generator */}
              <div className="bg-[#0A0B0E] border border-rose-900/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-orbitron font-bold text-rose-300 uppercase">
                      Imperial Counter-Deception Trap Engine
                    </span>
                  </div>
                  <button
                    onClick={handleSynthesizeTrap}
                    disabled={isSynthesizingTrap || selectedSignal.status === 'ENCRYPTED'}
                    className="text-[11px] font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSynthesizingTrap ? 'animate-spin' : ''}`} />
                    <span>Regenerate AI Trap</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-mono-tech bg-[#111827] p-3 rounded border border-[#1F2937] leading-relaxed">
                  {selectedSignal.imperialCounterTrap || (
                    <span className="text-slate-500 italic">
                      Decipher the transmission to automatically synthesize a deceptive counter-beacon.
                    </span>
                  )}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-1">
                  <button
                    onClick={() => {
                      playLockOn();
                      onDeployTrapToSector(selectedSignal);
                    }}
                    disabled={selectedSignal.status === 'ENCRYPTED' || selectedSignal.status === 'TRAP_DEPLOYED'}
                    className={`px-4 py-2 rounded font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition ${
                      selectedSignal.status === 'TRAP_DEPLOYED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 cursor-default'
                        : selectedSignal.status === 'ENCRYPTED'
                        ? 'bg-[#161B26] text-slate-500 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>
                      {selectedSignal.status === 'TRAP_DEPLOYED' ? 'Trap Deployed to Sector' : 'Deploy Counter-Trap to Sector'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Radio className="w-12 h-12 text-slate-700" />
              <div className="font-orbitron text-sm font-bold mt-2">NO SIGNAL SELECTED</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
