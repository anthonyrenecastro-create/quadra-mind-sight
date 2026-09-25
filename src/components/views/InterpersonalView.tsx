import React, { useState } from 'react';
import { Users, Send, Sparkles, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';
import { InterpersonalResult } from '../../types';
import { authenticatedFetch } from '../../services/api';

export const InterpersonalView: React.FC = () => {
  const [eventText, setEventText] = useState('');
  const [counterpartRole, setCounterpartRole] = useState('');
  const [myInterpretation, setMyInterpretation] = useState('');
  const [mySomaticResponse, setMySomaticResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InterpersonalResult | null>(null);

  const handleAnalyze = async () => {
    if (!eventText.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await authenticatedFetch('/api/gemini/interpersonal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventText,
          counterpart: counterpartRole || 'Counterpart / Colleague',
          myInterpretation,
          mySomaticResponse,
        }),
      });
      const data = await response.json();
      setResult(data.analysis);
    } catch {
      // Local robust fallback
      setResult({
        observableEvent: 'Verbatim physical facts: words spoken, objective timestamps, observable facial postures without emotional descriptors.',
        myQuadrantDeconstruction: {
          past: 'Past precedents: Similar relational ruptures where you felt unheard or dismissed.',
          meaning: myInterpretation || 'The internal narrative: Interpreting brevity or distance as malice or loss of respect.',
          present: mySomaticResponse || 'Embodiment: Tightening in throat, shallow breathing, heightened sympathetic arousal.',
          future: 'Defensive projection: Anticipating relational deterioration or isolation.',
        },
        counterpartHypothesizedQuadrants: {
          past: 'Counterpart Past: Prior exhaustion, chronic professional stress, or personal vulnerabilities.',
          meaning: 'Counterpart Meaning: Feeling overwhelmed, defensive, or misunderstood.',
          present: 'Counterpart Present: Somatic fatigue, cognitive overload, physical distraction.',
          future: 'Counterpart Future: Fear of falling behind, losing autonomy, or conflict escalation.',
        },
        dialecticQuestions: [
          'What alternative, benign explanation fits the observable facts equally well?',
          'What would shift if you responded purely to the physical event rather than the assigned narrative?',
          'How does the counterpart\'s reaction make coherent sense from inside their private world model?',
        ],
        synthesisRecommendation: 'Pause the reflex to defend your model. Anchor in physical breath, acknowledge the counterpart\'s unexpressed stress, and invite collaborative clarification.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="interpersonal-view" className="flex-1 p-3 sm:p-8 overflow-y-auto max-w-5xl mx-auto space-y-5 sm:space-y-8 touch-scroll">
      {/* Header */}
      <div className="border-b border-white/10 pb-3 sm:pb-4">
        <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#8B5CF6] block mb-1">
          Relational Metacognition
        </span>
        <h2 className="text-lg sm:text-2xl font-light text-white tracking-wide flex items-center gap-2 sm:gap-2.5">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
          INTERPERSONAL QUADRA
        </h2>
        <p className="text-xs text-white/60 mt-1 max-w-2xl font-light leading-relaxed">
          Decouple objective interpersonal events from cognitive threat narratives, and empathically model the four quadrants of the other person.
        </p>
      </div>

      {/* Input Form */}
      <div className="border border-white/10 bg-[#050508]/80 p-4 sm:p-6 rounded-xs space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-white/80 block mb-1 font-bold">
              Counterpart (e.g. Partner, Colleague, Manager):
            </label>
            <input
              type="text"
              value={counterpartRole}
              onChange={(e) => setCounterpartRole(e.target.value)}
              placeholder="e.g. Project Lead / Co-founder"
              className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-[#8B5CF6] focus:outline-hidden font-sans rounded-xs"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/80 block mb-1 font-bold">
              My Assigned Meaning / Story:
            </label>
            <input
              type="text"
              value={myInterpretation}
              onChange={(e) => setMyInterpretation(e.target.value)}
              placeholder="e.g. They do not respect my judgment or want to sideline me..."
              className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-[#8B5CF6] focus:outline-hidden font-sans rounded-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-white/80 block mb-1 font-bold">
            The Raw Observable Event (Strip away assumptions):
          </label>
          <textarea
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            placeholder="Describe what a video camera would record: exact words, silence duration, tone, email text..."
            className="w-full bg-black border border-white/15 p-3 text-xs text-white placeholder:text-white/20 focus:border-[#8B5CF6] focus:outline-hidden font-sans rounded-xs h-20 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-white/60 block mb-1">
            My Immediate Somatic Response (Optional):
          </label>
          <input
            type="text"
            value={mySomaticResponse}
            onChange={(e) => setMySomaticResponse(e.target.value)}
            placeholder="e.g. Heart fluttering, constricted throat, urge to withdraw or interrupt..."
            className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-[#8B5CF6] focus:outline-hidden font-sans rounded-xs"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !eventText.trim()}
            className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#9F75FF] text-white text-xs font-bold font-mono uppercase tracking-[0.2em] transition-all disabled:opacity-30 rounded-xs flex items-center gap-2 shadow-lg"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isLoading ? 'Mapping Dialectic...' : 'Deconstruct Interaction'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Observable Event Camera Calibration */}
          <div className="p-4 border border-white/10 bg-white/[0.02] rounded-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block font-bold mb-1">
              Camera Check: Observable Fact vs Inferred Narrative
            </span>
            <p className="text-xs text-white/90 font-light font-sans leading-relaxed">
              {result.observableEvent}
            </p>
          </div>

          {/* Side by side comparison: My 4 Quadrants vs Counterpart's Hypothesized 4 Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Quadrants */}
            <div className="border border-white/10 bg-black/40 p-5 rounded-xs space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold block border-b border-white/5 pb-2">
                My 4-Quadrant Experience
              </span>
              <div className="space-y-2 text-xs font-light font-sans">
                <p><strong className="text-white/60 font-mono text-[10px] uppercase block">Past:</strong> {result.myQuadrantDeconstruction.past}</p>
                <p><strong className="text-[#EF4444] font-mono text-[10px] uppercase block">Meaning Assigned:</strong> {result.myQuadrantDeconstruction.meaning}</p>
                <p><strong className="text-[#10B981] font-mono text-[10px] uppercase block">Somatic Embodiment:</strong> {result.myQuadrantDeconstruction.present}</p>
                <p><strong className="text-[#8B5CF6] font-mono text-[10px] uppercase block">Projected Future:</strong> {result.myQuadrantDeconstruction.future}</p>
              </div>
            </div>

            {/* Counterpart's Quadrants */}
            <div className="border border-white/10 bg-black/40 p-5 rounded-xs space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] font-bold block border-b border-white/5 pb-2">
                Counterpart's Hypothesized Reality
              </span>
              <div className="space-y-2 text-xs font-light font-sans">
                <p><strong className="text-white/60 font-mono text-[10px] uppercase block">Their Context / Past:</strong> {result.counterpartHypothesizedQuadrants.past}</p>
                <p><strong className="text-[#EF4444] font-mono text-[10px] uppercase block">Their Perceived Meaning:</strong> {result.counterpartHypothesizedQuadrants.meaning}</p>
                <p><strong className="text-[#10B981] font-mono text-[10px] uppercase block">Their Physical State:</strong> {result.counterpartHypothesizedQuadrants.present}</p>
                <p><strong className="text-[#8B5CF6] font-mono text-[10px] uppercase block">Their Fear / Projection:</strong> {result.counterpartHypothesizedQuadrants.future}</p>
              </div>
            </div>
          </div>

          {/* Dialectic Questions */}
          <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xs space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
              Dialectic Questions for Relational Freedom
            </span>
            <ul className="space-y-2 text-xs text-white/80 font-light font-sans">
              {result.dialecticQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-mono font-bold">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Synthesis */}
          <div className="p-6 border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 rounded-xs space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                Relational Synthesis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light font-sans">
              {result.synthesisRecommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
