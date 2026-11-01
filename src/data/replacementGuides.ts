import { ConsumableItem } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

export interface ReplacementGuideItem {
  id: string;
  title: string;
  category: 'office' | 'it' | 'sanitary' | 'hvac' | 'safety' | 'facility' | 'maintenance';
  categoryLabel: string;
  cycleDays: number;
  cycleDisplay: string;
  hygieneReason: string;
  dangerOfNeglect: string;
  signsOfDegradation: string[];
  scientificNote?: string;
  proTips: string;
  urgencyLevel: 'high' | 'medium' | 'standard';
  badgeLabel?: string;
}

export const REPLACEMENT_GUIDES: ReplacementGuideItem[] = [
  {
    id: 'shredder-oil',
    title: 'Olio lubrificante per distruggidocumenti',
    category: 'office',
    categoryLabel: 'Ufficio & Cancelleria',
    cycleDays: 14,
    cycleDisplay: 'Ogni 2 settimane (o ogni 2 svuotamenti)',
    hygieneReason:
      'I gruppi di taglio a frammento accumulano micro-polvere di carta. Senza lubrificazione costante l’attrito aumenta, il motore si surriscalda e le lame si usurano precocemente.',
    dangerOfNeglect:
      'Inceppamenti ripetuti, rumorosità eccessiva, blocco del motore e decadimento della garanzia del produttore.',
    signsOfDegradation: [
      'Rumori metallici o stridenti durante il taglio',
      'Velocità di trascinamento visibilmente ridotta',
      'Accumuli biancastri di polvere compressa tra i rulli',
      'Frammenti tagliati in modo irregolare o strappati'
    ],
    scientificNote:
      'I test di laboratorio confermano che una lubrificazione regolare prolunga la durata dei gruppi di taglio fino al 150% e riduce i picchi di assorbimento elettrico del 18%.',
    proTips:
      'Tieni una confezione di fogli oliati direttamente sopra il distruggidocumenti: l’applicazione richiede meno di 10 secondi.',
    urgencyLevel: 'high',
    badgeLabel: 'Protezione apparecchi'
  },
  {
    id: 'water-filter',
    title: 'Filtro anticalcare per macchina da caffè espresso',
    category: 'sanitary',
    categoryLabel: 'Bar, Cucina & Pause',
    cycleDays: 60,
    cycleDisplay: 'Ogni 6-8 settimane (o ca. 150 litri)',
    hygieneReason:
      'Calcare e micro-impurità ostruiscono i condotti e le elettrovalvole. Una cartuccia filtrante efficiente preserva la caldaia e garantisce la migliore estrazione del caffè.',
    dangerOfNeglect:
      'Incrostazioni negli scambiatori termici, guasti improvvisi durante l’orario lavorativo e costosi interventi tecnici.',
    signsOfDegradation: [
      'Il caffè ha un gusto acido o poco corposo',
      'Il flusso di erogazione rallenta o esce a scatti',
      'La spia di decalcificazione della macchina si accende'
    ],
    scientificNote:
      'I granuli di carbone attivo e le resine a scambio ionico riducono il cloro e la durezza carbonatica, prevenendo anche cariche batteriche nell’acqua del serbatoio.',
    proTips:
      'In presenza di acqua particolarmente dura (superiore a 25 °fH), anticipare la sostituzione a un massimo di 5 settimane.',
    urgencyLevel: 'medium',
    badgeLabel: 'Protezione calcare'
  },
  {
    id: 'air-filter',
    title: 'Filtri HEPA per purificatori d’aria e fancoil',
    category: 'hvac',
    categoryLabel: 'Climatizzazione & Trattamento aria',
    cycleDays: 180,
    cycleDisplay: 'Ogni 6 mesi (semestrale)',
    hygieneReason:
      'I purificatori catturano pollini, allergeni, polveri sottili PM2.5 e virus. Quando il filtro è saturo, aumenta la resistenza pneumatica e cala la portata d’aria pulita.',
    dangerOfNeglect:
      'Odori sgradevoli nell’ambiente, sovraccarico del motore di ventilazione e peggioramento della qualità dell’aria negli uffici condivisi.',
    signsOfDegradation: [
      'Strato grigio evidente sul pre-filtro',
      'Aumento del rumore di ventilazione a parità di portata',
      'Indicatore di sostituzione filtro attivo sull’apparecchio'
    ],
    scientificNote:
      'I filtri HEPA H14 trattengono il 99,995% delle particelle fino a 0,1 micron, garantendo la conformità agli standard di salubrità nei luoghi di lavoro (D.Lgs. 81/08).',
    proTips:
      'Aspirare delicatamente la polvere dal pre-filtro ogni mese per preservare la durata della cartuccia HEPA interna.',
    urgencyLevel: 'high',
    badgeLabel: 'Qualità dell’aria'
  },
  {
    id: 'first-aid',
    title: 'Cassetta pronto soccorso aziendale (D.Lgs. 81/08)',
    category: 'safety',
    categoryLabel: 'Sicurezza & Pronto soccorso',
    cycleDays: 180,
    cycleDisplay: 'Verifica semestrale scadenze & reintegro',
    hygieneReason:
      'Garze sterili, disinfettanti e teli hanno una data di scadenza definita. Gli adesivi dei cerotti invecchiati perdono tenuta e non garantiscono aderenza nell’emergenza.',
    dangerOfNeglect:
      'Mancanza di materiale essenziale in caso di infortunio e sanzioni durante le ispezioni dell’organo di vigilanza (ASL / Ispettorato del Lavoro).',
    signsOfDegradation: [
      'Sigillo di integrità della cassetta rotto o assente',
      'Cerotti, guanti o flaconi usati e non reintegrati',
      'Scadenza di flaconi disinfettanti o bende sterili superata'
    ],
    scientificNote:
      'I materiali elastici e i guanti monouso in lattice o vinile tendono a degradarsi dopo 2-3 anni a causa delle variazioni termiche ambientali.',
    proTips:
      'Compilare il registro delle ispezioni periodiche inserito nella valigetta con data e firma del responsabile del servizio.',
    urgencyLevel: 'medium',
    badgeLabel: 'Conformità D.Lgs. 81'
  }
];

export function mapGuideToPreset(guide: ReplacementGuideItem): ConsumableItem {
  const catMap: Record<string, string> = {
    office: 'Cancelleria & Forniture per ufficio',
    it: 'Cancelleria & Forniture per ufficio',
    sanitary: 'Ristorazione, Bar & Cucina',
    hvac: 'Pulizia & Igiene',
    safety: 'Forniture mediche & Studio / Farmacia',
    facility: 'Officina, Manutenzione & Industria',
    maintenance: 'Officina, Manutenzione & Industria'
  };

  return {
    id: `guide-item-it-${Date.now()}`,
    name: guide.title,
    category: catMap[guide.category] || 'Cancelleria & Forniture per ufficio',
    cycleValue: guide.cycleDays >= 30 ? Math.round(guide.cycleDays / 30) : guide.cycleDays,
    cycleUnit: guide.cycleDays >= 30 ? 'month' : 'day',
    lastReplacedDate: getTodayString(),
    purchaseLeadDays: 5,
    memo: guide.proTips,
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
