import React, { useState } from 'react';
import { 
  Plus, 
  Database, 
  Bell, 
  BellOff, 
  Settings2, 
  Briefcase, 
  ListFilter, 
  CalendarDays, 
  History, 
  BookOpen, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { ViewMode } from '../types/consumable';

interface HeaderProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenMasterModal: () => void;
  onOpenIndustryTemplateModal: () => void;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestNotification: () => void;
  onOpenNotificationModal: () => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewChange,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenMasterModal,
  onOpenIndustryTemplateModal,
  notificationPermission,
  onRequestNotification,
  onOpenNotificationModal,
  urgentCount
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'ja', name: '日本語 (JP)', url: 'https://rpwjp.easy-log.app/' },
    { code: 'en', name: 'English (EN)', url: 'https://rpwen.easy-log.app/' },
    { code: 'fr', name: 'Français (FR)', url: 'https://rpwfr.easy-log.app/' },
    { code: 'de', name: 'Deutsch (DE)', url: 'https://rpwde.easy-log.app/' },
    { code: 'it', name: 'Italiano (IT)', url: 'https://rpwit.easy-log.app/', current: true }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Titolo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  Replenish
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200/70">
                  for Work
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  IT
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium truncate">
                Gestore dei cicli di consumo e manutenzione aziendale
              </p>
            </div>
          </div>

          {/* Navigazione Desktop */}
          <div className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Inventario</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendario</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'history'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Cronologia</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'guide'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manuale</span>
            </button>
          </div>

          {/* Azioni intestazione */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Notifiche */}
            <button
              type="button"
              onClick={onOpenNotificationModal}
              className={`p-2 rounded-xl border transition relative cursor-pointer ${
                notificationPermission === 'granted'
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
              }`}
              title={
                notificationPermission === 'granted'
                  ? 'Notifiche attive'
                  : 'Attiva le notifiche'
              }
            >
              {notificationPermission === 'granted' ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4 text-amber-600" />
              )}
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Menu selezione lingua */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Cambia lingua"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">IT</span>
              </button>

              {isLangMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
                  onClick={() => setIsLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                    Seleziona lingua
                  </div>
                  {languages.map((l) => (
                    <a
                      key={l.code}
                      href={l.url}
                      className={`flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition ${
                        l.current ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.name}</span>
                      {l.current && <span className="text-[10px] font-bold text-blue-600">Attiva</span>}
                    </a>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <a
                    href="https://rpw.easy-log.app/it"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition"
                  >
                    <span>Portale informativo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modelli di settore */}
            <button
              type="button"
              onClick={onOpenIndustryTemplateModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Modelli di settore</span>
            </button>

            {/* Preimpostazioni master */}
            <button
              type="button"
              onClick={onOpenMasterModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Preimpostazioni</span>
            </button>

            {/* Backup */}
            <button
              type="button"
              onClick={onOpenBackupModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Backup</span>
            </button>

            {/* Bottone Aggiungi Desktop */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Nuovo articolo</span>
              <span className="sm:hidden">Nuovo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
