/* =========================
   CARD TOGGLE HANDLING
========================= */
document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("open");
    btn.textContent = content.classList.contains("open")
      ? "Hide Details"
      : "View Details";
  });
});

/* ---------------------------
     NARRATOR SETUP
---------------------------- */
const narratorBtn = document.getElementById("narrator-btn");
let narratorOn = true;

// Generic speak function with callback
function speak(text, callback) {
  if (!narratorOn) return;
  window.speechSynthesis.cancel(); // stop previous speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  utter.pitch = 1.0;
  utter.onend = () => {
    if (callback) callback();
  };
  speechSynthesis.speak(utter);
}

if (narratorBtn) {
  narratorBtn.addEventListener("click", () => {
    narratorOn = !narratorOn;
    window.speechSynthesis.cancel(); // stop any ongoing speech
    narratorBtn.innerHTML = narratorOn
      ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
      : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
  });
}

