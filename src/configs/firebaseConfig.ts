import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig =
  import.meta.env.VITE_CUSTOM_ENV == 'production'
    ? {
        apiKey: 'AIzaSyCuY1Xb35wJCOMrsqfjdnEn6M-E8Qgh7Yc',
        authDomain: 'empowerit-top.firebaseapp.com',
        projectId: 'empowerit-top',
        storageBucket: 'empowerit-top.appspot.com',
        messagingSenderId: '120897574110',
        appId: '1:120897574110:web:9bb4c7b46d3578af11de4f',
      }
    : {
        apiKey: 'AIzaSyCzQcrSP9lW6eYmmEkJ-5SxCfdK6YJMh6o',
        authDomain: 'topx-academy-dev.firebaseapp.com',
        projectId: 'topx-academy-dev',
        storageBucket: 'topx-academy-dev.appspot.com',
        messagingSenderId: '868581806255',
        appId: '1:868581806255:web:9fa8edab2a5580332ec45a',
      }

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)
export const storageBucket = getStorage(app)
