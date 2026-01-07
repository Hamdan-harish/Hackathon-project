import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* ensure firebase app exists */
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

/* 🔐 block non-admins */
onAuthStateChanged(auth, async user => {

  // not logged in → send to login
  if (!user) {
    location.href = "login.html";
    return;
  }

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
