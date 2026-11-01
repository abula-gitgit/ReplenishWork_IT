import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, BookmarkCheck } from 'lucide-react';
import { ConsumableItem, CycleUnit, Category, MasterOption } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ConsumableItem>) => void;
  initialItem?: ConsumableItem | null;
  masterOptions: MasterOption[];
  onOpenMasterManager: () => void;
  onAddNewMasterOption: (opt: MasterOption) => void;
  categories: string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  masterOptions,
  onOpenMasterManager,
  onAddNewMasterOption,
  categories
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('');
  const [cycleValue, setCycleValue] = useState<number>(1);
  const [cycleUnit, setCycleUnit] = useState<CycleUnit>('month');
  const [lastReplacedDate, setLastReplacedDate] = useState(getTodayString());
  const [purchaseLeadDays, setPurchaseLeadDays] = useState<number>(5);
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [supplier, setSupplier] = useState('');
  const [minStock, setMinStock] = useState<string>('');
  const [modelNumber, setModelNumber] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [saveAsMaster, setSaveAsMaster] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || '');
      setCategory(initialItem.category || categories[0] || 'Cancelleria & Forniture per ufficio');
      setCycleValue(initialItem.cycleValue || 1);
      setCycleUnit(initialItem.cycleUnit || 'month');
      setLastReplacedDate(initialItem.lastReplacedDate || getTodayString());
      setPurchaseLeadDays(initialItem.purchaseLeadDays !== undefined ? initialItem.purchaseLeadDays : 5);
      setLocation(initialItem.location || '');
      setManager(initialItem.manager || '');
      setSupplier(initialItem.supplier || '');
      setMinStock(initialItem.minStock !== undefined ? String(initialItem.minStock) : '');
      setModelNumber(initialItem.modelNumber || '');
      setPurchaseUrl(initialItem.purchaseUrl || '');
      setMemo(initialItem.memo || '');
      setSaveAsMaster(false);
    } else {
      setName('');
      setCategory(categories[0] || 'Cancelleria & Forniture per ufficio');
      setCycleValue(1);
      setCycleUnit('month');
      setLastReplacedDate(getTodayString());
      setPurchaseLeadDays(5);
      setLocation('');
      setManager('');
      setSupplier('');
      setMinStock('');
      setModelNumber('');
      setPurchaseUrl('');
      setMemo('');
      setSaveAsMaster(false);
    }
  }, [initialItem, isOpen, categories]);

  if (!isOpen) return null;

  const handleSelectMaster = (masterId: string) => {
    if (!masterId) return;
    const target = masterOptions.find((m) => m.id === masterId);
    if (!target) return;

    setName(target.name);
    setCategory(target.category);
    setCycleValue(target.cycleValue);
    setCycleUnit(target.cycleUnit);
    setPurchaseLeadDays(target.purchaseLeadDays);
    if (target.supplier) setSupplier(target.supplier);
    if (target.location) setLocation(target.location);
    if (target.modelNumber) setModelNumber(target.modelNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Partial<ConsumableItem> = {
      name: name.trim(),
      category: category || categories[0] || 'Cancelleria & Forniture per ufficio',
      cycleValue: Number(cycleValue) || 1,
      cycleUnit,
      lastReplacedDate,
      purchaseLeadDays: Number(purchaseLeadDays) || 0,
      location: location.trim() || undefined,
      manager: manager.trim() || undefined,
      supplier: supplier.trim() || undefined,
      minStock: minStock.trim() !== '' ? Number(minStock) : undefined,
      modelNumber: modelNumber.trim() || undefined,
      purchaseUrl: purchaseUrl.trim() || undefined,
      memo: memo.trim() || undefined
    };

    if (saveAsMaster && !initialItem) {
      onAddNewMasterOption({
        id: `master-${Date.now()}`,
        name: data.name!,
        category: data.category!,
        cycleValue: data.cycleValue!,
        cycleUnit: data.cycleUnit!,
        purchaseLeadDays: data.purchaseLeadDays!,
        supplier: data.supplier,
        location: data.location,
        modelNumber: data.modelNumber
      });
    }

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-5 sm:p-6 relative max-h-[92vh] flex flex-col my-auto">
        {/* Intestazione modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {initialItem ? 'Modifica articolo' : 'Nuovo articolo'}
            </h2>
            <p className="text-xs text-slate-500">
              {initialItem
                ? 'Aggiorna i parametri di consumo e riordino.'
                : 'Inserisci le specifiche del materiale aziendale.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo del modulo */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-4 text-xs">
          {/* Carica da modello master */}
          {!initialItem && masterOptions.length > 0 && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scegli da modello master</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenMasterManager}
                  className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Gestisci modelli
                </button>
              </div>
              <select
                onChange={(e) => handleSelectMaster(e.target.value)}
                defaultValue=""
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="" disabled>
                  -- Seleziona un modello frequente --
                </option>
                {masterOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.cycleValue}{' '}
                    {opt.cycleUnit === 'day'
                      ? 'gg'
                      : opt.cycleUnit === 'week'
                      ? 'sett.'
                      : opt.cycleUnit === 'month'
                      ? 'mesi'
                      : 'anni'}
                    )
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nome articolo */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nome articolo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Carta fotocopiatrici A4 (Pacco 5 risme)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ciclo di sostituzione */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ciclo di sostituzione <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="1"
                required
                value={cycleValue}
                onChange={(e) => setCycleValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              <select
                value={cycleUnit}
                onChange={(e) => setCycleUnit(e.target.value as CycleUnit)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
              >
                <option value="day">Giorni</option>
                <option value="week">Settimane</option>
                <option value="month">Mesi</option>
                <option value="year">Anni</option>
              </select>
            </div>
          </div>

          {/* Data ultimo rinnovo & Preavviso fornitore */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Data ultimo rinnovo <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={lastReplacedDate}
                onChange={(e) => setLastReplacedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Preavviso riordino (gg prima)
              </label>
              <input
                type="number"
                min="0"
                value={purchaseLeadDays}
                onChange={(e) => setPurchaseLeadDays(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                placeholder="5"
              />
            </div>
          </div>

          {/* Posizione & Responsabile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Posizione / Reparto
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="es. Ufficio 2° piano / Magazzino A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Responsabile
              </label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="es. Mario Rossi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Fornitore & Scorta minima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Fornitore / Distributore
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="es. Lyreco Italia / Würth"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Scorta minima consigliata
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="es. 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Codice articolo & Link riordino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Codice articolo / Rif.
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="es. TN-2420-BK"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                URL di riordino
              </label>
              <input
                type="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Note operative
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Istruzioni per l'ordine, avvertenze di sicurezza o dettagli fornitore..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Salva come master option */}
          {!initialItem && (
            <label className="flex items-center gap-2 pt-1 text-slate-600 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveAsMaster}
                onChange={(e) => setSaveAsMaster(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500/20"
              />
              <span>Salva anche come modello master riutilizzabile</span>
            </label>
          )}

          {/* Bottoni azione */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
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
              {initialItem ? 'Salva modifiche' : 'Aggiungi articolo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
