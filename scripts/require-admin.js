// ⭐ Temporary Demo Admin Mode (Hackathon Only)
if (sessionStorage.getItem("demoAdmin") === "true") {
  console.log("Demo admin mode — access allowed");
  window.__demoAdminBypass = true;
}

import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


/* Ensure Firebase initialized */
if (!getApps().length) {
  initializeApp({
    apiKey:"AIzaSyBT7No8i0VsEpDH-AJzj5UgAi6czE4ojOY",
    authDomain:"my-project-ace79.firebaseapp.com",
    projectId:"my-project-ace79"
  });
}

const auth = getAuth();
const db   = getFirestore();

const statusMsg = document.getElementById("statusMsg");


/* 🔐 Admin Gate */
onAuthStateChanged(auth, async user => {

  // Not logged in → send to login
  if (!user) {
    location.href = "login.html";
    return;
  }

  // 🎯 Bypass check if Demo Admin Mode enabled
  if (window.__demoAdminBypass) {
    if (statusMsg)
      statusMsg.textContent = "Demo Admin Mode (Temporary)";
    console.log("Bypass active — skipping role check");
    return;
  }

  // Normal role check
  try{
    const snap = await getDoc(doc(db,"users",user.uid));
    const role = snap.exists() ? snap.data().role : "student";

    if (role !== "admin") {
      alert("Access denied — Admins only");
      location.href = "complaints.html";
      return;
    }

    if (statusMsg)
      statusMsg.textContent = "Logged in as Admin ✔";

  } catch(err){
    console.error("Role check failed",err);
    location.href = "complaints.html";
  }
});
