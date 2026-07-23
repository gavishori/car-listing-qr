import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const col = collection(db, "carQrScans");
const DEVICE_CATEGORIES = ["נייד", "טאבלט", "מחשב"];
const REFRESH_MS = 30000;

const totalEl = document.getElementById("totalCount");
const deviceRowEl = document.getElementById("deviceRow");
const recentListEl = document.getElementById("recentList");
const updatedAtEl = document.getElementById("updatedAt");
const refreshBtn = document.getElementById("refreshBtn");

function formatTime(date) {
  return date.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderDevices(counts) {
  deviceRowEl.innerHTML = "";
  for (const cat of DEVICE_CATEGORIES) {
    const chip = document.createElement("div");
    chip.className = "device-chip";
    chip.innerHTML = `<span class="device-chip-count">${counts[cat] ?? 0}</span><span class="device-chip-label">${cat}</span>`;
    deviceRowEl.appendChild(chip);
  }
}

function renderRecent(docs) {
  recentListEl.innerHTML = "";
  if (docs.length === 0) {
    recentListEl.innerHTML = '<li class="empty">עדיין אין סריקות</li>';
    return;
  }
  for (const d of docs) {
    const data = d.data();
    const when = data.ts ? formatTime(data.ts.toDate()) : "—";
    const li = document.createElement("li");
    li.className = "recent-row";
    li.innerHTML = `
      <span class="recent-time">${when}</span>
      <span class="tag tag-device">${data.device || "לא ידוע"}</span>
      <span class="tag tag-browser">${data.browser || "לא ידוע"}</span>
    `;
    recentListEl.appendChild(li);
  }
}

async function loadStats() {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "טוען...";
  try {
    const totalSnap = await getCountFromServer(col);
    totalEl.textContent = totalSnap.data().count;

    const counts = {};
    for (const cat of DEVICE_CATEGORIES) {
      const snap = await getCountFromServer(query(col, where("device", "==", cat)));
      counts[cat] = snap.data().count;
    }
    renderDevices(counts);

    const recentSnap = await getDocs(query(col, orderBy("ts", "desc"), limit(20)));
    renderRecent(recentSnap.docs);

    updatedAtEl.textContent = `עודכן לאחרונה: ${formatTime(new Date())}`;
  } catch (e) {
    console.error("failed to load stats", e);
    updatedAtEl.textContent = "שגיאה בטעינת הנתונים";
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = "רענון";
  }
}

refreshBtn.addEventListener("click", loadStats);
loadStats();
setInterval(loadStats, REFRESH_MS);
