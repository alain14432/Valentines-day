// ---- Personalize these ----
const HER_NAME = "your girl";      // e.g. "Maya"
const YOUR_NAME = "your name";     // e.g. "Jay"
const TYPE_TEXT = [
  "I wish I could hand you flowers in person…",
  "but for now I’m sending you this little corner of the internet.",
  "Because you make my world feel softer and brighter.",
  "So I have one important question…"
].join(" ");
// ---------------------------

document.getElementById("name").textContent = HER_NAME;
document.getElementById("from").textContent = YOUR_NAME;

// Typewriter
const typeEl = document.getElementById("type");
let i = 0;
(function typeLoop(){
  typeEl.textContent = TYPE_TEXT.slice(0, i++);
  if (i <= TYPE_TEXT.length) requestAnimationFrame(typeLoop);
})();

// YES / NO behavior
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const result = document.getElementById("result");

yesBtn.addEventListener("click", () => {
  result.classList.remove("hidden");
  burstHearts(120);
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.textContent = "YES 💖 (locked in)";
});

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", dodge);

function dodge(){
  const pad = 18;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;

  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.textContent = ["no 😶", "try again 😭", "be serious 😌", "nice try 😈"][Math.floor(Math.random()*4)];
}

// Cute heart confetti burst (DOM)
function burstHearts(n=80){
  for(let k=0;k<n;k++){
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.5 ? "💖" : "💗";
    s.style.position = "fixed";
    s.style.left = (window.innerWidth/2 + (Math.random()*240-120))+"px";
    s.style.top  = (window.innerHeight/2 + (Math.random()*80-40))+"px";
    s.style.fontSize = (14 + Math.random()*22) + "px";
    s.style.zIndex = 9999;
    s.style.pointerEvents = "none";
    document.body.appendChild(s);

    const dx = (Math.random()*2-1) * 280;
    const dy = (Math.random()*-1) * 380 - 80;
    const rot = (Math.random()*2-1)*60;

    s.animate([
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: 1200 + Math.random()*600, easing: "cubic-bezier(.2,.8,.2,1)" })
    .onfinish = () => s.remove();
  }
}

// Background floating hearts (canvas)
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
let W, H, hearts;

function resize(){
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  hearts = Array.from({length: 42}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    r: (6 + Math.random()*10) * devicePixelRatio,
    vy: (0.35 + Math.random()*0.9) * devicePixelRatio,
    vx: (Math.random()*0.35 - 0.175) * devicePixelRatio,
    a: 0.25 + Math.random()*0.35
  }));
}
window.addEventListener("resize", resize);
resize();

function drawHeart(x,y,r,alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x,y);
  ctx.scale(r/18, r/18);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-12, -6, -18, 6, 0, 18);
  ctx.bezierCurveTo(18, 6, 12, -6, 0, 6);
  ctx.closePath();
  ctx.fillStyle = "#ff5aa5";
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);
  for(const h of hearts){
    h.y -= h.vy;
    h.x += h.vx;
    if(h.y < -40) { h.y = H + 40; h.x = Math.random()*W; }
    if(h.x < -40) h.x = W + 40;
    if(h.x > W + 40) h.x = -40;
    drawHeart(h.x,h.y,h.r,h.a);
  }
  requestAnimationFrame(tick);
}
tick();
