const TOTAL_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "umar-football-recovery-countdown-start";

const el = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
  progressBar: document.querySelector("#progressBar"),
  progressText: document.querySelector("#progressText"),
  statusText: document.querySelector("#statusText"),
  startDate: document.querySelector("#startDate"),
  applyDate: document.querySelector("#applyDate"),
  resetDate: document.querySelector("#resetDate"),
  chapterNumber: document.querySelector("#chapterNumber"),
  chapterText: document.querySelector("#chapterText"),
  mangaLine: document.querySelector("#mangaLine"),
  finishDate: document.querySelector("#finishDate"),
};

const lines = [
  "Bugungi ehtiyotkor qadam ertangi golga olib boradi.",
  "Umar ibn Saidjappar sabr bilan kuchini qayta yig'yapti.",
  "Maydonga qaytish shoshilish emas, to'g'ri tiklanish bilan boshlanadi.",
  "Bugun oyoqni asra, ertaga to'pni bemalol boshqar.",
  "Final hushtagi emas, comeback hushtagi yaqinlashyapti.",
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function readStartDate() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = new Date(saved);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  localStorage.setItem(STORAGE_KEY, today.toISOString());
  return today;
}

function saveStartDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return;
  localStorage.setItem(STORAGE_KEY, date.toISOString());
  updateCountdown();
}

function formatDate(date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function updateCountdown() {
  const start = readStartDate();
  const finish = new Date(start.getTime() + TOTAL_DAYS * DAY_MS);
  const now = new Date();
  const remaining = Math.max(0, finish.getTime() - now.getTime());
  const elapsed = Math.max(0, Math.min(finish.getTime() - start.getTime(), now.getTime() - start.getTime()));
  const progress = Math.min(100, (elapsed / (TOTAL_DAYS * DAY_MS)) * 100);

  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  const chapter = Math.min(TOTAL_DAYS, Math.max(1, Math.floor(elapsed / DAY_MS) + 1));

  el.days.textContent = days;
  el.hours.textContent = pad(hours);
  el.minutes.textContent = pad(minutes);
  el.seconds.textContent = pad(seconds);
  el.progressBar.style.width = `${progress}%`;
  el.progressText.textContent = `${progress.toFixed(1)}%`;
  el.startDate.value = dateInputValue(start);
  el.finishDate.textContent = formatDate(finish);
  el.chapterNumber.textContent = pad(chapter).padStart(3, "0");
  el.chapterText.textContent =
    remaining === 0
      ? "Comeback paneli yopildi. Umar ibn Saidjappar futbolga qaytishga tayyor."
      : `${chapter}-kun. Oyoqni asrab, tiklanish rejasini davom ettir. Maydon kutadi.`;
  el.mangaLine.textContent = `"${lines[(chapter - 1) % lines.length]}"`;
  el.statusText.textContent =
    remaining === 0
      ? "Futbolga qaytish kuni keldi"
      : `Tiklanish: ${formatDate(start)} dan ${formatDate(finish)} gacha`;
}

el.applyDate.addEventListener("click", () => saveStartDate(el.startDate.value));
el.resetDate.addEventListener("click", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  localStorage.setItem(STORAGE_KEY, today.toISOString());
  updateCountdown();
});
el.startDate.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveStartDate(el.startDate.value);
});

updateCountdown();
setInterval(updateCountdown, 1000);
