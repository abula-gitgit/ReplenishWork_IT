import React, { useState, useEffect, useMemo } from 'react';
import { 
  ConsumableItem, 
  CalculatedItem, 
  ItemStatus, 
  Category, 
  ViewMode, 
  MasterOption 
} from './types/consumable';
import { 
  loadStoredItems, 
  saveStoredItems, 
  loadStoredCategories, 
  saveStoredCategories 
} from './utils/storage';
import { calculateItem, sortCalculatedItems, getTodayString } from './utils/dateCalc';
import { getMasterOptions, saveMasterOptions } from './utils/masterOptions';
import { 
  getNotificationPermission, 
  registerServiceWorker, 
  notifyUrgentItems 
} from './utils/notifications';

// Componenti
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { UrgentAlertBanner } from './components/UrgentAlertBanner';
import { FilterToolbar, SortOption } from './components/FilterToolbar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { MasterOptionModal } from './components/MasterOptionModal';
import { CustomReplaceModal } from './components/CustomReplaceModal';
import { HistoryModal } from './components/HistoryModal';
import { BackupModal } from './components/BackupModal';
import { NotificationModal } from './components/NotificationModal';
import { CalendarView } from './components/CalendarView';
import { CycleGuideView } from './components/CycleGuideView';
import { HistoryTimelineView } from './components/HistoryTimelineView';
import { IndustryTemplateModal } from './components/IndustryTemplateModal';
import { InfoPagesView, InfoTab } from './components/InfoPagesView';
import { BottomNavBar, BottomNavTab } from './components/BottomNavBar';
import { AdBanner } from './components/AdBanner';
import { Toast, ToastMessage } from './components/Toast';

