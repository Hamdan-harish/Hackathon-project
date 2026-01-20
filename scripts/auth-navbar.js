import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

if (!getApps().length) {
    initializeApp({
        apiKey: "AIzaSyBT7No8i0VsEpDH-AJzj5UgAi6czE4ojOY",
        authDomain: "my-project-ace79.firebaseapp.com",
        projectId: "my-project-ace79"
    });
}

const auth = getAuth();
const db = getFirestore();

const navLogin = document.getElementById("navLogin");
const navComplaints = document.getElementById("navComplaints");
const navAdmin = document.getElementById("navAdmin");
const navAnalytics = document.getElementById("navAnalytics");

const ADMIN_DOMAIN = "iiitkottayam.ac.in";

function highlightActiveNav() {
    const file = location.pathname.split("/").pop() || "index.html";

    const map = {
        "index.html": null,
        "complaints.html": navComplaints,
        "my-complaints.html": navComplaints,
        "admin.html": navAdmin,
        "analytics.html": navAnalytics
    };

    [navComplaints, navAdmin, navAnalytics].forEach(el => {
        if (el) el.classList.remove("active");
    });

    const el = map[file];
    if (el) el.classList.add("active");
}

function setLoggedOutUI() {
    if (navLogin) {
        navLogin.textContent = "Login";
        navLogin.href = "login.html";
        navLogin.onclick = null;
    }

    if (navComplaints) navComplaints.href = "login.html";
    if (navAdmin) navAdmin.href = "login.html";
    if (navAnalytics) navAnalytics.href = "login.html";

    highlightActiveNav();
}

async function setLoggedInUI(user) {
    const demoAdmin = sessionStorage.getItem("demoAdmin") === "true";
    const sessionRole = sessionStorage.getItem("sessionRole");

    let isRealAdmin = false;
    
    if (user.email && user.email.endsWith(ADMIN_DOMAIN)) {
        if (sessionRole === "student") {
            isRealAdmin = false;
        } else {
            isRealAdmin = true;
        }
    } 

    if (demoAdmin || isRealAdmin) {
        if (navComplaints) {
            navComplaints.href = "admin.html";
            navComplaints.onclick = null;
        }

        if (navAdmin) {
            navAdmin.style.display = "inline-block";
            navAdmin.href = "admin.html";
            navAdmin.onclick = null;
        }

        if (navAnalytics) {
            navAnalytics.style.display = "inline-block";
            navAnalytics.href = "analytics.html";
            navAnalytics.onclick = null;
        }

        if (navLogin) {
            navLogin.textContent = demoAdmin ? "Exit Demo" : "Logout";
            navLogin.href = "#";
            navLogin.onclick = e => {
                e.preventDefault();
                sessionStorage.removeItem("demoAdmin");
                sessionStorage.removeItem("sessionRole");
                signOut(auth).then(() => location.href = "index.html");
            };
        }

        highlightActiveNav();
        return;
    }

    if (navLogin) {
        navLogin.textContent = "Logout";
        navLogin.href = "#";
        navLogin.onclick = e => {
            e.preventDefault();
            sessionStorage.removeItem("sessionRole");
            signOut(auth).then(() => location.href = "index.html");
        };
    }

    if (navComplaints) {
        navComplaints.href = "complaints.html";
        navComplaints.onclick = null;
    }

    const restrictAccess = (e) => {
        e.preventDefault();
        alert("Access denied — Admins only");
        location.href = "complaints.html";
    };

    if (navAdmin) {
        navAdmin.style.display = "inline-block";
        navAdmin.href = "#";
        navAdmin.onclick = restrictAccess;
    }

    if (navAnalytics) {
        navAnalytics.style.display = "inline-block";
        navAnalytics.href = "#";
        navAnalytics.onclick = restrictAccess;
    }

    highlightActiveNav();
}

onAuthStateChanged(auth, user => {
    if (!user) return setLoggedOutUI();
    setLoggedInUI(user);
});