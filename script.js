const TOTAL_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;
const START_DATE = new Date(2026, 3, 29);

const el = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
  progressBar: document.querySelector("#progressBar"),
  progressText: document.querySelector("#progressText"),
  statusText: document.querySelector("#statusText"),
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

function formatDate(date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function updateCountdown() {
  const start = START_DATE;
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

updateCountdown();
setInterval(updateCountdown, 1000);
