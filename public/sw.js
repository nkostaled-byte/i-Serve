self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'New Notification', body: 'You have a new update.' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://firebasestorage.googleapis.com/v0/b/i-serve-bcf9a.appspot.com/o/assets%2Fi-Serve%20logo%20512x512.webp?alt=media&token=3d780976-dde8-48c0-b3e3-ec8f5fd9c54a',
    badge: 'https://firebasestorage.googleapis.com/v0/b/i-serve-bcf9a.appspot.com/o/assets%2Fi-Serve%20logo%20512x512.webp?alt=media&token=3d780976-dde8-48c0-b3e3-ec8f5fd9c54a',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
