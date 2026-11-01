import { ConsumableItem } from '../types/consumable';
import { getSampleItems } from './sampleData';

const STORAGE_KEY_ITEMS = 'replenish_work_it_items_v1';
const STORAGE_KEY_CATEGORIES = 'replenish_work_it_categories_v1';

export const DEFAULT_CATEGORIES: string[] = [
  'Cancelleria & Forniture per ufficio',
  'Forniture mediche & Studio / Farmacia',
  'Ristorazione, Bar & Cucina',
  'Salone & Cosmetica',
  'Officina, Manutenzione & Industria',
  'Hotel & Strutture ricettive',
  'Pulizia & Igiene',
  'Altro'
];

export function loadStoredItems(): ConsumableItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      const sample = getSampleItems();
      saveStoredItems(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load items from storage:', e);
    return [];
  }
}

export function saveStoredItems(items: ConsumableItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function loadStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      saveStoredCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to load categories:', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
}

export function exportBackupJSON(items: ConsumableItem[], masterOptions?: any[], categories?: string[]): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    language: 'it',
    categories: categories || loadStoredCategories(),
    masterOptions: masterOptions || [],
    items
  };
  return JSON.stringify(data, null, 2);
}

export function parseImportJSON(jsonStr: string): {
  items: ConsumableItem[];
  categories?: string[];
  masterOptions?: any[];
} | null {
  try {
    const data = JSON.parse(jsonStr);
    if (Array.isArray(data)) {
      return { items: data };
    }
    if (data && Array.isArray(data.items)) {
      return {
        items: data.items,
        categories: data.categories,
        masterOptions: data.masterOptions
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to parse backup JSON:', e);
    return null;
  }
}
