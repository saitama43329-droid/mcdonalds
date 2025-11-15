import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyBKcs8bcTQfOj_aFz8w39oDI15nEgnt_DQ',
  authDomain: 'mlbb-30078.firebaseapp.com',
  projectId: 'mlbb-30078',
  storageBucket: 'mlbb-30078.firebasestorage.app',
  messagingSenderId: '89136323454',
  appId: '1:89136323454:web:de0e67ad48c6da8974312f',
  measurementId: 'G-MRW9YPRVBM'
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export {
  app,
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
}
