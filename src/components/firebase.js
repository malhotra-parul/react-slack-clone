  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/database";
  import "firebase/storage";
  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAFPQy_aDD-7x-DnqVXpARTkWhhhz_a_Bk",
    authDomain: "devslack-be53b.firebaseapp.com",
    databaseURL: "https://devslack-be53b.firebaseio.com",
    projectId: "devslack-be53b",
    storageBucket: "devslack-be53b.appspot.com",
    messagingSenderId: "868526035264",
    appId: "1:868526035264:web:77a07e9c38b21816686aa5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth();

//sign in with google
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: "select_account"});
  export const signInWithGoogle = ()=> auth.signInWithPopup(provider);

  export default firebase;