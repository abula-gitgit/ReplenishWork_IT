import React, { useState } from 'react';
import { X, Briefcase, Plus, Check, RefreshCw } from 'lucide-react';
import { INDUSTRY_TEMPLATES } from '../data/industryTemplates';
import { ConsumableItem } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

interface IndustryTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (items: ConsumableItem[], replaceAll: boolean) => void;
  currentItemsCount: number;
}

export const IndustryTemplateModal: React.FC<IndustryTemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentItemsCount
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(INDUSTRY_TEMPLATES[0].id);
  const [replaceAll, setReplaceAll] = useState(false);

  if (!isOpen) return null;

  const currentTemplate = INDUSTRY_TEMPLATES.find((t) => t.id === selectedTemplateId) || INDUSTRY_TEMPLATES[0];

  const handleApply = () => {
    const today = getTodayString();
    const newItems: ConsumableItem[] = currentTemplate.items.map((it, idx) => ({
      ...it,
      id: `item-${Date.now()}-${idx}`,
      lastReplacedDate: it.lastReplacedDate || today,
      purchaseLeadDays: it.purchaseLeadDays !== undefined ? it.purchaseLeadDays : 5,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    onApplyTemplate(newItems, replaceAll);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-5 sm:p-6 relative max-h-[92vh] flex flex-col my-auto">
        {/* Intestazione */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Modelli di settore pronti all'uso
              </h2>
              <p className="text-xs text-slate-500">
                Imposta rapidamente i materiali di consumo e i cicli raccomandati per la tua attività.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selezione settore */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 border-b border-slate-100 shrink-0">
          {INDUSTRY_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setSelectedTemplateId(tmpl.id)}
              className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2 cursor-pointer ${
                selectedTemplateId === tmpl.id
                  ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xl">{tmpl.icon}</span>
              <span className="text-xs truncate">{tmpl.name}</span>
            </button>
          ))}
        </div>

        {/* Anteprima articoli inclusi */}
        <div className="overflow-y-auto py-3 flex-1 text-xs space-y-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-2">
            <p className="text-slate-600 font-medium">{currentTemplate.description}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Contiene {currentTemplate.items.length} articoli raccomandati con cicli e tempi di consegna preconfigurati.
            </p>
          </div>

          <div className="space-y-1.5">
            {currentTemplate.items.map((item, i) => (
              <div
                key={i}
                className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>
                      Ciclo: {item.cycleValue}{' '}
                      {item.cycleUnit === 'day'
                        ? 'gg'
                        : item.cycleUnit === 'week'
                        ? 'sett.'
                        : item.cycleUnit === 'month'
                        ? 'mesi'
                        : 'anni'}
                    </span>
                    <span>•</span>
                    <span>Consegna: {item.purchaseLeadDays} gg</span>
                  </div>
                </div>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  Incluso
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Opzione Sostituisci / Aggiungi */}
        <div className="pt-3 border-t border-slate-100 text-xs shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="importMode"
                checked={!replaceAll}
                onChange={() => setReplaceAll(false)}
                className="text-blue-600"
              />
              <span>Aggiungi agli articoli esistenti ({currentItemsCount} attuali)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="importMode"
                checked={replaceAll}
                onChange={() => setReplaceAll(true)}
                className="text-blue-600"
              />
              <span className="text-rose-600">Sostituisci tutti gli articoli</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Applica modello ({currentTemplate.name})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
