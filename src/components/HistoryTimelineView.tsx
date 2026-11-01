import React, { useState, useMemo } from 'react';
import { History, Calendar, ArrowLeft, Trash2, Edit2, Filter, Layers } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { formatItalianDate } from '../utils/dateCalc';
import { getCategoryColor } from '../utils/categoryColors';

interface HistoryTimelineViewProps {
  items: CalculatedItem[];
  categories: string[];
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
  onNavigateToList: () => void;
  onEditItem: (item: CalculatedItem) => void;
}

interface FlattenedRecord {
  recordId: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemLocation?: string;
  replacedDate: string;
  recordedAt: string;
  memo?: string;
  rawItem: CalculatedItem;
}

export const HistoryTimelineView: React.FC<HistoryTimelineViewProps> = ({
  items,
  categories,
  onDeleteHistoryEntry,
  onNavigateToList,
  onEditItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('all');

  const allRecords: FlattenedRecord[] = useMemo(() => {
    const list: FlattenedRecord[] = [];
    items.forEach((item) => {
      (item.history || []).forEach((h) => {
        list.push({
          recordId: h.id,
          itemId: item.id,
          itemName: item.name,
          itemCategory: item.category,
          itemLocation: item.location,
          replacedDate: h.replacedDate,
          recordedAt: h.recordedAt,
          memo: h.memo,
          rawItem: item
        });
      });
    });

    return list.sort((a, b) => b.replacedDate.localeCompare(a.replacedDate));
  }, [items]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec) => {
      if (selectedCategory !== 'all' && rec.itemCategory !== selectedCategory) {
        return false;
      }
      if (selectedItemId !== 'all' && rec.itemId !== selectedItemId) {
        return false;
      }
      return true;
    });
  }, [allRecords, selectedCategory, selectedItemId]);

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateToList}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title="Torna all'inventario"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Registro cronologico sostituzioni
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {allRecords.length} registrazioni
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Storico dettagliato di tutti i rinnovi e gli interventi registrati nel tempo.
            </p>
          </div>
        </div>
      </div>

      {/* Barra filtri */}
      <div className="flex flex-wrap gap-3 bg-white/70 p-3 rounded-2xl border border-slate-200/70 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-600">Filtra per:</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
        >
          <option value="all">Tutte le categorie</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer max-w-xs truncate"
        >
          <option value="all">Tutti gli articoli ({items.length})</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
          <History className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-[1.5]" />
          <h3 className="font-bold text-slate-700 text-sm mb-1">Nessun rinnovo registrato</h3>
          <p className="text-xs text-slate-500">
            I rinnovi compariranno qui non appena premerai «Rinnovato oggi» o registrerai una data personalizzata.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredRecords.map((rec) => {
            const catColor = getCategoryColor(rec.itemCategory);

            return (
              <div key={rec.recordId} className="relative group">
                {/* Nodo timeline */}
                <div className="absolute -left-6 sm:-left-8 top-3.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm text-slate-900">
                        {formatItalianDate(rec.replacedDate)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${catColor.badge}`}>
                        {rec.itemCategory}
                      </span>
                      {rec.itemLocation && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {rec.itemLocation}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm">{rec.itemName}</h4>

                    {rec.memo && (
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {rec.memo}
                      </p>
                    )}

                    <span className="text-[10px] text-slate-400 block mt-1">
                      Registrato il: {new Date(rec.recordedAt).toLocaleString('it-IT')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditItem(rec.rawItem)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      title="Modifica articolo"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Eliminare definitivamente questa registrazione dalla cronologia?')) {
                          onDeleteHistoryEntry(rec.itemId, rec.recordId);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Elimina voce"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
