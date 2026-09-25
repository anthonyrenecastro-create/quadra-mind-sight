import React, { useState } from 'react';
import { MODEL_LAB_ITEMS } from '../../data/modelLabData';
import { ModelLabItem } from '../../types';
import { Sparkles, CheckCircle2, HelpCircle, BookOpen, ShieldCheck, Atom } from 'lucide-react';

export const ModelLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supported' | 'speculative'>('supported');
  const [selectedItem, setSelectedItem] = useState<ModelLabItem>(MODEL_LAB_ITEMS[0]);

  const items = MODEL_LAB_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div id="model-lab-view" className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
          Cognitive Science & Theoretical Foundations
        </span>
        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center gap-2">
          <Atom className="w-5 h-5 text-[#D4AF37]" />
          MODEL LAB
        </h2>
        <p className="text-xs text-white/60 mt-1 max-w-3xl font-light leading-relaxed">
          Explore the neuroscientific paradigms and theoretical models that inform the Quadra system.
          Mainstream empirical science and exploratory speculative hypotheses are strictly demarcated.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          id="tab-supported-science"
          onClick={() => {
            setActiveTab('supported');
            setSelectedItem(MODEL_LAB_ITEMS.find((i) => i.category === 'supported') || MODEL_LAB_ITEMS[0]);
          }}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === 'supported'
              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 font-bold'
              : 'text-white/50 hover:text-white border border-transparent'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          Supported / Mainstream Science ({MODEL_LAB_ITEMS.filter((i) => i.category === 'supported').length})
        </button>

        <button
          id="tab-speculative-models"
          onClick={() => {
            setActiveTab('speculative');
            setSelectedItem(MODEL_LAB_ITEMS.find((i) => i.category === 'speculative') || MODEL_LAB_ITEMS[0]);
          }}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === 'speculative'
              ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/40 font-bold'
              : 'text-white/50 hover:text-white border border-transparent'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
          Experimental / Speculative Models ({MODEL_LAB_ITEMS.filter((i) => i.category === 'speculative').length})
        </button>
      </div>

      {/* Master Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List Column */}
        <div className="lg:col-span-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-4 border rounded-xs cursor-pointer transition-all ${
                selectedItem.id === item.id
                  ? item.category === 'supported'
                    ? 'border-[#10B981] bg-[#10B981]/10 text-white'
                    : 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                  : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-white/70'
              }`}
            >
              <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">
                {item.field}
              </span>
              <h4 className="text-xs sm:text-sm font-medium tracking-wide">{item.title}</h4>
              <p className="text-[11px] text-white/50 line-clamp-2 mt-1 font-light">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Detail Column */}
        <div className="lg:col-span-8 border border-white/10 bg-[#050508]/90 p-6 sm:p-8 rounded-xs space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[9.5px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-xs font-bold ${
                  selectedItem.category === 'supported'
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                    : 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30'
                }`}
              >
                {selectedItem.category === 'supported' ? 'Peer-Reviewed Consensus' : 'Theoretical Hypothesis'}
              </span>
              <span className="text-white/40 text-xs font-mono">• {selectedItem.field}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              {selectedItem.title}
            </h3>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold mb-2">
              Core Summary
            </h4>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light font-sans">
              {selectedItem.summary}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 font-bold mb-2">
              Key Tenets & Mechanisms
            </h4>
            <ul className="space-y-2">
              {selectedItem.keyTenets.map((tenet, idx) => (
                <li key={idx} className="text-xs text-white/80 font-light flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{tenet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border border-white/5 bg-black/40 rounded-xs space-y-1">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-white/40 font-bold block">
              Scientific Standing & Empirical Consensus:
            </span>
            <p className="text-xs text-white/70 font-light font-sans leading-relaxed">
              {selectedItem.scientificStanding}
            </p>
          </div>

          <div className="p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xs space-y-1">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Application in Quadra-M.I.N.D. Sight
            </span>
            <p className="text-xs text-white/90 font-light font-sans leading-relaxed">
              {selectedItem.quadraRelevance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
