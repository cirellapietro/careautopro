'use client';
import { redirect } from 'next/navigation';

/**
 * Reindirizzamento alla rotta corretta della dashboard.
 * Il vecchio file utilizzava Realtime DB, mentre l'app usa Firestore.
 */
export default function LegacyNotificationsPage() {
  redirect('/dashboard/notifications');
}