import { Plus, Briefcase, PackageOpen } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ConsumableItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [masterOptions, setMasterOptions] = useState<MasterOption[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [infoTab, setInfoTab] = useState<InfoTab>('about');

  // Filtri & Ordinamento
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('priority');

  // Modali
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsumableItem | null>(null);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isIndustryTemplateModalOpen, setIsIndustryTemplateModalOpen] = useState(false);
  const [customReplaceItem, setCustomReplaceItem] = useState<CalculatedItem | null>(null);
  const [historyViewItem, setHistoryViewItem] = useState<CalculatedItem | null>(null);

  // Notifiche & PWA
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdVisible, setIsAdVisible] = useState(false);

  // Inizializzazione
  useEffect(() => {
    const loadedItems = loadStoredItems();
    const loadedCats = loadStoredCategories();
    const loadedMasters = getMasterOptions();

    setItems(loadedItems);
    setCategories(loadedCats);
    setMasterOptions(loadedMasters);

    setNotificationPermission(getNotificationPermission());
    registerServiceWorker();
  }, []);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info', action?: { label: string; onClick: () => void }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAndSaveItems = (newItems: ConsumableItem[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
  };

  // Calcolo dello stato di consumo
  const calculatedItems: CalculatedItem[] = useMemo(() => {
    const todayStr = getTodayString();
    return items.map((it) => calculateItem(it, todayStr));
  }, [items]);

  // Notifiche automatiche browser per scadenze
  useEffect(() => {
    if (calculatedItems.length > 0 && notificationPermission === 'granted') {
      notifyUrgentItems(calculatedItems);
    }
  }, [calculatedItems, notificationPermission]);

  // Conteggi riassuntivi
  const statusCounts = useMemo(() => {
    let overdue = 0;
    let today = 0;
    let buy_soon = 0;
    let normal = 0;

    calculatedItems.forEach((i) => {
      if (i.status === 'overdue') overdue++;
      else if (i.status === 'today') today++;
      else if (i.status === 'buy_soon') buy_soon++;
      else normal++;
    });

    return {
      total: calculatedItems.length,
      overdue,
      today,
      buy_soon,
      normal
    };
  }, [calculatedItems]);

  const urgentItems = useMemo(() => {
    return calculatedItems.filter((i) => i.status === 'overdue' || i.status === 'today' || i.status === 'buy_soon');
  }, [calculatedItems]);

  // Elenco filtrato e ordinato
  const displayItems = useMemo(() => {
    let list = calculatedItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesLocation = item.location ? item.location.toLowerCase().includes(query) : false;
        const matchesManager = item.manager ? item.manager.toLowerCase().includes(query) : false;
        const matchesSupplier = item.supplier ? item.supplier.toLowerCase().includes(query) : false;
        const matchesModel = item.modelNumber ? item.modelNumber.toLowerCase().includes(query) : false;
        const matchesMemo = item.memo ? item.memo.toLowerCase().includes(query) : false;
        return matchesName || matchesLocation || matchesManager || matchesSupplier || matchesModel || matchesMemo;
      }
      return true;
    });

    if (sortOption === 'priority') {
      list = sortCalculatedItems(list);
    } else if (sortOption === 'date_asc') {
      list = [...list].sort((a, b) => a.nextReplacementDate.localeCompare(b.nextReplacementDate));
    } else if (sortOption === 'date_desc') {
      list = [...list].sort((a, b) => b.nextReplacementDate.localeCompare(a.nextReplacementDate));
    } else if (sortOption === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'it'));
    } else if (sortOption === 'location') {
      list = [...list].sort((a, b) => (a.location || '').localeCompare(b.location || '', 'it'));
    }

    return list;
  }, [calculatedItems, selectedCategory, selectedStatus, searchQuery, sortOption]);

  // Azioni sugli articoli
  const handleQuickReplace = (item: CalculatedItem) => {
    const todayStr = getTodayString();
    const previousReplacedDate = item.lastReplacedDate;

    const newRecord = {
      id: `record-${Date.now()}`,
      replacedDate: todayStr,
      recordedAt: new Date().toISOString(),
      previousReplacedDate,
      memo: 'Rinnovo rapido'
    };

    const updated = items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            lastReplacedDate: todayStr,
            history: [newRecord, ...(i.history || [])],
            updatedAt: new Date().toISOString()
          }
        : i
    );

    updateAndSaveItems(updated);

    addToast(`«${item.name}» segnato come rinnovato oggi.`, 'success', {
      label: 'Annulla',
      onClick: () => handleUndoReplace(item.id, newRecord.id, previousReplacedDate)
    });
  };

  const handleUndoReplace = (itemId: string, recordId: string, prevDate?: string) => {
    if (!prevDate) return;
    const updated = items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            lastReplacedDate: prevDate,
            history: (i.history || []).filter((h) => h.id !== recordId),
            updatedAt: new Date().toISOString()
          }
        : i
    );
    updateAndSaveItems(updated);
    addToast('Rinnovo annullato con successo.', 'info');
  };

  const handleCustomReplaceConfirm = (itemId: string, replacedDate: string, memo: string) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    const newRecord = {
      id: `record-${Date.now()}`,
      replacedDate,
      recordedAt: new Date().toISOString(),
      previousReplacedDate: target.lastReplacedDate,
      memo: memo || 'Rinnovo personalizzato'
    };

    const updated = items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            lastReplacedDate: replacedDate,
            history: [newRecord, ...(i.history || [])],
            updatedAt: new Date().toISOString()
          }
        : i
    );

    updateAndSaveItems(updated);
    addToast(`Data di rinnovo salvata per «${target.name}».`, 'success');
  };

  const handleSaveItem = (data: Partial<ConsumableItem>) => {
    if (editingItem) {
      const updated = items.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              ...data,
              updatedAt: new Date().toISOString()
            }
          : i
      );
      updateAndSaveItems(updated);
      addToast(`«${data.name || editingItem.name}» aggiornato con successo.`, 'success');
    } else {
      const newItem: ConsumableItem = {
        id: `work-item-${Date.now()}`,
        name: data.name || 'Articolo senza nome',
        category: data.category || categories[0] || 'Cancelleria & Forniture per ufficio',
        cycleValue: data.cycleValue || 1,
        cycleUnit: data.cycleUnit || 'month',
        lastReplacedDate: data.lastReplacedDate || getTodayString(),
        purchaseLeadDays: data.purchaseLeadDays !== undefined ? data.purchaseLeadDays : 5,
        location: data.location,
        manager: data.manager,
        supplier: data.supplier,
        minStock: data.minStock,
        modelNumber: data.modelNumber,
        purchaseUrl: data.purchaseUrl,
        memo: data.memo,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updateAndSaveItems([newItem, ...items]);
      addToast(`«${newItem.name}» aggiunto al catalogo.`, 'success');
    }
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare definitivamente «${name}»?`)) {
      const updated = items.filter((i) => i.id !== id);
      updateAndSaveItems(updated);
      addToast(`«${name}» è stato eliminato.`, 'info');
    }
  };

  const handleDeleteHistoryEntry = (itemId: string, historyRecordId: string) => {
    const updated = items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            history: (i.history || []).filter((h) => h.id !== historyRecordId),
            updatedAt: new Date().toISOString()
          }
        : i
    );
    updateAndSaveItems(updated);
    addToast('Voce di cronologia eliminata.', 'info');
  };

  const handleApplyIndustryTemplate = (itemsToAdd: ConsumableItem[], replaceAll: boolean) => {
    if (replaceAll) {
      updateAndSaveItems(itemsToAdd);
      addToast(`Modello di settore applicato: ${itemsToAdd.length} articoli configurati.`, 'success');
    } else {
      updateAndSaveItems([...itemsToAdd, ...items]);
      addToast(`Modello di settore importato: ${itemsToAdd.length} articoli aggiunti.`, 'success');
    }
  };

  const handleImportItems = (imported: ConsumableItem[]) => {
    updateAndSaveItems(imported);
    addToast(`Ripristino completato: ${imported.length} articoli importati.`, 'success');
  };

  const handleUpdateMasterOptions = (newOpts: MasterOption[]) => {
    setMasterOptions(newOpts);
    saveMasterOptions(newOpts);
  };

  const handleUpdateCategories = (newCats: string[]) => {
    setCategories(newCats);
    saveStoredCategories(newCats);
  };

  const handleResetToSample = () => {
    localStorage.removeItem('replenish_work_it_items_v1');
    const fresh = loadStoredItems();
    setItems(fresh);
    addToast('Dati dimostrativi di esempio caricati.', 'success');
  };

  const handleClearAll = () => {
    updateAndSaveItems([]);
    addToast('Tutti i dati dell’inventario sono stati azzerati.', 'info');
  };

  const handleAddNewMasterOption = (newOpt: MasterOption) => {
    const updated = [...masterOptions, newOpt];
    handleUpdateMasterOptions(updated);
    addToast(`«${newOpt.name}» aggiunto ai modelli master riutilizzabili.`, 'success');
  };

  // Navigazione Mobile inferiore
  const currentNavTab: BottomNavTab = useMemo(() => {
    if (viewMode === 'guide') return 'guide';
    if (viewMode === 'calendar') return 'schedule';
    if (viewMode === 'history') return 'history';
    if (selectedStatus === 'buy_soon') return 'buy';
    return 'stock';
  }, [viewMode, selectedStatus]);

  const handleNavTabChange = (tab: BottomNavTab) => {
    if (tab === 'stock') {
      setViewMode('list');
      setSelectedStatus('all');
    } else if (tab === 'schedule') {
      setViewMode('calendar');
    } else if (tab === 'history') {
      setViewMode('history');
    } else if (tab === 'guide') {
      setViewMode('guide');
    } else if (tab === 'buy') {
      setViewMode('list');
      setSelectedStatus('buy_soon');
      const targetEl = document.getElementById('items-section');
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans antialiased flex flex-col overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Sfumatura ambientale di sfondo */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-blue-100/50 via-indigo-50/25 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[35%] -right-[15%] w-[600px] h-[500px] bg-sky-100/40 blur-3xl rounded-full" />
      </div>

      {/* Intestazione principale */}
      <Header
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenMasterModal={() => setIsMasterModalOpen(true)}
        onOpenIndustryTemplateModal={() => setIsIndustryTemplateModalOpen(true)}
        notificationPermission={notificationPermission}
        onRequestNotification={() => setIsNotificationModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        urgentCount={urgentItems.length}
      />

      {/* Contenuto principale */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 z-10">
        {/* Vista Inventario (Lista) */}
        {viewMode === 'list' && (
          <div id="items-section">
            {/* Banner di allerta scadenze urgenti */}
            <UrgentAlertBanner
              urgentItems={urgentItems}
              onFocusStatus={(status: ItemStatus) => setSelectedStatus(status)}
            />

            {/* Schede riassuntive numeriche */}
            <SummaryCards
              statusCounts={statusCounts}
              activeStatusFilter={selectedStatus}
              onSelectStatusFilter={setSelectedStatus}
            />

            {/* Barra di ricerca e filtri */}
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              categories={categories}
            />

            {/* Griglia articoli */}
            {displayItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 sm:p-14 text-center my-6">
                <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Nessun articolo trovato
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Aggiungi le tue forniture aziendali o scegli un modello di settore pronto all'uso (ufficio, clinica, ristorazione, ecc.).
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddEditModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Aggiungi primo articolo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsIndustryTemplateModalOpen(true)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Modelli di settore</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onQuickReplace={handleQuickReplace}
                    onCustomReplace={(it) => setCustomReplaceItem(it)}
                    onEdit={(it) => {
                      setEditingItem(it);
                      setIsAddEditModalOpen(true);
                    }}
                    onViewHistory={(it) => setHistoryViewItem(it)}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vista Calendario */}
        {viewMode === 'calendar' && (
          <CalendarView
            items={calculatedItems}
            onQuickReplace={handleQuickReplace}
            onCustomReplace={(it) => setCustomReplaceItem(it)}
            onEdit={(it) => {
              setEditingItem(it);
              setIsAddEditModalOpen(true);
            }}
            onViewHistory={(it) => setHistoryViewItem(it)}
          />
        )}

        {/* Vista Cronologia */}
        {viewMode === 'history' && (
          <HistoryTimelineView
            items={calculatedItems}
            categories={categories}
            onDeleteHistoryEntry={handleDeleteHistoryEntry}
            onNavigateToList={() => setViewMode('list')}
            onEditItem={(it) => {
              setEditingItem(it);
              setIsAddEditModalOpen(true);
            }}
          />
        )}

        {/* Vista Manuale Cicli */}
        {viewMode === 'guide' && (
          <CycleGuideView
            onNavigateToList={() => setViewMode('list')}
            onAddPresetItem={(preset) => handleSaveItem(preset)}
          />
        )}

        {/* Pagine informative & legali */}
        {(viewMode === 'about' || viewMode === 'privacy' || viewMode === 'terms' || viewMode === 'contact') && (
          <InfoPagesView
            initialTab={infoTab}
            onNavigateToList={() => setViewMode('list')}
            onTabChange={(tab) => setInfoTab(tab)}
          />
        )}
      </main>

      {/* Piè di pagina */}
      <footer className="mt-auto bg-white/80 border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500 z-10 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-slate-900">Replenish for Work</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">IT</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Gestore locale e serverless dei cicli di consumo e manutenzione aziendale. Dati memorizzati al 100% sul tuo dispositivo (IndexedDB/LocalStorage).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setInfoTab('about');
                setViewMode('about');
              }}
              className="hover:text-blue-600 transition"
            >
              Chi siamo
            </button>
            <button
              type="button"
              onClick={() => {
                setInfoTab('privacy');
                setViewMode('privacy');
              }}
              className="hover:text-blue-600 transition"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => {
                setInfoTab('terms');
                setViewMode('terms');
              }}
              className="hover:text-blue-600 transition"
            >
              Termini d'uso
            </button>
            <button
              type="button"
              onClick={() => {
                setInfoTab('contact');
                setViewMode('contact');
              }}
              className="hover:text-blue-600 transition"
            >
              Contatti
            </button>
            <a
              href="https://rpw.easy-log.app/it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Portale rpw.easy-log.app
            </a>
          </div>
        </div>
      </footer>

      {/* Navigazione Mobile inferiore */}
      <BottomNavBar
        currentTab={currentNavTab}
        onTabChange={handleNavTabChange}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddEditModalOpen(true);
        }}
        urgentCount={urgentItems.length}
        buyCount={statusCounts.buy_soon}
        isAdVisible={isAdVisible}
      />

      {/* Banner pubblicitario */}
      <AdBanner onVisibilityChange={setIsAdVisible} />

      {/* Finestre modali */}
      <ItemModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
        masterOptions={masterOptions}
        onOpenMasterManager={() => setIsMasterModalOpen(true)}
        onAddNewMasterOption={handleAddNewMasterOption}
        categories={categories}
      />

      <MasterOptionModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        options={masterOptions}
        onUpdateOptions={handleUpdateMasterOptions}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
        items={items}
        onUpdateItems={updateAndSaveItems}
      />

      <CustomReplaceModal
        isOpen={Boolean(customReplaceItem)}
        item={customReplaceItem}
        onClose={() => setCustomReplaceItem(null)}
        onConfirm={handleCustomReplaceConfirm}
      />

      <HistoryModal
        isOpen={Boolean(historyViewItem)}
        item={historyViewItem}
        onClose={() => setHistoryViewItem(null)}
        onDeleteHistoryEntry={handleDeleteHistoryEntry}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        items={items}
        masterOptions={masterOptions}
        categories={categories}
        onImportItems={handleImportItems}
        onImportMasterOptions={handleUpdateMasterOptions}
        onImportCategories={handleUpdateCategories}
        onResetToSample={handleResetToSample}
        onClearAll={handleClearAll}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        urgentItems={urgentItems}
        onPermissionChange={(perm) => setNotificationPermission(perm)}
        onShowToast={(text, type) => addToast(text, type)}
      />

      <IndustryTemplateModal
        isOpen={isIndustryTemplateModalOpen}
        onClose={() => setIsIndustryTemplateModalOpen(false)}
        onApplyTemplate={handleApplyIndustryTemplate}
        currentItemsCount={items.length}
      />

      {/* Notifiche Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
