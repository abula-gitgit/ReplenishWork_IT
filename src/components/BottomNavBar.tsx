import React from 'react';
import { Package, Calendar, Plus, ShoppingCart, BookOpen } from 'lucide-react';

export type BottomNavTab = 'stock' | 'schedule' | 'buy' | 'guide' | 'history';

interface BottomNavBarProps {
  currentTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  onOpenAddModal: () => void;
  urgentCount: number;
  buyCount: number;
  isAdVisible?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  urgentCount,
  buyCount,
  isAdVisible = false
}) => {
  return (
    <div
      className={`md:hidden fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 transition-all duration-200 ${
        isAdVisible ? 'bottom-[60px]' : 'bottom-0'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Inventario */}
        <button
          type="button"
          onClick={() => onTabChange('stock')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'stock' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5 stroke-[2]" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                {urgentCount > 9 ? '9+' : urgentCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Inventario</span>
        </button>

        {/* Calendario */}
        <button
          type="button"
          onClick={() => onTabChange('schedule')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'schedule' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5">Scadenze</span>
        </button>

        {/* Bottone Aggiungi centrale */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center -top-4 relative cursor-pointer group"
          aria-label="Aggiungi articolo"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 mt-0.5">Nuovo</span>
        </button>

        {/* Da ordinare */}
        <button
          type="button"
          onClick={() => onTabChange('buy')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'buy' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            {buyCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-[9px] font-extrabold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                {buyCount > 9 ? '9+' : buyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Riordini</span>
        </button>

        {/* Manuale cicli */}
        <button
          type="button"
          onClick={() => onTabChange('guide')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'guide' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5">Manuale</span>
        </button>
      </div>
    </div>
  );
};
