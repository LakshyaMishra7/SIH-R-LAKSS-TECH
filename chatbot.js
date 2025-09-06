/* =========================
   CHATBOT IMPLEMENTATION
========================= */

// 🔹 unique session id (persists across pages)
let sessionId = localStorage.getItem("chatbotSessionId");
if (!sessionId) {
  sessionId = "sess-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
  localStorage.setItem("chatbotSessionId", sessionId);
}

// 🔹 get elements
const chatbotBtn = document.getElementById("chatbot-btn");
const chatbotWindow = document.getElementById("chatbot-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");

// 🔹 restore saved chat
function restoreChat() {
  const saved = localStorage.getItem("chatbotMessages");
  if (saved && chatMessages) {
    chatMessages.innerHTML = saved;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// 🔹 save chat
function saveChat() {
  if (chatMessages) {
    localStorage.setItem("chatbotMessages", chatMessages.innerHTML);
  }
}

/* ---------------------------
   CHATBOT OPEN/CLOSE TOGGLE
---------------------------- */
if (chatbotBtn && chatbotWindow) {
  chatbotBtn.addEventListener("click", () => {
    chatbotWindow.classList.toggle("open");
    if (chatbotWindow.classList.contains("open")) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
}

/* ---------------------------
   APPEND + (OPTIONAL) SPEAK
---------------------------- */
function appendMessage(sender, text) {
  if (!chatMessages) return;
  const p = document.createElement("p");
  p.innerHTML = `<b>${sender}:</b> ${text}`;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChat();

  // Speak only if narrator is ON and sender is bot
  if (sender === "Bot" && window.narratorOn) {
    window.speechSynthesis.cancel(); // stop any previous speech
    window.speak(text);
  }
}

/* ---------------------------
   SIMPLE BOT LOGIC (Fallback)
---------------------------- */
function localBotReply(userText) {
  let reply = "I'm still learning! Can you ask me about monasteries?";
  const text = userText.toLowerCase();

  if (text.includes("hello")) reply = "Hi there! 👋";
  if (text.includes("monastery"))
    reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
  if (text.includes("route"))
    reply = "You can use the map feature to plan a travel route easily.";

  appendMessage("Bot", reply);
}

/* ---------------------------
   WEBHOOK BOT REPLY (n8n)
---------------------------- */
async function botReply(userMessage) {
  try {
    const res = await fetch("http://localhost:5678/webhook/support-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionId,
        query: userMessage
      })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    const reply = data.answer || null;

    if (reply) {
      appendMessage("Bot", reply);
    } else {
      localBotReply(userMessage); // fallback
    }
  } catch (err) {
    console.warn("Bot server unreachable. Using local fallback.");
    localBotReply(userMessage);
  }
}

/* ---------------------------
   SEND BUTTON & ENTER KEY
---------------------------- */
if (sendBtn && chatInput) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage("You", text);
    chatInput.value = "";
    botReply(text);
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
}

// 🔹 restore chat on page load
restoreChat();
