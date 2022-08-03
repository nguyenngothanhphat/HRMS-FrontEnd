import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBh_j3r1MmMAqgMO0Nf7Vy5ygm-cUH_4fQ',
  authDomain: 'ambient-future-356403.firebaseapp.com',
  projectId: 'ambient-future-356403',
  storageBucket: 'ambient-future-356403.appspot.com',
  messagingSenderId: '1010426690737',
  appId: '1:1010426690737:web:061e2a1e004ceca5afb690',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app as default };
