import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { decode } from "base-64";

if (typeof atob === "undefined") {
  global.atob = decode;
}

import Constants from "expo-constants";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.APIKEY,
  authDomain: Constants.expoConfig.extra.AUTHDOMAIN,
  databaseURL: Constants.expoConfig.extra.DATABASEURL,
  projectId: Constants.expoConfig.extra.PROJECTID,
  storageBucket: Constants.expoConfig.extra.STORAGEBUCKET,
  //   messagingSenderId: "sender-id",
  appId: Constants.expoConfig.extra.APPID,
  // measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { storage };
