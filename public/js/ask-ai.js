document.addEventListener(
  "DOMContentLoaded",
  () => {

    // --------------------------------------------------
    // Configuration
    // --------------------------------------------------

    const WORKER_URL =
      "https://malte-ai.malte-grosser.workers.dev";


    // --------------------------------------------------
    // Load Markdown + HTML sanitization
    // --------------------------------------------------

    function loadScript(src) {
      return new Promise((resolve, reject) => {

        const script =
          document.createElement("script");

        script.src = src;
        script.async = true;

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
      });
    }


    const markdownReady = Promise.all([
      loadScript(
        "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
      ),
      loadScript(
        "https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"
      )
    ]).catch(error => {
      console.warn(
        "Markdown libraries could not be loaded:",
        error
      );
    });


    // --------------------------------------------------
    // Create chat UI
    // --------------------------------------------------

    const html = `
      <button
        id="ask-ai-button"
        aria-label="Ask AI"
      >
        ✨ Ask AI
      </button>

      <div
        id="ask-ai-window"
        role="dialog"
        aria-label="Ask AI"
      >

        <div class="ask-ai-header">

          <div>
            <strong>Ask AI ✨</strong>

            <small>
              Ask about Malte, his work,
              or this website.
            </small>
          </div>

          <button
            id="ask-ai-close"
            type="button"
            aria-label="Close chat"
          >
            ×
          </button>

        </div>

        <div id="ask-ai-messages">

          <div class="ai-message">
            Hi! I'm an AI assistant for
            Malte's website. What would
            you like to know?
          </div>

        </div>

        <form id="ask-ai-form">

          <input
            id="ask-ai-input"
            type="text"
            placeholder="Ask a question..."
            autocomplete="off"
            maxlength="1000"
            aria-label="Ask a question"
          >

          <button
            type="submit"
            aria-label="Send question"
          >
            ↑
          </button>

        </form>

      </div>
    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      html
    );


    // --------------------------------------------------
    // Elements
    // --------------------------------------------------

    const button =
      document.getElementById(
        "ask-ai-button"
      );

    const windowEl =
      document.getElementById(
        "ask-ai-window"
      );

    const close =
      document.getElementById(
        "ask-ai-close"
      );

    const form =
      document.getElementById(
        "ask-ai-form"
      );

    const input =
      document.getElementById(
        "ask-ai-input"
      );

    const messages =
      document.getElementById(
        "ask-ai-messages"
      );


    // --------------------------------------------------
    // Open / close
    // --------------------------------------------------

    button.addEventListener(
      "click",
      () => {
        windowEl.classList.add("open");
        input.focus();
      }
    );


    close.addEventListener(
      "click",
      () => {
        windowEl.classList.remove("open");
      }
    );


    // --------------------------------------------------
    // Helper: append message
    // --------------------------------------------------

    function appendMessage(
      text,
      className
    ) {

      const element =
        document.createElement("div");

      element.className = className;
      element.textContent = text;

      messages.appendChild(element);

      messages.scrollTop =
        messages.scrollHeight;

      return element;
    }


    // --------------------------------------------------
    // Helper: safely render Markdown
    // --------------------------------------------------

    async function renderAnswer(
      element,
      text
    ) {

      await markdownReady;

      if (
        window.marked &&
        window.DOMPurify
      ) {

        const rendered =
          marked.parse(text);

        element.innerHTML =
          DOMPurify.sanitize(rendered);

      } else {

        // Safe fallback if CDN loading fails
        element.textContent = text;
      }

      messages.scrollTop =
        messages.scrollHeight;
    }


    // --------------------------------------------------
    // Submit question
    // --------------------------------------------------

    form.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const question =
          input.value.trim();

        if (!question) {
          return;
        }


        // Client-side max length.
        // The Worker independently checks this too.
        if (question.length > 1000) {
          return;
        }


        appendMessage(
          question,
          "user-message"
        );

        input.value = "";
        input.disabled = true;


        const loading =
          appendMessage(
            "Thinking…",
            "ai-message"
          );


        try {

          const response = await fetch(
            WORKER_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                message: question
              })
            }
          );


          // --------------------------------------------
          // Read response
          // --------------------------------------------

          const data =
            await response.json();


          // --------------------------------------------
          // Worker returned an error
          // --------------------------------------------

          if (!response.ok) {

            console.error(
              "AI request failed:",
              response.status,
              data
            );

            loading.textContent =
              data.error ||
              "Sorry, the AI assistant is currently unavailable.";

            return;
          }


          // --------------------------------------------
          // Successful answer
          // --------------------------------------------

          if (data.answer) {

            await renderAnswer(
              loading,
              data.answer
            );

          } else {

            loading.textContent =
              "Sorry, I couldn't answer that.";
          }


        } catch (error) {

          console.error(
            "AI request error:",
            error
          );

          loading.textContent =
            "Sorry, the AI assistant is currently unavailable.";

        } finally {

          input.disabled = false;
          input.focus();
        }
      }
    );
  }
);