import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Search,
  X,
  Plus,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { REPLACEMENT_GUIDES, ReplacementGuideItem, mapGuideToPreset } from '../data/replacementGuides';
import { ConsumableItem } from '../types/consumable';
import { GuideIllustration } from './GuideIllustrations';

interface CycleGuideViewProps {
  onNavigateToList?: () => void;
  onAddPresetItem?: (preset: ConsumableItem) => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'Tutti i manuali' },
  { id: 'office', label: 'Ufficio & Documenti' },
  { id: 'sanitary', label: 'Cucina & Area break' },
  { id: 'hvac', label: 'Climatizzazione & Aria' },
  { id: 'safety', label: 'Sicurezza & D.Lgs. 81' }
];

export const CycleGuideView: React.FC<CycleGuideViewProps> = ({ onNavigateToList, onAddPresetItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ReplacementGuideItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: REPLACEMENT_GUIDES.length };
    REPLACEMENT_GUIDES.forEach((guide) => {
      counts[guide.category] = (counts[guide.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredGuides = useMemo(() => {
    return REPLACEMENT_GUIDES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        const matchesReason = item.hygieneReason.toLowerCase().includes(query);
        const matchesDanger = item.dangerOfNeglect.toLowerCase().includes(query);
        const matchesSigns = item.signsOfDegradation.some((s) => s.toLowerCase().includes(query));
        const matchesTips = item.proTips.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesReason || matchesDanger || matchesSigns || matchesTips;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Intestazione Guida */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Guida pratica ai cicli di manutenzione & rinnovo</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Linee guida e frequenze consigliate per attrezzature e materiali professionali.
              </p>
            </div>
          </div>

          {onNavigateToList && (
            <button
              type="button"
              onClick={onNavigateToList}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Al mio inventario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Barra di ricerca e tab */}
        <div className="pt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca nella guida (es. distruggidocumenti, filtro acqua, pronto soccorso)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schede guida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between"
          >
            <div>
              <GuideIllustration
                guideId={guide.id}
                title={guide.title}
                categoryLabel={guide.categoryLabel}
                className="mb-4"
              />

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>{guide.cycleDisplay}</span>
                </span>
                {guide.badgeLabel && (
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-700">
                    {guide.badgeLabel}
                  </span>
                )}
              </div>

              {/* Perché rinnovare regolarmente */}
              <div className="space-y-3 text-xs mb-5">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Perché è fondamentale:</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {guide.hygieneReason}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-rose-950 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Rischi del mancato rinnovo:</span>
                  </h4>
                  <p className="text-rose-900/80 leading-relaxed bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    {guide.dangerOfNeglect}
                  </p>
                </div>

                {/* Segnali di usura */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">
                    Segnali evidenti di usura:
                  </h4>
                  <ul className="space-y-1 text-slate-600">
                    {guide.signsOfDegradation.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consiglio operativo */}
                {guide.proTips && (
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-950">
                    <div className="flex items-center gap-1 font-bold mb-0.5 text-amber-900">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Suggerimento pratico:</span>
                    </div>
                    <p className="leading-relaxed">{guide.proTips}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottone Aggiungi */}
            {onAddPresetItem && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onAddPresetItem(mapGuideToPreset(guide))}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi all'inventario</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
