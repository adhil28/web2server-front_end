import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyAf03E1R4ScJueYzYDq1NY0v6c6E8ppu1g",
    authDomain: "web2linux.firebaseapp.com",
    projectId: "web2linux",
    storageBucket: "web2linux.appspot.com",
    messagingSenderId: "351952684565",
    appId: "1:351952684565:web:e87fd85d94ad3cc5ccf01c",
    measurementId: "G-HP9F4JQTP5"
};
const app = initializeApp(firebaseConfig);
getAnalytics(app);