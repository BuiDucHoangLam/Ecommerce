import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyAaVQB7DljGyf9nysZnBRk3OBeJzJPZiWE",
    authDomain: "ecommerce-5fcbe.firebaseapp.com",
    projectId: "ecommerce-5fcbe",
    storageBucket: "ecommerce-5fcbe.appspot.com",
    messagingSenderId: "303981465516",
    appId: "1:303981465516:web:945b267db4a835b6453409"
  };
  
  firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
