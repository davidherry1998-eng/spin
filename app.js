const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultBox = document.getElementById("result");
const mainBtn = document.getElementById("mainBtn");

const whatsappNumber = "995555939377";

const prizes = [
  { text: "30% BONUS", weight: 80, color: "#0f7cff" },
  { text: "50% BONUS", weight: 5, color: "#ffd76a" },
  { text: "40% BONUS", weight: 5, color: "#8d5cff" },
  { text: "20% BONUS", weight: 5, color: "#13d66f" },
  { text: "10% BONUS", weight: 5, color: "#ff7a2f" },
  { text: "BİR DƏ SINA", weight: 0, color: "#20283a" }
];

let rotation = 0;
let spinning = false;

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 12;
  const slice = (Math.PI * 2) / prizes.length;

  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < prizes.length; i++) {
    const start = rotation + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = prizes[i].color;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(prizes[i].text, radius - 20, 8);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffd76a";
  ctx.lineWidth = 8;
  ctx.shadowColor = "rgba(255,215,100,0.8)";
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function weightedPrizeIndex() {
  const weighted = prizes.filter(p => p.weight > 0);
  const total = weighted.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * total;

  for (const prize of weighted) {
    random -= prize.weight;
    if (random <= 0) {
      return prizes.indexOf(prize);
    }
  }

  return 0;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  resultBox.className = "result";
  resultBox.textContent = "Çarx fırlanır...";

  const selectedIndex = weightedPrizeIndex();
  const slice = (Math.PI * 2) / prizes.length;

  const pointerAngle = -Math.PI / 2;
  const selectedCenter = selectedIndex * slice + slice / 2;

  const extraSpins = 7 + Math.floor(Math.random() * 4);
  const targetRotation =
    rotation +
    extraSpins * Math.PI * 2 +
    pointerAngle -
    selectedCenter;

  const startRotation = rotation;
  const change = targetRotation - startRotation;
  const duration = 3200 + Math.random() * 1200;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    rotation = startRotation + change * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation = targetRotation % (Math.PI * 2);
      drawWheel();

      const prize = prizes[selectedIndex].text;
      resultBox.className = "result win";
      resultBox.textContent = `Təbriklər! Sənin nəticən: ${prize}`;

      spinning = false;
      spinBtn.disabled = false;
    }
  }

  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", spinWheel);

mainBtn.addEventListener("click", () => {
  const message = encodeURIComponent(
    "Salam, minimum 20 AZN depozit edib çarx fırlatma şansı əldə etmək istəyirəm."
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
});

drawWheel();
