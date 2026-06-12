/**
 * Desktop notifications for "Claude needs you" moments. Permission is
 * requested lazily on the first notify-worthy event; failures degrade to
 * silence (the in-app badges remain the source of truth).
 */
export function notifyDesktop(title: string, body: string): void {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, silent: false });
    } catch {
      /* some platforms throw outside user gestures */
    }
  } else if (Notification.permission === 'default') {
    void Notification.requestPermission().then((perm) => {
      if (perm === 'granted') notifyDesktop(title, body);
    });
  }
}
