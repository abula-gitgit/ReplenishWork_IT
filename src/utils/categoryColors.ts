import { Category } from '../types/consumable';

export interface CategoryColor {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  'Cancelleria & Forniture per ufficio': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100/80 text-blue-800 border-blue-200',
    dot: 'bg-blue-500'
  },
  'Forniture mediche & Studio / Farmacia': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'Ristorazione, Bar & Cucina': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100/80 text-amber-800 border-amber-200',
    dot: 'bg-amber-500'
  },
  'Salone & Cosmetica': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100/80 text-purple-800 border-purple-200',
    dot: 'bg-purple-500'
  },
  'Officina, Manutenzione & Industria': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    badge: 'bg-orange-100/80 text-orange-800 border-orange-200',
    dot: 'bg-orange-500'
  },
  'Hotel & Strutture ricettive': {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badge: 'bg-teal-100/80 text-teal-800 border-teal-200',
    dot: 'bg-teal-500'
  },
  'Pulizia & Igiene': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100/80 text-cyan-800 border-cyan-200',
    dot: 'bg-cyan-500'
  },
  'Altro': {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    badge: 'bg-slate-100/80 text-slate-800 border-slate-200',
    dot: 'bg-slate-400'
  }
};

export function getCategoryColor(category: Category): CategoryColor {
  return (
    CATEGORY_COLORS[category] || {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-100/80 text-slate-800 border-slate-200',
      dot: 'bg-slate-400'
    }
  );
}
