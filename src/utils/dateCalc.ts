import { ConsumableItem, CalculatedItem, ItemStatus, CycleUnit } from '../types/consumable';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatItalianDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function addCycle(startDateStr: string, value: number, unit: CycleUnit): string {
  const date = parseDate(startDateStr);
  const result = new Date(date);

  switch (unit) {
    case 'day':
      result.setDate(result.getDate() + value);
      break;
    case 'week':
      result.setDate(result.getDate() + value * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + value);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() + value);
      break;
  }

  return formatDate(result);
}

export function subtractDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

export function diffDays(targetDateStr: string, fromDateStr: string): number {
  const target = parseDate(targetDateStr);
  const from = parseDate(fromDateStr);
  const diffTime = target.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateItem(item: ConsumableItem, todayStr: string = getTodayString()): CalculatedItem {
  const nextReplacementDate = addCycle(item.lastReplacedDate, item.cycleValue, item.cycleUnit);
  const daysRemaining = diffDays(nextReplacementDate, todayStr);
  const totalCycleDays = Math.max(1, diffDays(nextReplacementDate, item.lastReplacedDate));
  const elapsedDays = diffDays(todayStr, item.lastReplacedDate);

  let progressPercent = Math.round((elapsedDays / totalCycleDays) * 100);
  if (progressPercent < 0) progressPercent = 0;
  if (progressPercent > 100) progressPercent = 100;

  const leadDays = item.purchaseLeadDays !== undefined ? item.purchaseLeadDays : 5;
  const purchaseAlertDate = subtractDays(nextReplacementDate, leadDays);
  const isPurchaseTime = diffDays(todayStr, purchaseAlertDate) >= 0;

  let status: ItemStatus = 'normal';
  if (daysRemaining < 0) {
    status = 'overdue';
  } else if (daysRemaining === 0) {
    status = 'today';
  } else if (isPurchaseTime || daysRemaining <= 3) {
    status = 'buy_soon';
  }

  return {
    ...item,
    nextReplacementDate,
    daysRemaining,
    status,
    progressPercent,
    purchaseAlertDate,
    isPurchaseTime
  };
}

export function sortCalculatedItems(items: CalculatedItem[]): CalculatedItem[] {
  const priorityOrder: Record<ItemStatus, number> = {
    overdue: 0,
    today: 1,
    buy_soon: 2,
    normal: 3
  };

  return [...items].sort((a, b) => {
    const priorityDiff = priorityOrder[a.status] - priorityOrder[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    return a.daysRemaining - b.daysRemaining;
  });
}

export function getCalendarGrid(year: number, month: number): { date: string; isCurrentMonth: boolean }[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // In Italia la settimana inizia di lunedì (0 = lunedì, ..., 6 = domenica)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const grid: { date: string; isCurrentMonth: boolean }[] = [];

  // Mese precedente
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    grid.push({
      date: formatDate(prevDate),
      isCurrentMonth: false
    });
  }

  // Mese corrente
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    grid.push({
      date: formatDate(currDate),
      isCurrentMonth: true
    });
  }

  // Mese successivo
  const remainingCells = 42 - grid.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextDate = new Date(year, month + 1, n);
    grid.push({
      date: formatDate(nextDate),
      isCurrentMonth: false
    });
  }

  return grid;
}
