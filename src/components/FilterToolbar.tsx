import React from 'react';
import { Search, ArrowUpDown, Tag, X } from 'lucide-react';
import { Category } from '../types/consumable';

export type SortOption = 'priority' | 'date_asc' | 'date_desc' | 'name' | 'location';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  categories
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-6 shadow-2xs">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Barra di ricerca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca per nome, fornitore, posizione, codice..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtri & Ordinamento */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Filtro per categoria */}
          <div className="relative flex-1 sm:w-56">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as Category | 'all')}
              className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
            >
              <option value="all">Tutte le categorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Menu Ordinamento */}
          <div className="relative flex-1 sm:w-52">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
            >
              <option value="priority">Priorità (Urgente prima)</option>
              <option value="date_asc">Scadenza (Più vicina)</option>
              <option value="date_desc">Scadenza (Più lontana)</option>
              <option value="name">Nome articolo (A - Z)</option>
              <option value="location">Posizione / Reparto</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
