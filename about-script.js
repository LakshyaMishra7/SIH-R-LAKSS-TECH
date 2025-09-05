document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     NAVBAR SMOOTH SCROLL
  ---------------------------- */
  document.querySelectorAll(".nav-center a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");

      // Only intercept if it is a hash link (e.g., #section-id)
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
      // Otherwise, let browser follow link normally (for other pages)
    });
  });

  /* ---------------------------
     MODAL FUNCTIONALITY
  ---------------------------- */
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  if (modal && modalContent) {
    document.querySelectorAll(".archive-column").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-narrate")) return;
        const description = card.querySelector(".description");
        if (description) {
          modalContent.innerHTML = description.innerHTML;
          modal.classList.add("open");
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () => modal.classList.remove("open"));
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  const narratorBtn = document.getElementById("narrator-btn");
  let narratorOn = true;

  function speak(text, callback) {
    if (!narratorOn) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.onend = () => { if (callback) callback(); };
    window.speechSynthesis.speak(utter);
  }

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      window.speechSynthesis.cancel();
      narratorBtn.innerHTML = narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
    });
  }
});
