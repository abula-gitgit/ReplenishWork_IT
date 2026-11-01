import React, { useState } from 'react';
import { X, Settings2, Trash2, Plus, Edit2, Check, Tag } from 'lucide-react';
import { MasterOption, CycleUnit, Category, ConsumableItem } from '../types/consumable';

interface MasterOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: MasterOption[];
  onUpdateOptions: (options: MasterOption[]) => void;
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
  items: ConsumableItem[];
  onUpdateItems: (items: ConsumableItem[]) => void;
}

export const MasterOptionModal: React.FC<MasterOptionModalProps> = ({
  isOpen,
  onClose,
  options,
  onUpdateOptions,
  categories,
  onUpdateCategories,
  items,
  onUpdateItems
}) => {
  const [activeTab, setActiveTab] = useState<'masters' | 'categories'>('masters');

  // Stato nuovo modello master
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('');
  const [cycleValue, setCycleValue] = useState<number>(1);
  const [cycleUnit, setCycleUnit] = useState<CycleUnit>('month');
  const [purchaseLeadDays, setPurchaseLeadDays] = useState<number>(5);
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Stato nuova categoria
  const [newCatName, setNewCatName] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState('');

  if (!isOpen) return null;

  const handleSaveMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = options.map((opt) =>
        opt.id === editingId
          ? {
              ...opt,
              name: name.trim(),
              category: category || categories[0] || 'Cancelleria & Forniture per ufficio',
              cycleValue,
              cycleUnit,
              purchaseLeadDays,
              supplier: supplier.trim() || undefined,
              location: location.trim() || undefined,
              modelNumber: modelNumber.trim() || undefined
            }
          : opt
      );
      onUpdateOptions(updated);
      setEditingId(null);
    } else {
      const newOpt: MasterOption = {
        id: `master-${Date.now()}`,
        name: name.trim(),
        category: category || categories[0] || 'Cancelleria & Forniture per ufficio',
        cycleValue,
        cycleUnit,
        purchaseLeadDays,
        supplier: supplier.trim() || undefined,
        location: location.trim() || undefined,
        modelNumber: modelNumber.trim() || undefined
      };
      onUpdateOptions([...options, newOpt]);
    }

    // Reset modulo
    setName('');
    setSupplier('');
    setLocation('');
    setModelNumber('');
  };

  const handleEditMaster = (opt: MasterOption) => {
    setEditingId(opt.id);
    setName(opt.name);
    setCategory(opt.category);
    setCycleValue(opt.cycleValue);
    setCycleUnit(opt.cycleUnit);
    setPurchaseLeadDays(opt.purchaseLeadDays);
    setSupplier(opt.supplier || '');
    setLocation(opt.location || '');
    setModelNumber(opt.modelNumber || '');
  };

  const handleDeleteMaster = (id: string) => {
    if (window.confirm('Eliminare questo modello master?')) {
      onUpdateOptions(options.filter((o) => o.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onUpdateCategories([...categories, trimmed]);
    setNewCatName('');
  };

  const handleSaveEditCategory = (index: number) => {
    const oldName = categories[index];
    const newName = editingCatValue.trim();
    if (!newName || newName === oldName) {
      setEditingCatIndex(null);
      return;
    }

    const updatedCats = [...categories];
    updatedCats[index] = newName;
    onUpdateCategories(updatedCats);

    // Aggiorna gli articoli associati
    const updatedItems = items.map((it) =>
      it.category === oldName ? { ...it, category: newName } : it
    );
    onUpdateItems(updatedItems);

    setEditingCatIndex(null);
  };

  const handleDeleteCategory = (index: number) => {
    const catToDelete = categories[index];
    if (categories.length <= 1) {
      alert('È necessario mantenere almeno una categoria.');
      return;
    }
    if (window.confirm(`Eliminare la categoria «${catToDelete}»? Gli articoli associati passeranno alla categoria predefinita.`)) {
      const updatedCats = categories.filter((_, i) => i !== index);
      const fallback = updatedCats[0];
      const updatedItems = items.map((it) =>
        it.category === catToDelete ? { ...it, category: fallback } : it
      );
      onUpdateCategories(updatedCats);
      onUpdateItems(updatedItems);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-5 sm:p-6 relative max-h-[90vh] flex flex-col my-auto">
        {/* Intestazione */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Impostazioni master & Categorie
              </h2>
              <p className="text-xs text-slate-500">
                Gestisci le preimpostazioni per la compilazione rapida e le categorie.
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 mt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('masters')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'masters'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Modelli master ({options.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Categorie ({categories.length})
          </button>
        </div>

        {/* Contenuto Tab Masters */}
        {activeTab === 'masters' && (
          <div className="overflow-y-auto py-3 flex-1 text-xs space-y-4">
            {/* Form aggiungi / modifica master */}
            <form onSubmit={handleSaveMaster} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-800 block text-xs">
                {editingId ? 'Modifica modello master' : 'Crea nuovo modello master'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nome modello (es. Toner nero)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <select
                  value={category || categories[0]}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Ciclo"
                  value={cycleValue}
                  onChange={(e) => setCycleValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <select
                  value={cycleUnit}
                  onChange={(e) => setCycleUnit(e.target.value as CycleUnit)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="day">Giorni</option>
                  <option value="week">Settimane</option>
                  <option value="month">Mesi</option>
                  <option value="year">Anni</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Preavviso (gg)"
                  value={purchaseLeadDays}
                  onChange={(e) => setPurchaseLeadDays(Math.max(0, parseInt(e.target.value) || 0))}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                    }}
                    className="px-3 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                  >
                    Annulla
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Aggiorna' : 'Aggiungi'}</span>
                </button>
              </div>
            </form>

            {/* Elenco modelli master */}
            <div className="space-y-1.5">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{opt.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {opt.category} • Ciclo: {opt.cycleValue} {opt.cycleUnit} • Consegna: {opt.purchaseLeadDays} gg
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditMaster(opt)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMaster(opt.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenuto Tab Categorie */}
        {activeTab === 'categories' && (
          <div className="overflow-y-auto py-3 flex-1 text-xs space-y-4">
            {/* Aggiungi categoria */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Nuova categoria (es. Imballaggi & Spedizioni)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aggiungi</span>
              </button>
            </form>

            {/* Elenco categorie */}
            <div className="space-y-1.5">
              {categories.map((cat, idx) => (
                <div
                  key={cat}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  {editingCatIndex === idx ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingCatValue}
                        onChange={(e) => setEditingCatValue(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(idx)}
                        className="p-1 bg-blue-600 text-white rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800">{cat}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatIndex(idx);
                            setEditingCatValue(cat);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
