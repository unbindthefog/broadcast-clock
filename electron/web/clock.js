function buildRing(container, count, radiusPercent) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + radiusPercent * Math.cos(angle);
    const y = 50 + radiusPercent * Math.sin(angle);
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    container.appendChild(dot);
    dots.push(dot);
  }
  return dots;
}

const clockStyle = getComputedStyle(document.getElementById("clock"));
const hoursRadius = parseFloat(clockStyle.getPropertyValue("--ring-hours-radius"));
const secondsRadius = parseFloat(clockStyle.getPropertyValue("--ring-seconds-radius"));

const hourDots = buildRing(document.getElementById("ringHours"), 12, hoursRadius);
hourDots.forEach((dot) => dot.classList.add("lit"));

const secondDots = buildRing(document.getElementById("ringSeconds"), 60, secondsRadius);

const hhEl = document.getElementById("hh");
const mmEl = document.getElementById("mm");
const ssEl = document.getElementById("ss");
const colonEls = [document.getElementById("colon1"), document.getElementById("colon2")];
const clockEl = document.getElementById("clock");

function updateBaseUnit() {
  const rect = clockEl.getBoundingClientRect();
  const u = Math.min(rect.width, rect.height) / 100;
  clockEl.style.setProperty("--u", `${u}px`);
}

updateBaseUnit();
window.addEventListener("resize", updateBaseUnit);
new ResizeObserver(updateBaseUnit).observe(clockEl);

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const pad = (n) => String(n).padStart(2, "0");

  hhEl.textContent = pad(hours);
  mmEl.textContent = pad(minutes);
  ssEl.textContent = pad(seconds);

  colonEls.forEach((el) => el.classList.toggle("off", seconds % 2 === 1));

  secondDots.forEach((dot, i) => {
    dot.classList.toggle("lit", i <= seconds);
  });

  document.title = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

updateClock();
setInterval(updateClock, 250);

const CURSOR_IDLE_MS = 3000;
let cursorIdleTimer;

function resetCursorIdleTimer() {
  document.body.classList.remove("cursor-hidden");
  clearTimeout(cursorIdleTimer);
  cursorIdleTimer = setTimeout(() => {
    document.body.classList.add("cursor-hidden");
  }, CURSOR_IDLE_MS);
}

document.addEventListener("mousemove", resetCursorIdleTimer);
resetCursorIdleTimer();
