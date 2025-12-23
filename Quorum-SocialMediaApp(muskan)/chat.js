// chat.js
document.addEventListener("DOMContentLoaded", () => {
    // 1️⃣ Read name from URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "Unknown User";

    // 2️⃣ Compute initials (first letters of first two words)
    let initials = "?";
    if (name && name.trim().length > 0) {
        const words = name.trim().split(/\s+/);
        initials = words.length > 1
            ? (words[0][0] + words[1][0])
            : words[0][0];
        initials = initials.toUpperCase();
    }

    // 3️⃣ Update header (name + avatar)
    const nameEl = document.getElementById("chat-name");
    const avatarEl = document.getElementById("chat-avatar");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = initials;

    // 4️⃣ Load messages from localStorage (per user)
    const chatBox = document.getElementById("chat-messages");
    if (!chatBox) return;

    // ✅ Initialize default messages if none exist
    if (!localStorage.getItem(name)) {
        const defaultMessages = [
            { sender: "received", text: "Hey there!" },
            { sender: "sent", text: "Hi! How’s everything?" }
        ];
        localStorage.setItem(name, JSON.stringify(defaultMessages));
    }

    let messages = JSON.parse(localStorage.getItem(name));

    // 5️⃣ Render messages (no names or timestamps)
    function renderMessages() {
        chatBox.innerHTML = "";
        messages.forEach(msg => {
            const el = document.createElement("div");
            el.className = `message ${msg.sender}`;
            el.innerHTML = `
                <div class="bubble">
                    <p>${escapeHtml(msg.text)}</p>
                </div>
            `;
            chatBox.appendChild(el);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderMessages();

    // 6️⃣ Sending logic
    const input = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-button");

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const newMsg = { sender: "sent", text };
        messages.push(newMsg);
        localStorage.setItem(name, JSON.stringify(messages));
        renderMessages();
        input.value = "";

        // Array of different replies
        const replies = [
            "Got it 👍",
            "Thanks for the info!",
            "Okay, noted.",
            "Sounds good!",
            "I'll get back to you.",
            "Understood.",
            "Alright!",
            "Great, thanks!"
        ];

        // Simulated reply
        setTimeout(() => {
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            const reply = { sender: "received", text: replyText };
            messages.push(reply);
            localStorage.setItem(name, JSON.stringify(messages));
            renderMessages();
        }, 1200);
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // 7️⃣ Escape HTML helper
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});