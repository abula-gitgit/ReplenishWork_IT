import React from 'react';
import { ArrowLeft, Shield, FileText, Info, Mail } from 'lucide-react';

export type InfoTab = 'about' | 'privacy' | 'terms' | 'contact';

interface InfoPagesViewProps {
  initialTab?: InfoTab;
  onNavigateToList: () => void;
  onTabChange?: (tab: InfoTab) => void;
}

export const InfoPagesView: React.FC<InfoPagesViewProps> = ({
  initialTab = 'about',
  onNavigateToList,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = React.useState<InfoTab>(initialTab);

  const handleTabClick = (tab: InfoTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intestazione */}
      <div className="flex items-center gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={onNavigateToList}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          title="Torna all'inventario"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Informazioni & Aspetti legali
          </h2>
          <p className="text-xs text-slate-500">
            Dettagli sull'applicazione, tutela della privacy e condizioni d'uso.
          </p>
        </div>
      </div>

      {/* Selettore Tab */}
      <div className="flex flex-wrap gap-2 bg-slate-200/60 p-1.5 rounded-2xl text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => handleTabClick('about')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'about' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Chi siamo</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('privacy')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'privacy' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('terms')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'terms' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Termini d'uso</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('contact')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'contact' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contatti</span>
        </button>
      </div>

      {/* Contenuto Tab */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Cos'è Replenish for Work?
            </h3>
            <p>
              <strong>Replenish for Work</strong> è un'applicazione web gratuita progettata specificamente per uffici, cliniche mediche, studi professionali, ristoranti, saloni e officine, con lo scopo di semplificare e automatizzare il monitoraggio dei materiali di consumo e la manutenzione periodica.
            </p>
            <p>
              A differenza delle complesse soluzioni ERP aziendali, Replenish for Work non richiede registrazioni di account, abbonamenti né infrastrutture server dedicate: tutti i dati risiedono esclusivamente nel browser del dispositivo tramite <strong>IndexedDB</strong>, garantendo la massima riservatezza aziendale.
            </p>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-950 space-y-1">
              <span className="font-bold block">Punti di forza dell'architettura:</span>
              <ul className="list-disc pl-5 space-y-0.5 text-xs text-blue-900">
                <li>Nessun invio di dati aziendali a server terzi (Zero-Knowledge)</li>
                <li>Supporto completo per funzionamento offline e installazione PWA</li>
                <li>Gestione avanzata dei tempi di consegna fornitori per evitare rotture di stock</li>
                <li>Funzione di backup e ripristino istantaneo in formato aperto JSON</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Informativa sulla Privacy (100% Locale)
            </h3>
            <p>
              La protezione dei tuoi dati è il principio fondante del nostro design. L'applicazione non registra né trasmette a server remoti i nomi dei materiali, i fornitori, i prezzi, le ubicazioni di magazzino o le date registrate.
            </p>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1. Conservazione sul dispositivo</h4>
              <p className="text-slate-600">
                Tutti i dati inseriti dall'utente sono memorizzati unicamente sul dispositivo in uso (IndexedDB e LocalStorage). Cancellando la cache o i dati del browser, tali dati andranno persi se non precedentemente esportati tramite la funzione di Backup JSON.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">2. Annunci pubblicitari e cookie</h4>
              <p className="text-slate-600">
                Il sito può includere banner pubblicitari di terze parti (come Google AdSense) per sostenere i costi di sviluppo. Questi servizi possono avvalersi di cookie tecnici o di profilazione conformi alla normativa europea GDPR. È possibile disattivare la personalizzazione degli annunci dalle impostazioni del browser o tramite i controlli Google.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">3. Statistiche d'accesso</h4>
              <p className="text-slate-600">
                Per monitorare le prestazioni del server CDN e la stabilità del servizio, possono essere raccolte statistiche aggregate e totalmente anonimizzate (ad es. Cloudflare Web Analytics), prive di qualsiasi dato identificativo.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Termini d'uso & Esclusione di responsabilità
            </h3>
            <p>
              L'applicazione è offerta a titolo completamente gratuito nello stato di fatto in cui si trova ("as is"). L'utente accetta di utilizzarla sotto la propria esclusiva responsabilità.
            </p>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1. Finalità dello strumento</h4>
              <p className="text-slate-600">
                Replenish for Work costituisce un ausilio organizzativo e di promemoria. L'utente rimane pienamente responsabile del controllo reale delle scorte, della conformità igienico-sanitaria dei locali e dell'effettuazione degli ordini.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">2. Limitazione di responsabilità</h4>
              <p className="text-slate-600">
                Gli sviluppatori non potranno in nessun caso essere ritenuti responsabili per eventuali danni diretti o indiretti, fermi operativi, mancate consegne di materiali o perdite di dati derivanti dall'utilizzo o dall'impossibilità di utilizzo dell'applicazione.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Contatti & Assistenza
            </h3>
            <p>
              Hai suggerimenti per nuove funzionalità, hai riscontrato un'anomalia o desideri proporre modelli di settore specifici? Contattaci liberamente:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-1">Indirizzo email di supporto:</span>
              <a
                href="mailto:stoooone.studio@gmail.com"
                className="font-bold text-blue-600 hover:underline text-sm font-mono"
              >
                stoooone.studio@gmail.com
              </a>
            </div>
            <p className="text-slate-500 text-xs">
              Rispondiamo con piacere a qualsiasi segnalazione per rendere Replenish for Work uno strumento sempre più utile per i professionisti di tutto il mondo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
