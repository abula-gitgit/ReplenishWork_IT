import React, { useState } from 'react';
import { 
  Clock, 
  RotateCcw, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  History, 
  MapPin, 
  User, 
  Truck, 
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { formatItalianDate } from '../utils/dateCalc';
import { getCategoryColor } from '../utils/categoryColors';

interface ItemCardProps {
  item: CalculatedItem;
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
  onDelete: (id: string, name: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onQuickReplace,
  onCustomReplace,
  onEdit,
  onViewHistory,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const catColor = getCategoryColor(item.category);

  // Calcolo testo di stato
  let statusBadge = null;
  let statusBorder = 'border-slate-200/90';
  let progressColor = 'bg-blue-600';

  if (item.status === 'overdue') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
        Scaduto ({Math.abs(item.daysRemaining)} gg)
      </span>
    );
    statusBorder = 'border-rose-300 ring-1 ring-rose-500/20';
    progressColor = 'bg-rose-500';
  } else if (item.status === 'today') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
        Scadenza oggi
      </span>
    );
    statusBorder = 'border-amber-300 ring-1 ring-amber-500/20';
    progressColor = 'bg-amber-500';
  } else if (item.status === 'buy_soon') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
        Da riordinare (-{item.daysRemaining} gg)
      </span>
    );
    statusBorder = 'border-sky-300 ring-1 ring-sky-500/20';
    progressColor = 'bg-sky-500';
  } else {
    statusBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        Mancano {item.daysRemaining} gg
      </span>
    );
  }

  const cycleText = `${item.cycleValue} ${
    item.cycleUnit === 'day'
      ? item.cycleValue === 1 ? 'giorno' : 'giorni'
      : item.cycleUnit === 'week'
      ? item.cycleValue === 1 ? 'settimana' : 'settimane'
      : item.cycleUnit === 'month'
      ? item.cycleValue === 1 ? 'mese' : 'mesi'
      : item.cycleValue === 1 ? 'anno' : 'anni'
  }`;

  return (
    <div
      className={`bg-white rounded-2xl border ${statusBorder} p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all relative flex flex-col justify-between group`}
    >
      <div>
        {/* Intestazione scheda: Categoria & Menu */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border truncate max-w-[170px] ${catColor.badge}`}
            >
              {item.category}
            </span>
            {item.location && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 truncate max-w-[120px]">
                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {statusBadge}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label="Menu opzioni"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => onCustomReplace(item)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Data personalizzata</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewHistory(item)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cronologia ({item.history?.length || 0})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Modifica</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={() => onDelete(item.id, item.name)}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Elimina articolo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Titolo articolo & codice */}
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug mb-1">
          {item.name}
        </h3>

        {item.modelNumber && (
          <p className="text-[11px] font-mono text-slate-400 mb-2 truncate">
            Rif/Cod: {item.modelNumber}
          </p>
        )}

        {/* Barra di avanzamento ciclo */}
        <div className="mt-3 mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Ciclo: {cycleText}</span>
            </span>
            <span className="font-bold text-slate-700">{item.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${item.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dettagli date */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px]">Ultimo rinnovo</span>
            <span className="font-semibold text-slate-700">
              {formatItalianDate(item.lastReplacedDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Prossima scadenza</span>
            <span
              className={`font-bold ${
                item.status === 'overdue'
                  ? 'text-rose-600'
                  : item.status === 'today'
                  ? 'text-amber-600'
                  : 'text-slate-900'
              }`}
            >
              {formatItalianDate(item.nextReplacementDate)}
            </span>
          </div>
        </div>

        {/* Informazioni aggiuntive (Fornitore, Responsabile, Scorta) */}
        {(item.supplier || item.manager || item.minStock !== undefined) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3 pt-1 border-t border-slate-100">
            {item.supplier && (
              <span className="flex items-center gap-1 truncate max-w-[140px]" title={item.supplier}>
                <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{item.supplier}</span>
              </span>
            )}
            {item.manager && (
              <span className="flex items-center gap-1 truncate max-w-[120px]" title={item.manager}>
                <User className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{item.manager}</span>
              </span>
            )}
            {item.minStock !== undefined && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Scorta min: {item.minStock}</span>
              </span>
            )}
          </div>
        )}

        {/* Avviso di riordino anticipato */}
        {item.isPurchaseTime && item.status !== 'overdue' && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-900 text-[11px] flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 truncate">
              <AlertTriangle className="w-3 h-3 text-sky-600 shrink-0" />
              <span className="font-semibold truncate">Ordinare ({item.purchaseLeadDays} gg di consegna)</span>
            </span>
            {item.purchaseUrl && (
              <a
                href={item.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:text-sky-900 underline font-bold shrink-0 flex items-center gap-0.5"
              >
                <span>Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}

        {/* Nota */}
        {item.memo && (
          <p className="text-[11px] text-slate-500 italic line-clamp-2 mb-3 bg-white/60 p-1.5 rounded border border-slate-100">
            {item.memo}
          </p>
        )}
      </div>

      {/* Azione principale: Rinnovato oggi */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuickReplace(item)}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:bg-blue-600 group-hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Rinnovato oggi</span>
        </button>

        <button
          type="button"
          onClick={() => onCustomReplace(item)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          title="Imposta data di rinnovo personalizzata"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
