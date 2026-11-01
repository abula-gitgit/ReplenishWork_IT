import { CalculatedItem } from '../types/consumable';

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function notifyUrgentItems(items: CalculatedItem[]): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const overdue = items.filter((i) => i.status === 'overdue');
  const today = items.filter((i) => i.status === 'today');
  const buySoon = items.filter((i) => i.status === 'buy_soon');

  const totalUrgent = overdue.length + today.length + buySoon.length;
  if (totalUrgent === 0) return;

  const lastNotifiedKey = 'replenish_work_it_last_notified_date';
  const todayStr = new Date().toISOString().split('T')[0];
  const lastNotified = localStorage.getItem(lastNotifiedKey);

  if (lastNotified === todayStr) {
    return;
  }

  let body = '';
  if (overdue.length > 0) {
    body += `${overdue.length} articolo/i scaduto/i. `;
  }
  if (today.length > 0) {
    body += `${today.length} da sostituire oggi. `;
  }
  if (buySoon.length > 0) {
    body += `${buySoon.length} da riordinare a breve.`;
  }

  try {
    const notification = new Notification('Replenish for Work - Avviso materiali', {
      body: body.trim(),
      icon: '/icon-192.png',
      badge: '/icon.svg',
      tag: 'replenish-work-urgent-alert'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    localStorage.setItem(lastNotifiedKey, todayStr);
  } catch (e) {
    console.error('Failed to trigger notification:', e);
  }
}

export async function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch (e) {
    console.warn('Service worker registration failed:', e);
  }
}
