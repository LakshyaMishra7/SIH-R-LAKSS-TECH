document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  let narratorOn = true;
  const narratorBtn = document.getElementById("narrator-btn");

  // Unified speech function
  function speak(text, callback) {
    if (!narratorOn || !text) return;
    window.speechSynthesis.cancel(); // stop any previous speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.lang = "en-IN";
    utter.onend = () => callback && callback();
    speechSynthesis.speak(utter);
  }

  // Toggle narrator button
  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      window.speechSynthesis.cancel(); // stop immediately
      narratorBtn.innerHTML = narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
    });
  }

  /* ---------------------------
     HERO TEXT FADE + SLIDE IN
  ---------------------------- */
  const heroText = document.querySelector(".hero-text");
  if (heroText) {
    heroText.style.opacity = 0;
    heroText.style.transform = "translateY(40px)";
    setTimeout(() => {
      heroText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
      heroText.style.opacity = 1;
      heroText.style.transform = "translateY(0)";
    }, 300);
  }

  /* ---------------------------
     NAVBAR SCROLL EFFECT
  ---------------------------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  /* ---------------------------
     SMOOTH SCROLL ON NAVBAR + FEATURE READING
  ---------------------------- */
  const navLinks = document.querySelectorAll(".navbar a[href^='#']");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetHref = link.getAttribute("href");
      if (targetHref.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.getElementById(targetHref.substring(1));
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - 70,
            behavior: "smooth",
          });
        }
      }

      // Narrate features section when clicked
      if (targetHref.includes("features") && narratorOn) {
        window.speechSynthesis.cancel();
        speak("Here are the features we have listed below.", () => {
          const cards = document.querySelectorAll("#features .card h3");
          readCardsSequentially(cards, 0);
        });
      }
    });
  });

  function readCardsSequentially(cards, index) {
    if (index >= cards.length) return;
    speak(cards[index].textContent, () =>
      readCardsSequentially(cards, index + 1)
    );
  }

  /* ---------------------------
     CARD SLIDE-IN + NARRATION
  ---------------------------- */
  const cards = document.querySelectorAll(".card");
  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);

          const title = entry.target.querySelector("h3");
          if (title && narratorOn) speak(title.textContent);
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }

  /* ---------------------------
     CHATBOT OPEN/CLOSE + REPLIES
  ---------------------------- */
  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  if (chatbotBtn && chatbotWindow) {
    chatbotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chatbotWindow.classList.toggle("open");
      if (chatbotWindow.classList.contains("open")) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }

  function addMessage(sender, message) {
    const msg = document.createElement("p");
    msg.innerHTML = `<b>${sender}:</b> ${message}`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (sender === "Bot" && narratorOn) speak(message);
  }

  function botReply(userText) {
    if (!userText.trim()) return;
    addMessage("You", userText);

    setTimeout(() => {
      let reply = "I’m still learning! Try asking about monasteries or routes.";
      const lower = userText.toLowerCase();
      if (lower.includes("monastery")) {
        reply = "There are over 200 monasteries in Sikkim! Rumtek is the largest.";
      } else if (lower.includes("route")) {
        reply = "You can plan your route using the map feature below.";
      }
      addMessage("Bot", reply);
    }, 500);
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
      botReply(chatInput.value);
      chatInput.value = "";
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        botReply(chatInput.value);
        chatInput.value = "";
      }
    });
  }

  /* ---------------------------
     EXPOSE GLOBAL NARRATE HOOK (for map page)
  ---------------------------- */
  window.narrateAction = (text) => speak(text);
});
