/* =========================
   ARCHIVE PAGE SCRIPT
========================= */

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
     (keeps global flag for chatbot.js)
  ========================== */
  window.narratorOn = true; // global flag for all scripts
  let isSpeaking = false; // track speech state

  const narratorBtn = document.getElementById("narrator-btn");

  window.speak = function (text) {
    if (!window.narratorOn || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
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

      // Stop current speech if already speaking
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

  /* =========================
     CHATBOT LOGIC
     (uses global narratorOn & speak)
  ========================== */
  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  if (chatbotBtn && chatbotWindow) {
    chatbotBtn.addEventListener("click", () => {
      chatbotWindow.classList.toggle("open");
    });
  }

  function appendMessage(sender, text) {
    if (!chatMessages) return;
    const p = document.createElement("p");
    p.innerHTML = `<b>${sender}:</b> ${text}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "Bot") window.speak(text);
  }

  function botReply(userMessage) {
    let reply = "I'm still learning! Can you ask me about monasteries or tours?";
    const msg = userMessage.toLowerCase();

    if (msg.includes("hello")) reply = "Hi there! 👋";
    else if (msg.includes("monastery"))
      reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
    else if (msg.includes("route"))
      reply = "You can plan your tour by adding stops on the map. I can guide you!";

    appendMessage("Bot", reply);
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (text) {
        appendMessage("You", text);
        chatInput.value = "";
        setTimeout(() => botReply(text), 500);
      }
    });

    chatInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendBtn.click();
    });
  }
});
