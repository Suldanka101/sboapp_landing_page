import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyB4cKnj2p3MApv3GvO3IGBIpcqSXhd6lis",
  authDomain: "tstsboapp.firebaseapp.com",
  databaseURL: "https://tstsboapp-default-rtdb.firebaseio.com",
  projectId: "tstsboapp",
  storageBucket: "tstsboapp.firebasestorage.app",
  messagingSenderId: "257193574697",
  appId: "1:257193574697:web:c9da6d24faf1bd4d48b738",
  measurementId: "G-019TGSF5SG"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export default app
