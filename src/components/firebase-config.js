import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// ▶️ Replace with your own Firebase project config if needed
const firebaseConfig = {
  apiKey: "AIzaSyDeJE2Iu5XyYzgiUQkGVmJjMFKUkEnnVvU",
  authDomain: "realtime-chat-app-1be8e.firebaseapp.com",
  databaseURL: "https://realtime-chat-app-1be8e-default-rtdb.firebaseio.com",
  projectId: "realtime-chat-app-1be8e",
  storageBucket: "realtime-chat-app-1be8e.appspot.com",
  messagingSenderId: "375509004814",
  appId: "1:375509004814:web:89bc753fedb66dd201425f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
