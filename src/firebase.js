// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Importa otros servicios de Firebase si es necesario, como Auth, Storage, etc.

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuaXEzJKyqL1gkGccORir1VTno8YRCjT0",
  authDomain: "inventario-22df1.firebaseapp.com",
  projectId: "inventario-22df1",
  storageBucket: "inventario-22df1.appspot.com",
  messagingSenderId: "270022087066",
  appId: "1:270022087066:web:864ac621bedc19a55eaa23"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db };
