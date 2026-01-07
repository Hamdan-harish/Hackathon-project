import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut }
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

const navLogin      = document.getElementById("navLogin");
const navComplaints = document.getElementById("navComplaints");
const navAdmin      = document.getElementById("navAdmin");
const navAnalytics  = document.getElementById("navAnalytics");

/* --- 🔹 Highlight Current Page --- */
function highlightActiveNav(){
  const file = location.pathname.split("/").pop() || "index.html";

  const map = {
    "index.html": null,
    "complaints.html": navComplaints,
    "my-complaints.html": navComplaints,
    "admin.html": navAdmin,
    "analytics.html": navAnalytics
  };

  // remove any previous highlights
  [navComplaints, navAdmin, navAnalytics].forEach(el=>{
    if(el) el.classList.remove("active");
  });

  const el = map[file];
  if(el) el.classList.add("active");
}


/* ---- LOGGED OUT ---- */
function setLoggedOutUI(){
  if(navLogin){
    navLogin.textContent="Login";
    navLogin.href="login.html";
    navLogin.onclick=null;
  }

  if(navComplaints) navComplaints.href="login.html";
  if(navAdmin)      navAdmin.href="login.html";
  if(navAnalytics)  navAnalytics.href="login.html";

  highlightActiveNav();
}

/* ---- LOGGED IN ---- */
async function setLoggedInUI(user){

  // Login → Logout
  if(navLogin){
    navLogin.textContent="Logout";
    navLogin.href="#";
    navLogin.onclick=e=>{
      e.preventDefault();
      signOut(auth).then(()=>location.href="index.html");
    };
  }

  const snap = await getDoc(doc(db,"users",user.uid));
  const role = snap.exists() ? snap.data().role : "student";

  /* 👨‍💼 ADMIN MODE */
  if(role === "admin"){

    // Complaints = Admin Dashboard
    if(navComplaints){
      navComplaints.href = "admin.html";
      navComplaints.onclick = null;
    }

    if(navAdmin){
      navAdmin.style.display="inline-block";
      navAdmin.href="admin.html";
      navAdmin.onclick=null;
    }

    if(navAnalytics){
      navAnalytics.style.display="inline-block";
      navAnalytics.href="analytics.html";
      navAnalytics.onclick=null;
    }

    highlightActiveNav();
    return;
  }

  /* 👨‍🎓 STUDENT MODE */

  // Complaints → Public Feed
  if(navComplaints){
    navComplaints.href="complaints.html";
    navComplaints.onclick=null;
  }

  // Show admin links but block (showcase)
  if(navAdmin){
    navAdmin.style.display="inline-block";
    navAdmin.href="#";
    navAdmin.onclick=e=>{
      e.preventDefault();
      alert("Access denied — Admins only");
      location.href="complaints.html";
    };
  }

  if(navAnalytics){
    navAnalytics.style.display="inline-block";
    navAnalytics.href="#";
    navAnalytics.onclick=e=>{
      e.preventDefault();
      alert("Access denied — Admins only");
      location.href="complaints.html";
    };
  }

  highlightActiveNav();
}

onAuthStateChanged(auth,user=>{
  if(!user) return setLoggedOutUI();
  setLoggedInUI(user);
});
