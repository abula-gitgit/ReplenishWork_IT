export type CycleUnit = 'day' | 'week' | 'month' | 'year';

export type ItemStatus = 'normal' | 'buy_soon' | 'today' | 'overdue';

export type Category =
  | 'Cancelleria & Forniture per ufficio'
  | 'Forniture mediche & Studio / Farmacia'
  | 'Ristorazione, Bar & Cucina'
  | 'Salone & Cosmetica'
  | 'Officina, Manutenzione & Industria'
  | 'Hotel & Strutture ricettive'
  | 'Pulizia & Igiene'
  | 'Altro'
  | string;

export interface ReplacementRecord {
  id: string;
  replacedDate: string; // YYYY-MM-DD
  recordedAt: string; // ISO String
  previousReplacedDate?: string;
  memo?: string;
  cost?: number;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: Category;
  cycleValue: number;
  cycleUnit: CycleUnit;
  lastReplacedDate: string; // YYYY-MM-DD
  purchaseLeadDays: number; // Giorni di preavviso per riordino (es. 5 giorni prima)
  location?: string; // Reparto, stanza, piano, scaffale
  manager?: string; // Responsabile
  supplier?: string; // Fornitore o distributore
  minStock?: number; // Livello di scorta minima consigliata
  modelNumber?: string; // Codice prodotto, modello o codice articolo
  purchaseUrl?: string; // Link di riordino o scheda fornitore
  memo?: string;
  history?: ReplacementRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculatedItem extends ConsumableItem {
  nextReplacementDate: string; // YYYY-MM-DD
  daysRemaining: number; // Giorni rimanenti (negativo se scaduto)
  status: ItemStatus;
  progressPercent: number; // Percentuale di consumo 0-100%
  purchaseAlertDate: string; // Data di avviso riordino (YYYY-MM-DD)
  isPurchaseTime: boolean; // Flag se è arrivato il momento di riordinare
}

export interface MasterOption {
  id: string;
  name: string;
  category: Category;
  cycleValue: number;
  cycleUnit: CycleUnit;
  purchaseLeadDays: number;
  supplier?: string;
  location?: string;
  modelNumber?: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: Omit<ConsumableItem, 'id' | 'createdAt' | 'updatedAt' | 'history'>[];
}

export type ViewMode = 'list' | 'calendar' | 'history' | 'guide' | 'about' | 'privacy' | 'terms' | 'contact';
