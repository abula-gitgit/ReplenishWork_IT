import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getCalendarGrid, formatItalianDate, getTodayString } from '../utils/dateCalc';

interface CalendarViewProps {
  items: CalculatedItem[];
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  items,
  onQuickReplace,
  onCustomReplace,
  onEdit,
  onViewHistory
}) => {
  const todayStr = getTodayString();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const weekDayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const grid = getCalendarGrid(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(todayStr);
  };

  // Mappa delle scadenze per data
  const dateItemsMap: Record<string, CalculatedItem[]> = {};
  items.forEach((item) => {
    const d = item.nextReplacementDate;
    if (!dateItemsMap[d]) {
      dateItemsMap[d] = [];
    }
    dateItemsMap[d].push(item);
  });

  const selectedItems = dateItemsMap[selectedDate] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Vista Calendario */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs">
        {/* Controlli del mese */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
            >
              Oggi
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Mese precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Mese successivo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intestazione giorni settimana */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2">
          {weekDayNames.map((day, idx) => (
            <div key={day} className={idx >= 5 ? 'text-amber-500' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* Griglia giorni */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell) => {
            const hasItems = dateItemsMap[cell.date] && dateItemsMap[cell.date].length > 0;
            const isToday = cell.date === todayStr;
            const isSelected = cell.date === selectedDate;
            const dayNum = parseInt(cell.date.split('-')[2], 10);

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                className={`min-h-[64px] sm:min-h-[76px] p-1.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50'
                    : isToday
                    ? 'border-blue-300 bg-blue-50/20'
                    : cell.isCurrentMonth
                    ? 'border-slate-100 bg-white hover:bg-slate-50'
                    : 'border-transparent bg-slate-50/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]'
                        : cell.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>

                {hasItems && (
                  <div className="space-y-0.5 mt-1 overflow-hidden">
                    {dateItemsMap[cell.date].slice(0, 2).map((it) => (
                      <div
                        key={it.id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                          it.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : it.status === 'today'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {it.name}
                      </div>
                    ))}
                    {dateItemsMap[cell.date].length > 2 && (
                      <span className="text-[8px] font-bold text-slate-400 block text-right pr-0.5">
                        +{dateItemsMap[cell.date].length - 2} altri
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dettagli della data selezionata */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-col">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              {formatItalianDate(selectedDate)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {selectedItems.length} articolo/i in scadenza
            </p>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 space-y-3 pr-1 text-xs">
          {selectedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p>Nessun rinnovo previsto per questo giorno.</p>
            </div>
          ) : (
            selectedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {item.category} {item.location ? `• ${item.location}` : ''}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                      item.status === 'overdue'
                        ? 'bg-rose-100 text-rose-700'
                        : item.status === 'today'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.status === 'overdue'
                      ? 'Scaduto'
                      : item.status === 'today'
                      ? 'Scadenza oggi'
                      : 'In programma'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onQuickReplace(item)}
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Rinnovato</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCustomReplace(item)}
                    className="px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    Data...
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    Modifica
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
