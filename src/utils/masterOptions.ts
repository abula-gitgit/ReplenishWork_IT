import { MasterOption } from '../types/consumable';

export const DEFAULT_MASTER_OPTIONS: MasterOption[] = [
  {
    id: 'master-copier-paper',
    name: 'Carta per fotocopiatrici A4 (Pacco da 5 risme)',
    category: 'Cancelleria & Forniture per ufficio',
    cycleValue: 1,
    cycleUnit: 'month',
    purchaseLeadDays: 4,
    supplier: 'Fornitore forniture per ufficio',
    location: 'Archivio / Stanza fotocopiatrici',
    modelNumber: 'A4-500-5P'
  },
  {
    id: 'master-toner-black',
    name: 'Toner nero per stampante laser',
    category: 'Cancelleria & Forniture per ufficio',
    cycleValue: 2,
    cycleUnit: 'month',
    purchaseLeadDays: 5,
    supplier: 'Fornitore IT o noleggio stampanti',
    location: 'Stanza stampanti',
    modelNumber: 'TN-BLACK-HIGH'
  },
  {
    id: 'master-air-filter',
    name: 'Filtro purificatore d’aria HEPA',
    category: 'Pulizia & Igiene',
    cycleValue: 6,
    cycleUnit: 'month',
    purchaseLeadDays: 7,
    supplier: 'Negozio di elettronica / E-commerce',
    location: 'Ufficio principale / Sala riunioni',
    modelNumber: 'HEPA-FLT-200'
  },
  {
    id: 'master-hand-sanitizer',
    name: 'Ricarica disinfettante mani (Tanica 5L)',
    category: 'Pulizia & Igiene',
    cycleValue: 1,
    cycleUnit: 'month',
    purchaseLeadDays: 5,
    supplier: 'Grossista igiene e sanificazione',
    location: 'Ingresso / Bagni',
    modelNumber: 'SAN-5000ML'
  },
  {
    id: 'master-gloves-nitrile',
    name: 'Guanti monouso in nitrile (100 pz)',
    category: 'Forniture mediche & Studio / Farmacia',
    cycleValue: 3,
    cycleUnit: 'week',
    purchaseLeadDays: 6,
    supplier: 'Fornitore forniture mediche',
    location: 'Laboratorio / Sala visita',
    modelNumber: 'NIT-M-100'
  },
  {
    id: 'master-coffee-filter',
    name: 'Filtro anticalcare per macchina da caffè',
    category: 'Ristorazione, Bar & Cucina',
    cycleValue: 2,
    cycleUnit: 'month',
    purchaseLeadDays: 5,
    supplier: 'Torrefazione / Manutenzione macchine bar',
    location: 'Area break / Cucina bar',
    modelNumber: 'AQ-CLARIS-PRO'
  },
  {
    id: 'master-pos-rolls',
    name: 'Rotoli carta termica per cassa / POS (50 pz)',
    category: 'Cancelleria & Forniture per ufficio',
    cycleValue: 1,
    cycleUnit: 'month',
    purchaseLeadDays: 4,
    supplier: 'Fornitore sistemi di cassa',
    location: 'Banco cassa',
    modelNumber: 'TERM-57-50'
  },
  {
    id: 'master-industrial-wipes',
    name: 'Rotolo panni industriali assorbenti',
    category: 'Officina, Manutenzione & Industria',
    cycleValue: 1,
    cycleUnit: 'month',
    purchaseLeadDays: 5,
    supplier: 'Fornitore utensileria e ferramenta',
    location: 'Banco lavoro officina',
    modelNumber: 'WIPE-IND-BLUE'
  }
];

const MASTER_STORAGE_KEY = 'replenish_work_it_master_options_v1';

export function getMasterOptions(): MasterOption[] {
  try {
    const raw = localStorage.getItem(MASTER_STORAGE_KEY);
    if (!raw) return DEFAULT_MASTER_OPTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MASTER_OPTIONS;
  } catch (e) {
    console.error('Failed to load master options:', e);
    return DEFAULT_MASTER_OPTIONS;
  }
}

export function saveMasterOptions(options: MasterOption[]): void {
  try {
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(options));
  } catch (e) {
    console.error('Failed to save master options:', e);
  }
}
