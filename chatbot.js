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

// 🔹 open/close toggle
if (chatbotBtn && chatbotWindow) {
  chatbotBtn.addEventListener("click", () => {
    chatbotWindow.classList.toggle("open");
  });
}

// 🔹 append a message
function appendMessage(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<b>${sender}:</b> ${text}`;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChat();

  // speak only bot replies
  if (sender === "Bot") speak(text);
}

// 🔹 call your n8n webhook
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

    const data = await res.json();
    const reply = data.answer || "Sorry, I didn't understand that.";
    appendMessage("Bot", reply);
  } catch (err) {
    console.error(err);
    appendMessage("Bot", "⚠️ Error connecting to server.");
  }
}

// 🔹 send button
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text) {
      appendMessage("You", text);
      chatInput.value = "";
      botReply(text);
    }
  });
}

// 🔹 enter key
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
}

// 🔹 restore chat when page loads
restoreChat();

// 🔹 speech synthesis (keep your animation effect intact)
function speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}
