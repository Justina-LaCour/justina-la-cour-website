// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { adminUser } from "./stores";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD73ezLrt2lmdjPDls7r_t5cytH2VAlyls",
    authDomain: "justina-la-cour-website.firebaseapp.com",
    projectId: "justina-la-cour-website",
    storageBucket: "justina-la-cour-website.appspot.com",
    messagingSenderId: "608293650529",
    appId: "1:608293650529:web:0ceb6b6b2dc5fe0bac2a20",
    measurementId: "G-CMJ5CBNWTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export async function signIn(email: string, password: string) {
    const signInResult = await signInWithEmailAndPassword(auth, email, password);
    adminUser.set(signInResult.user);
}

export const db = getFirestore(app);

export const concertsCollection = collection(db, "concerts");
export async function getConcerts() {
    return getDocs(concertsCollection);
}

export const biosCollection = collection(db, "bios");
export async function getBios() {
    return getDocs(biosCollection);
}

export const galleryCollection = collection(db, "gallery");
export async function getPictures() {
    return getDocs(galleryCollection);
}

export const videosCollection = collection(db, "videos");
export async function getVideos() {
    return getDocs(videosCollection);
}

export const socialMediasCollection = collection(db, "socialMedias");

export const storage = getStorage(app);

const analytics = getAnalytics(app);