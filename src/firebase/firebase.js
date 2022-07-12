import { initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {getFunctions} from 'firebase/functions'
import {httpsCallable} from 'firebase/functions'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyAKEjPmUd3ztQdAtFvIE9LacyDBkwyq8Ho",
  authDomain: "mrpuff-ims.firebaseapp.com",
  projectId: "mrpuff-ims",
  storageBucket: "mrpuff-ims.appspot.com",
  messagingSenderId: "403063868741",
  appId: "1:403063868741:web:0f4f1ace3c1ca33084422c",
  measurementId: "G-WREZ4KHS81"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

// Funciones para importar directamente en componentes
export const addAdminRole = httpsCallable(functions, 'addAdminRole')
export const getAdminRole = httpsCallable(functions, 'getAdminRole')
