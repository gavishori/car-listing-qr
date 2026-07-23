import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const TARGET_URL = "https://www.yad2.co.il/vehicles/item/57q4474l";
const MAX_WAIT_MS = 1200;

function detectDevice(ua) {
  if (/iPad|Tablet|PlayBook/i.test(ua)) return "טאבלט";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "נייד";
  return "מחשב";
}

function detectBrowser(ua) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/CriOS|Chrome\//.test(ua)) return "Chrome";
  if (/FxiOS|Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "אחר";
}

async function logScan() {
  const ua = navigator.userAgent || "";
  const write = addDoc(collection(db, "carQrScans"), {
    device: detectDevice(ua),
    browser: detectBrowser(ua),
    ts: serverTimestamp()
  }).catch((e) => console.warn("scan logging failed", e));

  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  await Promise.race([write, timeout]);
}

logScan().finally(() => {
  window.location.replace(TARGET_URL);
});
