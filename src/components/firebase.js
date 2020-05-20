  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/database";
  import "firebase/storage";
  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyChckhW8GzilQxPZ2ybKsSIklmbyNAiA3A",
    authDomain: "react-slack-clone-ce751.firebaseapp.com",
    databaseURL: "https://react-slack-clone-ce751.firebaseio.com",
    projectId: "react-slack-clone-ce751",
    storageBucket: "react-slack-clone-ce751.appspot.com",
    messagingSenderId: "7348118071",
    appId: "1:7348118071:web:433c88a6279cfcb47c95b2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth();

//sign in with google
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: "select_account"});
  export const signInWithGoogle = ()=> auth.signInWithPopup(provider);

  export default firebase;