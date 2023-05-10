import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from '../helpers/ToastNotify';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const createUser = async (email, password, navigate, displayName) => {
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
    toastSuccessNotify('Registered successfully!');
    navigate('/');
    console.log(userCredential);
  } catch (error) {
    toastErrorNotify(error.message);
  }
};

export const signIn = async(email, password, navigate) => {
  try {
    let userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    navigate('/');
    toastSuccessNotify('Logged in successfully');
    console.log(userCredential);
  } catch (error) {
    toastErrorNotify(error.message);
    console.log(error);
  }
};

export const userObserver = (setCurrentUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(false);
    }
  });
};

export const logOut = () => {
  signOut(auth);
};

export const signUpProvider = (navigate) => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
  .then((result) => {
     console.log(result);
     navigate('/');
     toastSuccessNotify('Logged out successfully');
  }).catch((error) => {
     console.log(error);
  });
};

export const forgotPassword = (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toastWarnNotify('Please check your mail box!');
    })
    .catch((err) => {
      toastErrorNotify(err.message);
    });
};
