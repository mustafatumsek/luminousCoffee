// Firebase Configuration — Luminous Coffee
// Modular Firebase SDK (v10) via CDN

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, onSnapshot, query, orderBy, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAoAfS1MCT-Wrn3pReZw0X1vJs7Wf_ndF0",
    authDomain: "luminous-coffee.firebaseapp.com",
    projectId: "luminous-coffee",
    storageBucket: "luminous-coffee.firebasestorage.app",
    messagingSenderId: "189456377900",
    appId: "1:189456377900:web:8b386f2d1fac46cfde8989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    app, auth, db,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
    onSnapshot, query, orderBy, writeBatch, serverTimestamp
};
