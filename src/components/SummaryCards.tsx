import React from 'react';
import { AlertCircle, Clock, ShoppingBag, CheckCircle2, Layers } from 'lucide-react';
import { ItemStatus } from '../types/consumable';

interface SummaryCardsProps {
  statusCounts: {
    total: number;
    overdue: number;
    today: number;
    buy_soon: number;
    normal: number;
  };
  activeStatusFilter: ItemStatus | 'all';
  onSelectStatusFilter: (status: ItemStatus | 'all') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  statusCounts,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const cards = [
    {
      id: 'overdue' as const,
      label: 'Scaduti',
      sublabel: 'Sostituzione urgente',
      count: statusCounts.overdue,
      icon: AlertCircle,
      activeColor: 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20',
      badgeColor: 'bg-rose-600 text-white',
      iconColor: 'text-rose-600',
      isWarning: statusCounts.overdue > 0
    },
    {
      id: 'today' as const,
      label: 'Scadenza oggi',
      sublabel: 'Rinnovo programmato',
      count: statusCounts.today,
      icon: Clock,
      activeColor: 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-500/20',
      badgeColor: 'bg-amber-600 text-white',
      iconColor: 'text-amber-600',
      isWarning: statusCounts.today > 0
    },
    {
      id: 'buy_soon' as const,
      label: 'Da riordinare',
      sublabel: 'Preavviso fornitore',
      count: statusCounts.buy_soon,
      icon: ShoppingBag,
      activeColor: 'bg-sky-50 border-sky-300 text-sky-900 ring-2 ring-sky-500/20',
      badgeColor: 'bg-sky-600 text-white',
      iconColor: 'text-sky-600',
      isWarning: statusCounts.buy_soon > 0
    },
    {
      id: 'normal' as const,
      label: 'Regolare',
      sublabel: 'Scorte stabili',
      count: statusCounts.normal,
      icon: CheckCircle2,
      activeColor: 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20',
      badgeColor: 'bg-emerald-600 text-white',
      iconColor: 'text-emerald-600',
      isWarning: false
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatusFilter(isActive ? 'all' : card.id)}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              isActive
                ? card.activeColor
                : 'bg-white/90 hover:bg-slate-50 border-slate-200/90 text-slate-700 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? card.badgeColor : 'bg-slate-100 ' + card.iconColor
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {card.count}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate ml-2">
                {card.sublabel}
              </span>
            </div>

            {card.isWarning && (
              <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-lg bg-rose-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};
