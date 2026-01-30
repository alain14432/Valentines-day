// ---- Customize ----
const HER_NAME = "Her Name";
const YOUR_NAME = "Your Name";
const TYPE_TEXT =
  "I know we’re far apart… but you still feel like my favorite place to be. So I made you something small but real.";
// -------------------

document.getElementById("herName").textContent = HER_NAME;
document.getElementById("toName").textContent = HER_NAME;
document.getElementById("fromName").textContent = YOUR_NAME;
document.getElementById("sigName").textContent = YOUR_NAME;
document.getElementById("footerName").textContent = YOUR_NAME;

// Typewriter
const typeEl = document.getElementById("typeLine");
let i = 0;
(function typeLoop(){
  typeEl.textContent = TYPE_TEXT.slice(0, i++);
  if (i <= TYPE_TEXT.length) requestAnimationFrame(typeLoop);
})();

// Envelope open
const envelope = document.getElementById("envelope");
document.getElementById("openBtn").addEventListener("click", () => {
  envelope.classList.toggle("open");
});

// Yes/No
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const yesBox = document.getElementById("yesBox");

yesBtn.addEventListener("click", () => {
  yesBox.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.textContent = "YES 💖 (locked in)";
  launchConfetti(160);
});

noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("click", dodgeNo);

function dodgeNo(){
  const pad = 16;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;

  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  const lines = ["no 😶", "be serious 😌", "try again 😭", "nice try 😈", "that button is broken 🤭"];
  noBtn.textContent = lines[Math.floor(Math.random()*lines.length)];
}

// Confetti (canvas)
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let W, H, pieces = [];
function resize(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  W = window.innerWidth;
  H = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function launchConfetti(n=120){
  for(let i=0;i<n;i++){
    pieces.push({
      x: W/2 + (Math.random()*140-70),
      y: H/2 + (Math.random()*60-30),
      vx: (Math.random()*2-1)*6,
      vy: (Math.random()*-1)*10 - 6,
      r: 2 + Math.random()*4,
      a: 1,
      spin: (Math.random()*2-1)*0.25,
      rot: Math.random()*Math.PI,
      t: 0,
      emoji: Math.random() > 0.6 ? "💖" : (Math.random() > 0.3 ? "💗" : "✨")
    });
  }
}

function tick(){
  ctx.clearRect(0,0,W,H);
  for(const p of pieces){
    p.t += 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.rot += p.spin;
    p.a *= 0.985;

    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = `${14 + p.r*2}px ui-sans-serif`;
    ctx.fillText(p.emoji, -6, 6);
    ctx.restore();
  }
  pieces = pieces.filter(p => p.a > 0.05 && p.y < H + 40);
  requestAnimationFrame(tick);
}
tick();
