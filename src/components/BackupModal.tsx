import React, { useRef } from 'react';
import { X, Download, Upload, AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';
import { ConsumableItem, MasterOption } from '../types/consumable';
import { exportBackupJSON, parseImportJSON } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConsumableItem[];
  masterOptions: MasterOption[];
  categories: string[];
  onImportItems: (items: ConsumableItem[]) => void;
  onImportMasterOptions?: (opts: MasterOption[]) => void;
  onImportCategories?: (cats: string[]) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  items,
  masterOptions,
  categories,
  onImportItems,
  onImportMasterOptions,
  onImportCategories,
  onResetToSample,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportBackupJSON(items, masterOptions, categories);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `replenish_work_it_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseImportJSON(content);
      if (parsed) {
        if (window.confirm(`Importare ${parsed.items.length} articoli da questo file di backup? I dati attuali verranno sostituiti.`)) {
          onImportItems(parsed.items);
          if (parsed.categories && onImportCategories) {
            onImportCategories(parsed.categories);
          }
          if (parsed.masterOptions && onImportMasterOptions) {
            onImportMasterOptions(parsed.masterOptions);
          }
          onClose();
        }
      } else {
        alert('File di backup non valido o danneggiato.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Intestazione */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Backup & Ripristino dati
              </h2>
              <p className="text-xs text-slate-500">
                Tutti i dati rimangono salvati sul dispositivo locale (100% riservato).
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

        <div className="space-y-4 text-xs">
          {/* Esporta */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Esporta backup (JSON)</span>
            </h3>
            <p className="text-slate-500 mb-3 leading-relaxed">
              Scarica una copia dei tuoi {items.length} articoli, delle categorie personalizzate e dei modelli master sul tuo computer.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Salva file di backup</span>
            </button>
          </div>

          {/* Importa */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Importa file di backup</span>
            </h3>
            <p className="text-slate-500 mb-3 leading-relaxed">
              Ripristina il tuo inventario da un file JSON salvato in precedenza.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Seleziona file JSON</span>
            </button>
          </div>

          {/* Opzioni di ripristino avanzate */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <h3 className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Dati dimostrativi & Reset</span>
            </h3>
            <p className="text-amber-900/80 mb-3 leading-relaxed">
              Puoi caricare gli articoli di esempio per testare l'app oppure eliminare tutti i dati registrati.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Caricare i dati dimostrativi di esempio? I dati attuali verranno sostituiti.')) {
                    onResetToSample();
                    onClose();
                  }
                }}
                className="flex-1 py-2 px-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Carica esempi demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Attenzione: eliminare definitivamente tutti gli articoli e la cronologia registrata?')) {
                    onClearAll();
                    onClose();
                  }
                }}
                className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reset totale</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
