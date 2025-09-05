// Add in archive.js
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-image img');
  const scroll = window.scrollY;
  hero.style.transform = `translateY(${scroll * 0.3}px)`;
});

document.querySelectorAll('.archive-column').forEach(card => {
  const btn = document.createElement('button');
  btn.textContent = '🔊 Narrate';
  btn.className = 'card-narrate';
  card.appendChild(btn);

  btn.addEventListener('click', () => {
    const texts = Array.from(card.querySelectorAll('h2,h3,p,li')).map(el => el.textContent).join('. ');
    const utter = new SpeechSynthesisUtterance(texts);
    speechSynthesis.speak(utter);
  });
});

/* =========================
   NARRATOR TOGGLE BUTTON
========================= */
const narratorBtn = document.getElementById("narrator-btn");
if (narratorBtn) {
  narratorBtn.addEventListener("click", () => {
    narratorEnabled = !narratorEnabled;
    narratorBtn.textContent = narratorEnabled
      ? "🔊 Narrator: On"
      : "🔇 Narrator: Off";
    narrator(narratorEnabled ? "Narrator enabled." : "Narrator disabled.");
  });
}

