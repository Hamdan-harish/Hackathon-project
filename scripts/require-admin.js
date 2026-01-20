import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

const app = initializeApp({
    apiKey: "AIzaSyBT7No8i0VsEpDH-AJzj5UgAi6czE4ojOY",
    authDomain: "my-project-ace79.firebaseapp.com",
    projectId: "my-project-ace79"
});

const auth = getAuth(app);
const REQUIRED_DOMAIN = "iiitkottayam.ac.in";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const email = user.email || "";
    const domain = email.split("@").pop();

    if (domain !== REQUIRED_DOMAIN) {
        alert("Access Denied: You must use an " + REQUIRED_DOMAIN + " email.");
        window.location.href = "login.html";
    } else {
        console.log("Admin verified by domain");
    }
});