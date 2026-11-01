import { IndustryTemplate } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'template-office',
    name: 'Ufficio & Amministrazione',
    icon: '🏢',
    description: 'Cancelleria di base, carta per fotocopie, cartucce toner, olio per distruggidocumenti e filtri',
    items: [
      {
        name: 'Carta per fotocopiatrici A4 (Pacco 5 risme)',
        category: 'Cancelleria & Forniture per ufficio',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Archivio / Locale fotocopie',
        supplier: 'Fornitore ufficio',
        minStock: 2,
        modelNumber: 'A4-80G-5P',
        memo: 'Consumo standard per fatturazione, contratti e stampe amministrative.'
      },
      {
        name: 'Toner nero per stampante laser',
        category: 'Cancelleria & Forniture per ufficio',
        cycleValue: 2,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Mobile stampanti',
        supplier: 'Assistenza macchine per ufficio',
        minStock: 1,
        modelNumber: 'TN-BK-HIGH'
      },
      {
        name: 'Olio lubrificante per distruggidocumenti',
        category: 'Cancelleria & Forniture per ufficio',
        cycleValue: 3,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Accanto al distruggidocumenti',
        minStock: 1,
        memo: 'Applicare regolarmente per preservare i rulli di taglio.'
      },
      {
        name: 'Filtro di ricambio per erogatore d’acqua',
        category: 'Pulizia & Igiene',
        cycleValue: 6,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 7,
        location: 'Area relax / Coffee corner',
        supplier: 'Ditta manutenzione erogatori'
      },
      {
        name: 'Set pennarelli cancellabili per lavagna bianca',
        category: 'Cancelleria & Forniture per ufficio',
        cycleValue: 2,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 3,
        location: 'Sala riunioni A / B'
      }
    ]
  },
  {
    id: 'template-medical',
    name: 'Medicina & Studio medico / Farmacia',
    icon: '🏥',
    description: 'Guanti da esame, disinfettante ospedaliero, buste per autoclave, aghi, siringhe e mascherine',
    items: [
      {
        name: 'Guanti da esame in nitrile senza polvere (100 pz)',
        category: 'Forniture mediche & Studio / Farmacia',
        cycleValue: 2,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Armadio farmaci e presidi',
        supplier: 'Distributore medicale',
        minStock: 5,
        modelNumber: 'NITRILE-M-100'
      },
      {
        name: 'Soluzione disinfettante mani ad azione battericida (5L)',
        category: 'Pulizia & Igiene',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Tutti i dispenser dello studio',
        supplier: 'Fornitore presidi sanitari',
        minStock: 2
      },
      {
        name: 'Rotolo lenzuolini monouso per lettini medici',
        category: 'Forniture mediche & Studio / Farmacia',
        cycleValue: 3,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Saletta visite 1 e 2',
        minStock: 4
      },
      {
        name: 'Buste autosigillanti per sterilizzazione in autoclave',
        category: 'Forniture mediche & Studio / Farmacia',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 6,
        location: 'Locale sterilizzazione',
        minStock: 2,
        modelNumber: 'STERI-BAG-200'
      },
      {
        name: 'Mascherine chirurgiche a tre strati (50 pz)',
        category: 'Forniture mediche & Studio / Farmacia',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Accettazione / Sala d’aspetto',
        minStock: 3
      }
    ]
  },
  {
    id: 'template-restaurant',
    name: 'Ristorazione, Bar & Cucina',
    icon: '🍽️',
    description: 'Filtri macchina espresso, sgrassatori professionali, disinfettanti HACCP, filtri cappa e carta cucina',
    items: [
      {
        name: 'Cartuccia anticalcare macchina espresso professionale',
        category: 'Ristorazione, Bar & Cucina',
        cycleValue: 2,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 7,
        location: 'Sottobanco bar',
        supplier: 'Assistenza macchine da caffè',
        minStock: 1,
        modelNumber: 'PURITY-C300',
        memo: 'La mancata sostituzione provoca calcificazioni e altera l’aroma del caffè.'
      },
      {
        name: 'Detergente sgrassatore per piastre e friggitrici (5L)',
        category: 'Ristorazione, Bar & Cucina',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Deposito detersivi cucina',
        supplier: 'Grossista prodotti detergenti',
        minStock: 2
      },
      {
        name: 'Filtri sintetici per cappe d’aspirazione',
        category: 'Ristorazione, Bar & Cucina',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Cappa aspirante cucina centrale',
        minStock: 1
      },
      {
        name: 'Guanti monouso idonei al contatto alimentare (100 pz)',
        category: 'Ristorazione, Bar & Cucina',
        cycleValue: 2,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Postazione impiattamento',
        minStock: 4
      },
      {
        name: 'Disinfettante superfici conforme al piano HACCP',
        category: 'Pulizia & Igiene',
        cycleValue: 3,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 3,
        location: 'Lavaggio stoviglie & Piani lavoro',
        minStock: 3
      }
    ]
  },
  {
    id: 'template-salon',
    name: 'Parrucchiere & Centro estetico',
    icon: '💇',
    description: 'Mantelle monouso, guanti in lattice per tinture, disinfettante ferri, lame rasoio e asciugamani',
    items: [
      {
        name: 'Asciugamani monouso biodegradabili (100 pz)',
        category: 'Salone & Cosmetica',
        cycleValue: 2,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Zona lavateste',
        supplier: 'Fornitore tricologico',
        minStock: 2
      },
      {
        name: 'Guanti neri in nitrile per colorazioni (100 pz)',
        category: 'Salone & Cosmetica',
        cycleValue: 3,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Laboratorio colori',
        minStock: 3
      },
      {
        name: 'Soluzione disinfettante per forbici e pettini',
        category: 'Salone & Cosmetica',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Vasca di disinfezione banco lavoro',
        minStock: 1
      },
      {
        name: 'Lamette di ricambio per rasoio da barba (100 pz)',
        category: 'Salone & Cosmetica',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Postazione barba',
        minStock: 2
      },
      {
        name: 'Rotoli carta paranuca protettiva (5 pz)',
        category: 'Salone & Cosmetica',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 3,
        location: 'Tutte le postazioni di taglio',
        minStock: 2
      }
    ]
  },
  {
    id: 'template-workshop',
    name: 'Officina, Artigianato & Manutenzione',
    icon: '🏭',
    description: 'Panni tecnici, spray sgrassatore freni, dischi abrasivi, occhiali di protezione e grasso lubrificante',
    items: [
      {
        name: 'Spray sgrassatore rapido per freni e parti meccaniche',
        category: 'Officina, Manutenzione & Industria',
        cycleValue: 3,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Scaffale chimici officina',
        supplier: 'Fornitore ricambi auto / Ferramenta',
        minStock: 12
      },
      {
        name: 'Rotolo panni industriali in tessuto non tessuto',
        category: 'Officina, Manutenzione & Industria',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Colonnina distributore vicino al ponte sollevatore',
        minStock: 2
      },
      {
        name: 'Dischi da taglio sottili per smerigliatrice angolare (50 pz)',
        category: 'Officina, Manutenzione & Industria',
        cycleValue: 2,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 6,
        location: 'Armadio utensili da taglio',
        minStock: 1,
        modelNumber: 'CUT-115-1MM'
      },
      {
        name: 'Cartucce di grasso lubrificante multiuso EP2',
        category: 'Officina, Manutenzione & Industria',
        cycleValue: 2,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Ingrassatori manuali',
        minStock: 4
      },
      {
        name: 'Mascherine protettive antipolvere FFP2 (20 pz)',
        category: 'Officina, Manutenzione & Industria',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Zona verniciatura / smerigliatura',
        minStock: 2
      }
    ]
  },
  {
    id: 'template-hotel',
    name: 'Hotel & Strutture ricettive',
    icon: '🏨',
    description: 'Set cortesia, detergenti professionali pavimenti, ciabattine monouso, filtri HEPA e sacchi biancheria',
    items: [
      {
        name: 'Set cortesia bagno (Docciaschiuma, Shampoo, Sapone)',
        category: 'Hotel & Strutture ricettive',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 7,
        location: 'Magazzino governante ai piani',
        supplier: 'Fornitore forniture alberghiere',
        minStock: 2
      },
      {
        name: 'Pantofole monouso in spugna per ospiti (100 paia)',
        category: 'Hotel & Strutture ricettive',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 6,
        location: 'Armadio biancheria piano 1 e 2',
        minStock: 2
      },
      {
        name: 'Filtro purificatore aria per suite e reception',
        category: 'Pulizia & Igiene',
        cycleValue: 6,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 7,
        location: 'Apparecchiature trattamento aria'
      },
      {
        name: 'Detergente igienizzante professionale per sanitari (5L)',
        category: 'Pulizia & Igiene',
        cycleValue: 3,
        cycleUnit: 'week',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 4,
        location: 'Carrello pulizie piani',
        minStock: 2
      },
      {
        name: 'Sacchi idrosolubili per lavanderia e biancheria sporca',
        category: 'Hotel & Strutture ricettive',
        cycleValue: 1,
        cycleUnit: 'month',
        lastReplacedDate: getTodayString(),
        purchaseLeadDays: 5,
        location: 'Deposito lavanderia',
        minStock: 3
      }
    ]
  }
];
