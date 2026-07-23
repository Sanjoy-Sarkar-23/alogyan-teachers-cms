import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedApp: App | undefined;

type FirebaseServiceAccountJson = {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key?: string;
  client_email?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
};

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');

  if (!domain) return 'invalid-email';

  return `${name.slice(0, 4)}***@${domain}`;
}

function getBase64ServiceAccount(): ServiceAccount | null {
  const encodedServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_B64?.trim();

  if (!encodedServiceAccount) {
    console.info(
      '[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_B64 not found. Using individual environment variables.'
    );

    return null;
  }

  console.info(
    '[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_B64 found. Decoding credentials.'
  );

  try {
    const decodedValue = Buffer.from(
      encodedServiceAccount,
      'base64'
    ).toString('utf8');

    const serviceAccount = JSON.parse(
      decodedValue
    ) as FirebaseServiceAccountJson;

    const projectId = serviceAccount.project_id?.trim();
    const clientEmail = serviceAccount.client_email?.trim();
    const privateKey = serviceAccount.private_key
      ?.replace(/\\n/g, '\n')
      .trim();

    const missingFields = [
      !projectId && 'project_id',
      !clientEmail && 'client_email',
      !privateKey && 'private_key',
    ].filter(Boolean) as string[];

    if (missingFields.length > 0) {
      throw new Error(
        `Decoded service account is missing: ${missingFields.join(', ')}`
      );
    }

    console.info('[Firebase Admin] Base64 credential decoded successfully.', {
      projectId,
      clientEmail: maskEmail(clientEmail!),
      privateKeyConfigured: Boolean(privateKey),
    });

    return {
      projectId: projectId!,
      clientEmail: clientEmail!,
      privateKey: privateKey!,
    };
  } catch (error) {
    console.error(
      '[Firebase Admin] Failed to decode FIREBASE_SERVICE_ACCOUNT_B64.',
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unknown credential parsing error',
      }
    );

    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_B64 is not a valid Base64 Firebase service-account JSON.'
    );
  }
}

function getIndividualServiceAccount(): ServiceAccount {
  console.info(
    '[Firebase Admin] Reading individual Firebase environment variables.'
  );

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    .trim();

  const missingVariables = [
    !projectId && 'FIREBASE_PROJECT_ID',
    !clientEmail && 'FIREBASE_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_PRIVATE_KEY',
  ].filter(Boolean) as string[];

  if (missingVariables.length > 0) {
    console.error(
      '[Firebase Admin] Firebase credentials are incomplete.',
      {
        missingVariables,
        projectIdConfigured: Boolean(projectId),
        clientEmailConfigured: Boolean(clientEmail),
        privateKeyConfigured: Boolean(privateKey),
      }
    );

    throw new Error(
      `Firebase Admin is not configured. Missing: ${missingVariables.join(
        ', '
      )}. Add FIREBASE_SERVICE_ACCOUNT_B64 or the individual service-account variables.`
    );
  }

  console.info(
    '[Firebase Admin] Individual credentials loaded successfully.',
    {
      projectId,
      clientEmail: maskEmail(clientEmail!),
      privateKeyConfigured: Boolean(privateKey),
    }
  );

  return {
    projectId: projectId!,
    clientEmail: clientEmail!,
    privateKey: privateKey!,
  };
}

function getServiceAccount(): ServiceAccount {
  return getBase64ServiceAccount() ?? getIndividualServiceAccount();
}

function getAdminApp(): App {
  if (cachedApp) {
    console.info('[Firebase Admin] Returning cached Firebase Admin app.');
    return cachedApp;
  }

  const existingApps = getApps();

  if (existingApps.length > 0) {
    console.info('[Firebase Admin] Reusing existing Firebase Admin app.', {
      appCount: existingApps.length,
    });

    cachedApp = getApp();
    return cachedApp;
  }

  console.info('[Firebase Admin] Initializing Firebase Admin app.');

  try {
    const serviceAccount = getServiceAccount();

    cachedApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });

    console.info('[Firebase Admin] Firebase Admin initialized successfully.', {
      appName: cachedApp.name,
      projectId: serviceAccount.projectId,
    });

    return cachedApp;
  } catch (error) {
    console.error('[Firebase Admin] Firebase initialization failed.', {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown Firebase initialization error',
    });

    throw error;
  }
}

function lazyService<T extends object>(
  serviceName: string,
  factory: () => T
): T {
  let service: T | undefined;

  return new Proxy({} as T, {
    get(_target, property) {
      if (!service) {
        console.info(`[Firebase Admin] Initializing ${serviceName}.`);
        service = factory();
        console.info(
          `[Firebase Admin] ${serviceName} initialized successfully.`
        );
      }

      const value = Reflect.get(service, property);

      return typeof value === 'function'
        ? value.bind(service)
        : value;
    },
  });
}

export const adminAuth = lazyService<Auth>(
  'Firebase Auth',
  () => getAuth(getAdminApp())
);

export const adminDb = lazyService<Firestore>(
  'Firestore',
  () => getFirestore(getAdminApp())
);

export default getAdminApp;