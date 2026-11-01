import React from 'react';
import { X, Bell, BellRing, AlertTriangle, Smartphone, CheckCircle } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { requestNotificationPermission } from '../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentItems: CalculatedItem[];
  onPermissionChange: (perm: NotificationPermission | 'unsupported') => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  urgentItems,
  onPermissionChange,
  onShowToast
}) => {
  if (!isOpen) return null;

  const currentPermission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    onPermissionChange(res);
    if (res === 'granted') {
      onShowToast('Notifiche attivate con successo!', 'success');
      new Notification('Replenish for Work', {
        body: 'Le notifiche push del browser sono ora attive per questo dispositivo.',
        icon: '/icon-192.png'
      });
    } else if (res === 'denied') {
      onShowToast('Notifiche bloccate nelle impostazioni del browser.', 'error');
    }
  };

  const handleSendTest = () => {
    if (currentPermission !== 'granted') {
      alert('È necessario autorizzare le notifiche prima di poter inviare un test.');
      return;
    }
    new Notification('Replenish for Work - Test avviso', {
      body: `Hai ${urgentItems.length} articoli con rinnovo urgente o da riordinare.`,
      icon: '/icon-192.png'
    });
    onShowToast('Notifica di prova inviata!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Notifiche & Avvisi
              </h2>
              <p className="text-xs text-slate-500">
                Ricevi promemoria tempestivi per ordini e scadenze.
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
          {/* Stato autorizzazione */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700">Stato autorizzazione browser:</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  currentPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentPermission === 'denied'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentPermission === 'granted'
                  ? 'Attive'
                  : currentPermission === 'denied'
                  ? 'Bloccate'
                  : 'Non richieste'}
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed mb-3">
              Abilitando le notifiche, il browser ti ricorderà quando un articolo entra nella finestra di riordino fornitore o quando scade oggi.
            </p>

            {currentPermission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>Attiva notifiche</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendTest}
                className="w-full py-2 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Invia notifica di test</span>
              </button>
            )}
          </div>

          {/* Consigli PWA */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
            <h3 className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Installa su Smartphone / Tablet (PWA)</span>
            </h3>
            <p className="text-blue-900/80 leading-relaxed">
              Tocca il menu del browser (ad es. Safari o Chrome) e seleziona <strong>«Aggiungi alla schermata Home»</strong> per usare Replenish for Work a schermo intero come una vera applicazione, anche in assenza di connessione.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-4 flex justify-end">
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
