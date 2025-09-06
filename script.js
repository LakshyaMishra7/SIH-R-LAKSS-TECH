document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  let narratorOn = true;
  const narratorBtn = document.getElementById("narrator-btn");

  function speak(text, callback) {
    if (!narratorOn) return;
    window.speechSynthesis.cancel(); // stop previous speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.lang = "en-IN";
    utter.onend = () => {
      if (callback) callback();
    };
    speechSynthesis.speak(utter);
  }

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      window.speechSynthesis.cancel(); // stop any current speech
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
     SMOOTH SCROLL ON NAVBAR + FEATURE NARRATION
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

      // Narrate features section
      if (targetHref.includes("features") && narratorOn) {
        window.speechSynthesis.cancel();
        speak("Hey there, these are the features we have listed below.", () => {
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

    // Add narration button for each card
    cards.forEach((card) => {
      const narrateBtn = document.createElement("button");
      narrateBtn.className = "card-narrate";
      narrateBtn.textContent = "🔊 Narrate";
      card.appendChild(narrateBtn);

      let isReading = false;
      narrateBtn.addEventListener("click", () => {
        if (isReading) {
          window.speechSynthesis.cancel();
          isReading = false;
          narrateBtn.textContent = "🔊 Narrate";
        } else {
          const texts = Array.from(card.querySelectorAll("h3, p, li"))
            .map((el) => el.textContent)
            .join(". ");
          speak(texts, () => {
            isReading = false;
            narrateBtn.textContent = "🔊 Narrate";
          });
          isReading = true;
          narrateBtn.textContent = "⏹ Stop";
        }
      });
    });
  }

