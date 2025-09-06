// script.js
document.addEventListener("DOMContentLoaded", () => {
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
     SMOOTH SCROLL ON NAVBAR
  ---------------------------- */
  const navLinks = document.querySelectorAll(".navbar a[href^='#'], .navbar a");
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
      if (typeof narratorOn !== "undefined" && targetHref.includes("features") && narratorOn) {
        window.speechSynthesis.cancel();
        speak("Hey there, these are the features which we have listed down below", () => {
          const cards = document.querySelectorAll("#features .card h3");
          readCardsSequentially(cards, 0);
        });
      }
    });
  });

  /* ---------------------------
     NARRATOR TOGGLE
  ---------------------------- */
  const narratorBtn = document.getElementById("narrator-btn");
  window.narratorOn = true; // ✅ make it global so chatbot.js can access it

  window.speak = function (text, callback) {
    if (!window.narratorOn) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.onend = () => callback && callback();
    speechSynthesis.speak(utter);
  };

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      window.narratorOn = !window.narratorOn;
      window.speechSynthesis.cancel();
      narratorBtn.innerHTML = window.narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
    });
  }

  /* ---------------------------
     CARD SLIDE-IN ON SCROLL
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
          if (title && window.narratorOn) speak(title.textContent);
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }
});
