// ============================================
// CUSTOMIZE THESE VALUES
// ============================================
const HER_NAME = "Annie Nicole";
const YOUR_NAME = "Alain";
const TYPE_TEXT = "I know we're far apart and we hate it, but I will always cherish the happiness you bring to me through it, the way you cheer me on. Forever grateful 🤞❤️";
const VALENTINES_DAY = new Date("February 14, 2026 00:00:00");
// ============================================
// DOM ELEMENTS
// ============================================
const herNameEl = document.getElementById("herName");
const toNameEl = document.getElementById("toName");
const fromNameEl = document.getElementById("fromName");
const sigNameEl = document.getElementById("sigName");
const footerNameEl = document.getElementById("footerName");
const typeLineEl = document.getElementById("typeLine");
const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openBtn");
const overlay = document.getElementById("overlay");
const overlayBack = document.getElementById("overlayBack");
const letterModal = document.getElementById("letterModal");
const closeBtn = document.getElementById("closeBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const celebrate = document.getElementById("celebrate");
const closeCelebrate = document.getElementById("closeCelebrate");
const kissBtn = document.getElementById("kissBtn");
const kissOut = document.getElementById("kissOut");
const loveMeter = document.getElementById("loveMeter");
const cursorHeart = document.getElementById("cursorHeart");
// Inject names
herNameEl.textContent = HER_NAME;
toNameEl.textContent = HER_NAME;
fromNameEl.textContent = YOUR_NAME;
sigNameEl.textContent = YOUR_NAME;
footerNameEl.textContent = YOUR_NAME;
// Typewriter effect
let typeIndex = 0;
function typeWriter() {
    if (typeIndex <= TYPE_TEXT.length) {
        typeLineEl.textContent = TYPE_TEXT.slice(0, typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 35);
    }
}
typeWriter();
// Countdown timer
function updateCountdown() {
    const diff = VALENTINES_DAY - new Date();
    if (diff <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("mins").textContent = "00";
        document.getElementById("secs").textContent = "00";
        return;
    }
    document.getElementById("days").textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
    document.getElementById("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
    document.getElementById("mins").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    document.getElementById("secs").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);
// Open / Close letter
function openLetter() {
    envelope.classList.add("open");
    setTimeout(() => {
        overlay.classList.remove("hidden");
        document.body.classList.add("modalOpen");
        setTimeout(() => { loveMeter.style.width = "100%"; }, 500);
    }, 700);
    burstHearts(30, window.innerWidth / 2, window.innerHeight / 2);
    // Play music if it exists
    const song = document.getElementById("song");
    if (song) {
        song.play().catch(e => console.log("Audio play blocked until interaction"));
    }
}
function closeLetter() {
    overlay.classList.add("hidden");
    document.body.classList.remove("modalOpen");
    loveMeter.style.width = "0%";
    envelope.classList.remove("open"); // This fixes the letter going back inside
}
openBtn.addEventListener("click", openLetter);
envelope.addEventListener("click", openLetter);
overlayBack.addEventListener("click", closeLetter);
closeBtn.addEventListener("click", closeLetter);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeLetter();
});
// No button dodge - stays within question box
const noTexts = ["no 😶", "be serious 😌", "try again 😭", "nice try 😈", "that button is broken 🤭", "not happening 💅", "wrong answer 🙄", "are you sure? 🤔", "think again 😏", "lol no 😂"];
let noTextIndex = 0;
function dodgeNo() {
    const questionBox = document.querySelector(".question-box");
    const boxRect = questionBox.getBoundingClientRect();
    const modalRect = letterModal.getBoundingClientRect();
    const pad = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    // Keep it within the boundaries of the question box
    const minX = boxRect.left - modalRect.left + pad;
    const maxX = boxRect.left - modalRect.left + boxRect.width - btnW - pad;
    const minY = boxRect.top - modalRect.top + pad;
    const maxY = boxRect.top - modalRect.top + boxRect.height - btnH - pad;
    const newX = Math.floor(minX + Math.random() * (maxX - minX));
    const newY = Math.floor(minY + Math.random() * (maxY - minY));
    noBtn.style.position = "absolute";
    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
    noTextIndex = (noTextIndex + 1) % noTexts.length;
    noBtn.textContent = noTexts[noTextIndex];
}
noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("click", dodgeNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); });
// Yes button celebration
yesBtn.addEventListener("click", () => {
    yesBtn.disabled = true;
    noBtn.style.display = "none";
    yesBtn.querySelector(".btn-yes-text").textContent = "YES 💖 (locked in!)";
    celebrate.classList.remove("hidden");
    startConfetti(300);
    startHeartRain(1.5);
    burstHearts(100, window.innerWidth / 2, window.innerHeight / 2);
});
closeCelebrate.addEventListener("click", () => {
    celebrate.classList.add("hidden");
    stopHeartRain();
});
// Kiss button
const kisses = ["mwah 😚", "MUAH 💋", "kiss kiss 😙", "i miss you 🫶", "come here 😌", "*smooch* 💕", "all the kisses 💗", "forever yours 💖"];
kissBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    kissOut.textContent = kisses[Math.floor(Math.random() * kisses.length)];
    kissOut.style.animation = "none";
    void kissOut.offsetWidth;
    kissOut.style.animation = "fadeIn 0.3s ease";
    burstHearts(25, window.innerWidth / 2, window.innerHeight / 2);
});
// Canvas animations logic...
const starsCanvas = document.getElementById("starsCanvas");
const starsCtx = starsCanvas.getContext("2d");
const bgHeartsCanvas = document.getElementById("bgHearts");
const bgHeartsCtx = bgHeartsCanvas.getContext("2d");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
const heartRainCanvas = document.getElementById("heartRain");
const heartRainCtx = heartRainCanvas.getContext("2d");
let W = 0, H = 0, DPR = 1, stars = [], bgHearts = [], confetti = [], rainDrops = [];
let isRaining = false, rainIntensity = 0;
function resizeCanvases() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    [starsCanvas, bgHeartsCanvas, confettiCanvas, heartRainCanvas].forEach(c => {
        c.width = Math.floor(W * DPR);
        c.height = Math.floor(H * DPR);
        c.style.width = W + "px";
        c.style.height = H + "px";
    });
    starsCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bgHeartsCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    confettiCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    heartRainCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initStars();
}
window.addEventListener("resize", resizeCanvases);
resizeCanvases();
function initStars() {
    stars = [];
    for (let i = 0; i < Math.floor((W * H) / 6000); i++) {
        stars.push({ x: Math.random() * W, y: Math.random() * H, size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.3, speed: Math.random() * 0.02 + 0.01, phase: Math.random() * Math.PI * 2 });
    }
}
function drawStars() {
    starsCtx.clearRect(0, 0, W, H);
    const time = Date.now() * 0.001;
    stars.forEach(s => {
        starsCtx.globalAlpha = s.alpha * (Math.sin(time * s.speed + s.phase) * 0.3 + 0.7);
        starsCtx.fillStyle = "#fff";
        starsCtx.beginPath();
        starsCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        starsCtx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();
const heartEmojis = ["💗", "💖", "💕", "💓", "💞", "💘", "❤️", "🩷"];
function initBgHearts() {
    bgHearts = [];
    for (let i = 0; i < 35; i++) {
        bgHearts.push({ x: Math.random() * W, y: Math.random() * H, size: 12 + Math.random() * 20, vy: -(0.3 + Math.random() * 0.5), vx: (Math.random() - 0.5) * 0.3, alpha: 0.1 + Math.random() * 0.2, emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)], rotation: Math.random() * 0.5 - 0.25, angle: 0 });
    }
}
initBgHearts();
function drawBgHearts() {
    bgHeartsCtx.clearRect(0, 0, W, H);
    bgHearts.forEach(h => {
        h.y += h.vy;
        h.x += h.vx + Math.sin(Date.now() * 0.001 + h.x) * 0.2;
        h.angle += h.rotation * 0.02;
        if (h.y < -40) { h.y = H + 40; h.x = Math.random() * W; }
        bgHeartsCtx.save();
        bgHeartsCtx.globalAlpha = h.alpha;
        bgHeartsCtx.translate(h.x, h.y);
        bgHeartsCtx.rotate(h.angle);
        bgHeartsCtx.font = `${h.size}px ui-sans-serif`;
        bgHeartsCtx.textAlign = "center";
        bgHeartsCtx.textBaseline = "middle";
        bgHeartsCtx.fillText(h.emoji, 0, 0);
        bgHeartsCtx.restore();
    });
    requestAnimationFrame(drawBgHearts);
}
drawBgHearts();
function startConfetti(n = 200) {
    const emojis = ["✨", "💖", "💗", "💕", "🎉", "💫", "🩷", "💓"];
    for (let i = 0; i < n; i++) {
        confetti.push({ x: W / 2 + (Math.random() * 300 - 150), y: H / 2 + (Math.random() * 150 - 75), vx: (Math.random() - 0.5) * 18, vy: Math.random() * -16 - 8, alpha: 1, size: 14 + Math.random() * 18, rotation: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.4, emoji: emojis[Math.floor(Math.random() * emojis.length)], gravity: 0.25 + Math.random() * 0.1 });
    }
}
function burstHearts(n = 40, cx = W / 2, cy = H / 2) {
    const emojis = ["💖", "💗", "💕", "💓", "💞", "🩷"];
    for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const speed = 4 + Math.random() * 8;
        confetti.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3, alpha: 1, size: 16 + Math.random() * 20, rotation: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.4, emoji: emojis[Math.floor(Math.random() * emojis.length)], gravity: 0.2 });
    }
}
function tickConfetti() {
    confettiCtx.clearRect(0, 0, W, H);
    confetti.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.99; p.rotation += p.spin; p.alpha *= 0.985;
        confettiCtx.save();
        confettiCtx.globalAlpha = p.alpha;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation);
        confettiCtx.font = `${p.size}px ui-sans-serif`;
        confettiCtx.textAlign = "center";
        confettiCtx.textBaseline = "middle";
        confettiCtx.fillText(p.emoji, 0, 0);
        confettiCtx.restore();
    });
    confetti = confetti.filter(p => p.alpha > 0.03 && p.y < H + 80);
    requestAnimationFrame(tickConfetti);
}
tickConfetti();
function startHeartRain(intensity = 1) { isRaining = true; rainIntensity = intensity; }
function stopHeartRain() { isRaining = false; rainIntensity = 0; }
function tickHeartRain() {
    heartRainCtx.clearRect(0, 0, W, H);
    if (isRaining) {
        const emojis = ["💖", "💗", "💕", "💓", "🩷"];
        for (let i = 0; i < Math.floor(8 * rainIntensity); i++) {
            rainDrops.push({ x: Math.random() * W, y: -40, vy: 3 + Math.random() * 6, vx: (Math.random() - 0.5) * 2, alpha: 0.7 + Math.random() * 0.3, size: 16 + Math.random() * 24, emoji: emojis[Math.floor(Math.random() * emojis.length)], rotation: Math.random() * 0.5 - 0.25, angle: 0 });
        }
    }
    rainDrops.forEach(d => {
        d.x += d.vx; d.y += d.vy; d.alpha *= 0.998; d.angle += d.rotation * 0.1;
        heartRainCtx.save();
        heartRainCtx.globalAlpha = d.alpha;
        heartRainCtx.translate(d.x, d.y);
        heartRainCtx.rotate(d.angle);
        heartRainCtx.font = `${d.size}px ui-sans-serif`;
        heartRainCtx.textAlign = "center";
        heartRainCtx.textBaseline = "middle";
        heartRainCtx.fillText(d.emoji, 0, 0);
        heartRainCtx.restore();
    });
    rainDrops = rainDrops.filter(d => d.y < H + 80 && d.alpha > 0.05);
    requestAnimationFrame(tickHeartRain);
}
tickHeartRain();
// Cursor trail
let lastHeartTime = 0;
document.addEventListener("mousemove", (e) => {
    cursorHeart.style.left = e.clientX + "px";
    cursorHeart.style.top = e.clientY + "px";
    cursorHeart.style.opacity = "1";
    if (Date.now() - lastHeartTime > 80) {
        const heart = document.createElement("div");
        heart.textContent = "💕";
        heart.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:16px;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);animation:trailFade 1s ease forwards;`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
        lastHeartTime = Date.now();
    }
});
document.addEventListener("mouseleave", () => { cursorHeart.style.opacity = "0"; });
const trailStyle = document.createElement("style");
trailStyle.textContent = `@keyframes trailFade{0%{opacity:0.8;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-80%) scale(0.5);}}`;
document.head.appendChild(trailStyle);
document.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest(".paper")) return;
    burstHearts(8, e.clientX, e.clientY);
});
document.addEventListener("scroll", () => {
    const aurora = document.querySelector(".bg-aurora");
    if (aurora) aurora.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});
console.log(`💖💖💖 Made with love for ${HER_NAME} 💖💖💖`);
