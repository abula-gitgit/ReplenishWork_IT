import { ConsumableItem } from '../types/consumable';
import { getTodayString, subtractDays } from './dateCalc';

export function getSampleItems(): ConsumableItem[] {
  const today = getTodayString();

  return [
    {
      id: 'sample-it-1',
      name: 'Carta per fotocopiatrici A4 (Pacco da 5 risme)',
      category: 'Cancelleria & Forniture per ufficio',
      cycleValue: 1,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 28), // Vicino alla scadenza
      purchaseLeadDays: 4,
      location: 'Archivio / Stanza copie',
      manager: 'Marco Rossi',
      supplier: 'Lyreco Italia',
      minStock: 2,
      modelNumber: 'CP-A4-80G',
      purchaseUrl: 'https://example.com/a4-paper',
      memo: 'Utilizzare solo carta certificata FSC per le comunicazioni esterne.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: 'hist-1',
          replacedDate: subtractDays(today, 58),
          recordedAt: new Date(Date.now() - 58 * 86400000).toISOString(),
          memo: 'Rifornimento mensile'
        }
      ]
    },
    {
      id: 'sample-it-2',
      name: 'Toner nero per stampante laser centrale',
      category: 'Cancelleria & Forniture per ufficio',
      cycleValue: 45,
      cycleUnit: 'day',
      lastReplacedDate: subtractDays(today, 46), // Scaduto (overdue)
      purchaseLeadDays: 5,
      location: 'Stanza stampanti 2° piano',
      manager: 'Laura Bianchi',
      supplier: 'Centro Assistenza Stampanti Srl',
      minStock: 1,
      modelNumber: 'TN-3480-BK',
      memo: 'Ordinare prima che compaia il messaggio di fine toner sul display.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-it-3',
      name: 'Filtro anticalcare macchina espresso professionale',
      category: 'Ristorazione, Bar & Cucina',
      cycleValue: 2,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 55), // In finestra di riordino
      purchaseLeadDays: 7,
      location: 'Banco bar principale',
      manager: 'Matteo Ferrari',
      supplier: 'Caffè Illy / Fornitore Macchine Bar',
      minStock: 1,
      modelNumber: 'BRITA-PURITY-C300',
      memo: 'La rigenerazione del filtro previene danni alla caldaia e garantisce la qualità della crema.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-it-4',
      name: 'Guanti da esame in nitrile senza polvere (100 pz)',
      category: 'Forniture mediche & Studio / Farmacia',
      cycleValue: 3,
      cycleUnit: 'week',
      lastReplacedDate: subtractDays(today, 10),
      purchaseLeadDays: 5,
      location: 'Ambulatorio 1 / Armadietto materiali',
      manager: 'Dott.ssa Moretti',
      supplier: 'Farmadati / Distributore Medicale',
      minStock: 3,
      modelNumber: 'SENSINIL-M',
      memo: 'Dispositivo Medico di Classe I. Verificare periodicamente le scorte in magazzino.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-it-5',
      name: 'Rotolo panni industriali assorbenti per officina',
      category: 'Officina, Manutenzione & Industria',
      cycleValue: 1,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 12),
      purchaseLeadDays: 4,
      location: 'Banco lavoro 3 - Meccanica',
      manager: 'Giovanni Conti',
      supplier: 'Würth Italia',
      minStock: 2,
      modelNumber: 'WURTH-TEX-500',
      memo: 'Panni resistenti a solventi, benzina e oli idraulici.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-it-6',
      name: 'Set cortesia docciaschiuma e shampoo bio (500 flaconi)',
      category: 'Hotel & Strutture ricettive',
      cycleValue: 1,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 24),
      purchaseLeadDays: 6,
      location: 'Magazzino biancheria piano terra',
      manager: 'Elena Esposito',
      supplier: 'Allegrini Amenities',
      minStock: 1,
      modelNumber: 'BIO-AMENITY-30ML',
      memo: 'Linea ecologica certificata Ecolabel per tutte le camere standard e suite.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
