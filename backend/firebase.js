// firebase.js
import admin from 'firebase-admin';

const serviceAccount = await import('./serviceAccountKey.json', {
  assert: { type: 'json' },
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
});

export default admin;
