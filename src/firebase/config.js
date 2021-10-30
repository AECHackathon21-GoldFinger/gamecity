import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'

import { ref } from 'vue'

const firebaseConfig = {
    apiKey: "AIzaSyB06yWU8hQQI_9nD1qHi0QQEStr3Iu2WIA",
    authDomain: "goldfinger-42.firebaseapp.com",
    databaseURL: 'https://goldfinger-42-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: "goldfinger-42",
    storageBucket: "goldfinger-42.appspot.com",
    messagingSenderId: "474323797617",
    appId: "1:474323797617:web:3d59dfe9c4a9376689fdd0"
};

let app = firebase.initializeApp(firebaseConfig)

const projectStorage = firebase.storage()
const projectDatabase = firebase.database()

export { projectStorage, projectDatabase }