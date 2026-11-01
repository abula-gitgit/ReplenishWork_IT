import React from 'react';
import { X, History, Trash2, Calendar } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { formatItalianDate } from '../utils/dateCalc';

interface HistoryModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  item,
  onClose,
  onDeleteHistoryEntry
}) => {
  if (!isOpen || !item) return null;

  const records = item.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 relative max-h-[85vh] flex flex-col">
        {/* Intestazione */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Cronologia sostituzioni
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[260px]">
                {item.name}
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

        {/* Elenco registrazioni */}
        <div className="overflow-y-auto py-4 flex-1 text-xs space-y-2.5">
          {records.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p>Nessun rinnovo registrato finora.</p>
              <p className="text-[11px] mt-1 text-slate-400">
                Ogni volta che premi «Rinnovato oggi», l'operazione verrà archiviata qui.
              </p>
            </div>
          ) : (
            records.map((rec, idx) => (
              <div
                key={rec.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatItalianDate(rec.replacedDate)}
                    </span>
                    {idx === 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">
                        Più recente
                      </span>
                    )}
                  </div>
                  {rec.memo && (
                    <p className="text-slate-600 text-[11px] mt-0.5">{rec.memo}</p>
                  )}
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Registrato: {new Date(rec.recordedAt).toLocaleString('it-IT')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Eliminare questa voce dallo storico?')) {
                      onDeleteHistoryEntry(item.id, rec.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                  title="Elimina voce di storico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
