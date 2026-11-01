import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

interface CustomReplaceModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onConfirm: (itemId: string, replacedDate: string, memo: string) => void;
}

export const CustomReplaceModal: React.FC<CustomReplaceModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  const [replacedDate, setReplacedDate] = useState(getTodayString());
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReplacedDate(getTodayString());
      setMemo('');
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacedDate) return;
    onConfirm(item.id, replacedDate, memo.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Data di rinnovo personalizzata
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Data effettiva di rinnovo <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={replacedDate}
              onChange={(e) => setReplacedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              La prossima scadenza verrà calcolata a partire da questa data.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nota per il registro storico
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="es. Sostituzione anticipata per ispezione periodica"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Registra rinnovo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
