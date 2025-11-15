import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth'

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
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export { app, auth, provider, onAuthStateChanged, signInWithPopup }
