/* =========================================================
   EQUIPO ROCKET · Aerospace Technology — main.js
   ========================================================= */

// ▶ CAMBIA AQUÍ LA FECHA Y HORA DEL LANZAMIENTO (AAAA-MM-DDTHH:MM:SS)
const FECHA_LANZAMIENTO = "2027-04-17T09:00:00";

const $ = (id) => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Estrellas que titilan (el fondo del cohete queda fijo) ---------- */
(() => {
  const c = $("stars"), x = c.getContext("2d");
  let w, h, S = [], shoot = null;
  function init() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(260, Math.floor((w * h) / 6500));
    S = Array.from({ length: n }, () => {
      const d = Math.random();
      return { x: Math.random() * w, y: Math.random() * h * 0.75, r: 0.4 + d * 1.3, t: Math.random() * 6.28, z: d,
               k: Math.random() < 0.15 ? "#2FD4FF" : Math.random() < 0.08 ? "#ff8a8e" : "#ffffff" };
    });
  }
  function frame(t) {
    x.clearRect(0, 0, w, h);
    for (const s of S) {
      x.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(s.t + (t / 1400) * (0.4 + s.z)));
      x.fillStyle = s.k; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.28); x.fill();
    }
    if (!shoot && Math.random() < 0.004) shoot = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, v: 0 };
    if (shoot) {
      shoot.v++;
      const sx = shoot.x + shoot.v * 14, sy = shoot.y + shoot.v * 7;
      const g = x.createLinearGradient(sx, sy, sx - 120, sy - 60);
      g.addColorStop(0, "rgba(220,250,255,.95)"); g.addColorStop(1, "transparent");
      x.globalAlpha = 1; x.strokeStyle = g; x.lineWidth = 2;
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx - 120, sy - 60); x.stroke();
      if (shoot.v > 60) shoot = null;
    }
    if (!reduced) requestAnimationFrame(frame);
  }
  addEventListener("resize", () => { init(); if (reduced) frame(0); });
  init(); requestAnimationFrame(frame);
})();

/* ---------- Cuenta regresiva ---------- */
(() => {
  const target = new Date(FECHA_LANZAMIENTO).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let d = Math.max(0, target - Date.now());
    const days = Math.floor(d / 864e5); d %= 864e5;
    const hrs = Math.floor(d / 36e5); d %= 36e5;
    const min = Math.floor(d / 6e4); d %= 6e4;
    $("cd-d").textContent = pad(days); $("cd-h").textContent = pad(hrs);
    $("cd-m").textContent = pad(min);  $("cd-s").textContent = pad(Math.floor(d / 1e3));
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- Menú móvil ---------- */
(() => {
  const b = document.querySelector(".menu-toggle"), nav = $("main-nav");
  b.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    b.setAttribute("aria-expanded", open);
    b.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open"); b.setAttribute("aria-expanded", "false");
  }));
})();

/* ---------- Secuencia de lanzamiento (10…1, ¡DESPEGUE!) ---------- */
(() => {
  const ov = $("ov"), num = $("ovn");
  let prev = null, timer = null;
  function close() {
    clearInterval(timer); ov.hidden = true; ov.classList.remove("go");
    document.body.style.overflow = ""; if (prev) prev.focus();
  }
  function start() {
    prev = document.activeElement; clearInterval(timer);
    ov.classList.remove("go"); ov.hidden = false; document.body.style.overflow = "hidden";
    $("ovx").focus();
    let n = 10; num.textContent = n;
    timer = setInterval(() => {
      n--;
      num.classList.remove("pop"); void num.offsetWidth; num.classList.add("pop");
      if (n > 0) num.textContent = n;
      else { num.textContent = "¡DESPEGUE!"; clearInterval(timer); void ov.offsetWidth; ov.classList.add("go"); }
    }, 450);
  }
  $("go").addEventListener("click", start);
  $("ovx").addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !ov.hidden) close(); });
})();

/* ---------- Tarjetas con inclinación 3D ---------- */
document.querySelectorAll(".card").forEach((c) => {
  const set = (e) => {
    const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    c.style.setProperty("--rx", ((0.5 - py) * 14).toFixed(1) + "deg");
    c.style.setProperty("--ry", ((px - 0.5) * 16).toFixed(1) + "deg");
    c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
  };
  const reset = () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); c.classList.remove("hot"); };
  c.addEventListener("pointermove", (e) => { c.classList.add("hot"); set(e); });
  c.addEventListener("pointerleave", reset);
  c.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") setTimeout(reset, 700); });
});

/* ---------- Música ambiental (generada en el navegador, sin archivos) ---------- */
(() => {
  const b = $("snd");
  let ctx, master, pad, on = false, timer;
  const chords = [[110, 164.81, 220, 277.18], [98, 146.83, 196, 246.94], [87.31, 130.81, 174.61, 220], [103.83, 155.56, 207.65, 261.63]];
  let ci = 0;
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    const dl = ctx.createDelay(1.5); dl.delayTime.value = 0.55;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    dl.connect(fb); fb.connect(dl);
    pad = ctx.createGain();
    pad.connect(lp); lp.connect(master); lp.connect(dl); dl.connect(master);
    master.connect(ctx.destination);
    const sub = ctx.createOscillator(), sg = ctx.createGain();
    sub.frequency.value = 55; sg.gain.value = 0.08; sub.connect(sg); sg.connect(lp); sub.start();
  }
  function chord() {
    const t = ctx.currentTime, dur = 14;
    chords[ci++ % chords.length].forEach((f, i) => {
      [-6, 6].forEach((dt) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f; o.detune.value = dt;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04, t + 4);
        g.gain.setValueAtTime(0.04, t + dur - 4); g.gain.linearRampToValueAtTime(0, t + dur + 2);
        o.connect(g); g.connect(pad); o.start(t); o.stop(t + dur + 2.2);
      });
    });
  }
  async function toggle() {
    if (!ctx) build();
    if (!on) {
      await ctx.resume(); on = true; chord(); timer = setInterval(chord, 12000);
      master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.9);
    } else {
      on = false; clearInterval(timer); master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
      setTimeout(() => { if (!on) ctx.suspend(); }, 1500);
    }
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
    b.setAttribute("aria-label", on ? "Silenciar música ambiental" : "Activar música ambiental");
  }
  b.addEventListener("click", toggle);
})();

/* ---------- Año en el pie ---------- */
$("yy").textContent = String(new Date().getFullYear()).slice(-2);
