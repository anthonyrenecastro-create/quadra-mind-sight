import React, { useState, useEffect, useRef } from 'react';
import { QuadrantKey } from '../../types';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, Compass } from 'lucide-react';
import { authenticatedFetch } from '../../services/api';

interface FacilitatorViewProps {
  onOpenGroundModal: () => void;
}

interface Message {
  id: string;
  sender: 'facilitator' | 'user';
  text: string;
  timestamp: string;
  quadrant?: QuadrantKey;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'facilitator',
    text: 'Welcome to the M.I.N.D.S. Facilitator. I am here to help you examine how your conscious experience is being assembled across the four quadrants: Memory, Meaning, Embodiment, and Projection. What observation or internal tension would you like to explore today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quadrant: 'meta',
  },
];

export const FacilitatorView: React.FC<FacilitatorViewProps> = ({ onOpenGroundModal }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuadrantKey>('meta');
  const [isLoading, setIsLoading] = useState(false);
  const [showMobilePrompts, setShowMobilePrompts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    if (!customPrompt) setInputText('');

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quadrant: activeFilter,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await authenticatedFetch('/api/gemini/facilitator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          currentQuadrant: activeFilter,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        data.fallback ||
        'Notice what arises in awareness. Can you separate what was observed from the narrative interpretation your mind constructed?';

      setMessages((prev) => [
        ...prev,
        {
          id: `f_${Date.now()}`,
          sender: 'facilitator',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quadrant: activeFilter,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `f_${Date.now()}`,
          sender: 'facilitator',
          text: 'Notice this observation in your awareness. Which of the four quadrants does it primarily belong to: Past memory, Affective meaning, Present embodiment, or Future projection?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quadrant: activeFilter,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const presetQuestions = [
    { label: 'Isolate Observation vs Story', text: 'I noticed a strong reaction today. How do I cleanly separate what actually occurred from my cognitive narrative?' },
    { label: 'Deconstruct a Worry', text: 'My mind keeps looping on an anxious projection about an upcoming event. Can we analyze this future simulation?' },
    { label: 'Explore a Recurring Memory', text: 'An unexpected autobiographical memory from years ago keeps surfacing. How can I examine its sensory fragments?' },
    { label: 'Somatic Check-In', text: 'Help me ground and map my physical sensations right now.' },
  ];

  return (
    <div id="facilitator-view" className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#050508]">
        {/* Top Filter Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 bg-[#070712]">
          <div>
            <span className="text-[8.5px] sm:text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
              Socratic Dialectic Dialogue
            </span>
            <h2 className="text-sm sm:text-lg font-light text-white tracking-wide flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              M.I.N.D.S. Facilitator
            </h2>
          </div>

          {/* Quadrant Mode Chips */}
          <div className="flex items-center gap-1 bg-black p-0.5 sm:p-1 border border-white/10 rounded-xs font-mono text-[9px] sm:text-[10px] overflow-x-auto no-scrollbar max-w-full">
            {(['meta', 'memory', 'meaning', 'present', 'future'] as QuadrantKey[]).map((q) => (
              <button
                key={q}
                onClick={() => setActiveFilter(q)}
                className={`px-2 py-1 uppercase rounded-xs transition-colors shrink-0 ${
                  activeFilter === q
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobilePrompts(!showMobilePrompts)}
              className="xl:hidden px-2 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider rounded-xs"
            >
              {showMobilePrompts ? 'Chat' : 'Starters'}
            </button>

            <button
              onClick={clearChat}
              className="text-white/40 hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 p-1"
              title="Clear Dialogue"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${
                m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
              }`}
            >
              {m.sender === 'facilitator' && (
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] bg-[#0F111A] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
              )}

              <div
                className={`p-4 rounded-xs border text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white font-sans'
                    : 'bg-white/[0.03] border-white/10 text-white/90 font-light font-sans'
                }`}
              >
                <div className="flex items-center justify-between text-[8.5px] font-mono text-white/40 mb-2 uppercase tracking-wider">
                  <span className="font-bold text-[#D4AF37]">
                    {m.sender === 'facilitator' ? 'M.I.N.D.S. Facilitator' : 'You (Inquirer)'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full border border-white/20 bg-[#0A0A15] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white/70" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37] bg-[#0F111A] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#D4AF37] animate-spin" />
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 text-white/50 text-xs font-mono rounded-xs">
                Facilitator is formulating dialectic inquiry...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#070712]/90">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <textarea
                id="facilitator-chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Describe your observation, feeling, or tension (Focus: ${activeFilter.toUpperCase()})...`}
                className="flex-1 bg-black/80 border border-white/15 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-hidden resize-none h-14 rounded-xs font-sans"
              />
              <button
                id="facilitator-chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="px-5 bg-[#D4AF37] hover:bg-[#E5C158] text-black disabled:opacity-30 transition-colors flex items-center justify-center rounded-xs font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[8.5px] font-mono text-white/30 tracking-wider block mt-2">
              Shift + Enter for new line • Facilitator never diagnoses or prescribes conclusions.
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Dialectic Prompts & Guidelines */}
      <aside
        className={`${
          showMobilePrompts ? 'flex' : 'hidden xl:flex'
        } w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-white/10 bg-[#050508]/95 p-4 sm:p-6 flex-col justify-between overflow-y-auto shrink-0 z-20`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                Dialectic Inquiries
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Quick Dialectic Starters
              </h3>
            </div>
            {showMobilePrompts && (
              <button
                onClick={() => setShowMobilePrompts(false)}
                className="xl:hidden text-xs text-[#D4AF37] font-mono uppercase underline"
              >
                Back to Chat
              </button>
            )}
          </div>

          <div className="space-y-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSendMessage(q.text);
                  setShowMobilePrompts(false);
                }}
                className="w-full p-3 text-left border border-white/10 hover:border-[#D4AF37]/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-xs text-xs group active:scale-98"
              >
                <span className="text-[9.5px] font-mono text-[#D4AF37] block font-semibold mb-1 group-hover:underline">
                  {q.label}
                </span>
                <span className="text-white/70 line-clamp-2 text-[11px] leading-relaxed">
                  {q.text}
                </span>
              </button>
            ))}
          </div>

          {/* Socratic Principles Card */}
          <div className="border border-white/5 bg-black/40 p-3.5 rounded-xs space-y-2">
            <span className="text-[9px] font-mono uppercase text-white/40 block font-bold">
              The 6 Dialectic Principles
            </span>
            <ul className="text-[10px] text-white/60 space-y-1.5 font-light leading-relaxed">
              <li>1. What did you observe? (Raw fact)</li>
              <li>2. Which quadrant does it belong to?</li>
              <li>3. Is that observation or interpretation?</li>
              <li>4. What does that mean to you?</li>
              <li>5. What does the opposite perspective hold?</li>
              <li>6. What remains when you observe both?</li>
            </ul>
          </div>
        </div>

        {/* Safety Note */}
        <div className="pt-4 border-t border-white/10 text-[9px] font-mono text-white/40 leading-normal">
          Non-clinical introspective instrument. If feeling disoriented, trigger{' '}
          <button onClick={onOpenGroundModal} className="text-red-400 hover:underline">
            Ground / Exit
          </button>{' '}
          immediately.
        </div>
      </aside>
    </div>
  );
};
