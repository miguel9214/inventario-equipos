// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Importa otros servicios de Firebase si es necesario, como Auth, Storage, etc.

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCB_t1dRLk5TxDvFqGiALod5vLDprfcibY",
  authDomain: "inventario-25418.firebaseapp.com",
  projectId: "inventario-25418",
  storageBucket: "inventario-25418.appspot.com",
  messagingSenderId: "375956630937",
  appId: "1:375956630937:web:d6829818c7212148ad3708"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db };
