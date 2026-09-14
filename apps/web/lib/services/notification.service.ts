export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'alert';
}

export class NotificationService {
  private static notifications: AppNotification[] = [
    {
      id: 'notif_01',
      title: 'Dossier Prepared',
      message: 'Your NBCFDC Micro Finance guidance dossier is ready for branch submission.',
      timestamp: '2026-03-10',
      type: 'success',
    },
  ];

  public static getNotifications(): AppNotification[] {
    return this.notifications;
  }
}
