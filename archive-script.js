  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");


document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     PARALLAX HERO SCROLL
  ========================== */
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
  }

  /* =========================
     NARRATOR SETUP
     (Handled ONLY by archive-script.js)
  ========================== */
  window.narratorOn = true; // Global flag for chatbot.js to use
  let isSpeaking = false;   // track speech state

  const narratorBtn = document.getElementById("narrator-btn");

  window.speak = function(text) {
    if (!window.narratorOn || !text) return;
    window.speechSynthesis.cancel(); // stop any ongoing speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.lang = "en-IN";
    utter.onstart = () => (isSpeaking = true);
    utter.onend = () => (isSpeaking = false);
    window.speechSynthesis.speak(utter);
  };

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      window.narratorOn = !window.narratorOn;
      window.speechSynthesis.cancel();
      isSpeaking = false;
      narratorBtn.innerHTML = window.narratorOn
        ? "🔊 Narrator: On"
        : "🔇 Narrator: Off";
      if (window.narratorOn) window.speak("Narrator enabled.");
    });
  }

  /* =========================
     CARD NARRATION BUTTONS
  ========================== */
  document.querySelectorAll(".archive-column").forEach(card => {
    const btn = document.createElement("button");
    btn.textContent = "🔊 Narrate";
    btn.className = "card-narrate";
    card.appendChild(btn);

    btn.addEventListener("click", () => {
      if (!window.narratorOn) return;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        return;
      }
      const texts = Array.from(card.querySelectorAll("h2, h3, p, li"))
        .map(el => el.textContent.trim())
        .filter(Boolean)
        .join(". ");
      window.speak(texts);
    });
  });

