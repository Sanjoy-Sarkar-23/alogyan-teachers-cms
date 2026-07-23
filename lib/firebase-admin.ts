import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedApp: App | undefined;

function getAdminApp() {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  const missing = [
    !projectId && 'FIREBASE_PROJECT_ID',
    !clientEmail && 'FIREBASE_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_PRIVATE_KEY',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Firebase Admin is not configured. Missing: ${missing.join(', ')}. ` +
        'Add the service-account values to .env and restart the Next.js server.'
    );
  }

  cachedApp = initializeApp({
    credential: cert({
      projectId: projectId!,
      clientEmail: clientEmail!,
      privateKey: privateKey!,
    }),
    projectId,
  });
  return cachedApp;
}

function lazyService<T extends object>(factory: () => T): T {
  let service: T | undefined;
  return new Proxy({} as T, {
    get(_target, property) {
      service ??= factory();
      const value = Reflect.get(service, property);
      return typeof value === 'function' ? value.bind(service) : value;
    },
  });
}

export const adminAuth = lazyService<Auth>(() => getAuth(getAdminApp()));
export const adminDb = lazyService<Firestore>(() => getFirestore(getAdminApp()));
export default getAdminApp;
