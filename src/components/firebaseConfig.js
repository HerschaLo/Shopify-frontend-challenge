import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAqSZav8aybNrKDYImC7lBvylOAyrTI7F8",
  authDomain: "shopify-frontend-challen-a8dbc.firebaseapp.com",
  projectId: "shopify-frontend-challen-a8dbc",
  storageBucket: "shopify-frontend-challen-a8dbc.appspot.com",
  messagingSenderId: "136950555221",
  appId: "1:136950555221:web:21f6639f2cad53c096eadc",
  measurementId: "G-K5V9XFTNNJ"
};

let firebaseInstance
const getFirebase = ()=>{
    if(firebaseInstance){
        return firebaseInstance
    }

    firebaseInstance = initializeApp(firebaseConfig)

    return firebaseInstance
}

export default getFirebase