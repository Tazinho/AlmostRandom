const markedScript = document.createElement("script"); /*Markdown rendering*/
markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(markedScript);

document.addEventListener("DOMContentLoaded", () => {

  const html = `
    <button id="ask-ai-button" aria-label="Ask AI">
      ✨ Ask AI
    </button>

    <div id="ask-ai-window">
      <div class="ask-ai-header">
        <div>
          <strong>Ask AI ✨</strong>
          <small>Ask about Malte, his work, or this website.</small>
        </div>
        <button id="ask-ai-close">×</button>
      </div>

      <div id="ask-ai-messages">
        <div class="ai-message">
          Hi! I'm an AI assistant for Malte's website.
          What would you like to know?
        </div>
      </div>

      <form id="ask-ai-form">
        <input
          id="ask-ai-input"
          type="text"
          placeholder="Ask a question…"
          autocomplete="off"
        >
        <button type="submit">↑</button>
      </form>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const button = document.getElementById("ask-ai-button");
  const windowEl = document.getElementById("ask-ai-window");
  const close = document.getElementById("ask-ai-close");
  const form = document.getElementById("ask-ai-form");
  const input = document.getElementById("ask-ai-input");
  const messages = document.getElementById("ask-ai-messages");

  button.onclick = () => {
    windowEl.classList.add("open");
    input.focus();
  };

  close.onclick = () => {
    windowEl.classList.remove("open");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = input.value.trim();
    if (!question) return;

    appendMessage(question, "user-message");
    input.value = "";

    const loading = appendMessage("Thinking…", "ai-message");

    try {
      const response = await fetch(
        "https://malte-ai.malte-grosser.workers.dev", /*"YOUR-CLOUDFLARE-WORKER-URL"*/
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: question
          })
        }
      );

      const data = await response.json();

      if (window.marked && data.answer) {
        loading.innerHTML = marked.parse(data.answer);
      } else {
        loading.textContent =
        data.answer || "Sorry, I couldn't answer that.";
      }

    } catch (error) {
      loading.textContent =
        "Sorry, the AI assistant is currently unavailable.";
    }
  });

  function appendMessage(text, className) {
    const element = document.createElement("div");
    element.className = className;
    element.textContent = text;

    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;

    return element;
  }
});