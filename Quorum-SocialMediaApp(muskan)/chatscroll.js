document.addEventListener("DOMContentLoaded", () => {
  const chatList = document.querySelector(".chat-list-container");
  const trendingList = document.querySelector(".trending");
  const searchBox = document.querySelector(".search-box");

  // ---------------------------
  // 1️⃣ DATA: Chat, Groups, Trends
  // ---------------------------

  const chats = [
    { name: "Kavya Kapoor", img: "kavya.png", time: "2hr ago" },
    { name: "Nidhi Sachdeva", img: "nidhi.png", time: "6hr ago" },
    { name: "Ananya Patel", img: "ananya.png", time: "2d ago" },
    { name: "Vikram Kumar", img: "vikram.png", time: "3d ago" },
    { name: "Sanjay Mehta", img: "sanjay.png", time: "5d ago" },
    { name: "Riya Sharma", img: "riya.png", time: "6d ago" },
    { name: "Kaira", img: "kaira.png", time: "6d ago" }
  ];

  // ---------------------------
  // 2️⃣ RENDER FUNCTION (with images)
  // ---------------------------
  function renderChats(chatArray) {
    chatList.innerHTML = "";
    chatArray.forEach(chat => {
      const card = document.createElement("div");
      card.classList.add("chat-card");
      card.setAttribute("data-chat-name", chat.name);
      card.innerHTML = `
        <div class="chat-left">
          <img src="${chat.img}" alt="${chat.name}" class="avatar">
          <div class="chat-details">
            <span class="chat-name">${chat.name}</span>
          </div>
        </div>
        <div class="chat-time">${chat.time}</div>
      `;
      chatList.appendChild(card);
    });
  }

  let trends = [
    "#QuorumTech – 1248 posts",
    "#CampusLife – 892 posts",
    "#StudyGroup – 567 posts",
    "#UniversityEvents – 423 posts",
    "#QuorumSports – 345 posts",
  ];

  // ---------------------------
  // 3️⃣ RENDER: Chats
  // ---------------------------
  renderChats(chats);

  // ---------------------------
  // 4️⃣ INTERACTIONS
  // ---------------------------

  // ✅ FIXED openChat FUNCTION (was missing quotes and template literal)
  function openChat(name) {
    window.location.href = `chat.html?name=${encodeURIComponent(name)}`;
  }

  // Make the entire chat card clickable
  chatList.addEventListener("click", e => {
    const chatCard = e.target.closest(".chat-card");
    if (chatCard) {
      const chatName = chatCard.getAttribute("data-chat-name");
      if (chatName) openChat(chatName);
    }
  });

  // 🔍 Search chats
  searchBox.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    const filtered = chats.filter(c => c.name.toLowerCase().includes(query));
    renderChats(filtered);
  });

  // 💬 Active group highlight (if groupContainer exists)
  const groupContainer = document.querySelector(".group-container");
  if (groupContainer) {
    groupContainer.addEventListener("click", e => {
      const item = e.target.closest(".group-item");
      if (!item) return;
      groupContainer.querySelectorAll(".group-item").forEach(i => {
        i.classList.remove("active");
        i.style.background = "";
      });
      item.classList.add("active");
      item.style.background = "#f8d7da";
    });
  }

  // ✅ FIXED FOLLOW BUTTON SECTION
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".follow-btn, .follow-suggest button");
    if (!btn) return;

    if (btn.textContent.trim() === "Follow") {
      btn.textContent = "Following";
      btn.style.setProperty("background", "#6c757d", "important");
      btn.style.color = "#fff";
    } else {
      btn.textContent = "Follow";
      btn.style.setProperty("background", "var(--primary-red)", "important");
      btn.style.color = "#fff";
    }
  });

  // ✅ FIXED Trending auto-update
  function updateTrends() {
    const randomIndex = Math.floor(Math.random() * trends.length);
    const newTrend =
      trends[randomIndex].split("–")[0] +
      "– " +
      (Math.floor(Math.random() * 2000) + 200) +
      " posts";
    trends[randomIndex] = newTrend;
    // fixed: wrap <li> inside template literal backticks
    trendingList.innerHTML = trends.map(t => `<li>${t}</li>`).join("");
  }

  setInterval(updateTrends, 5000);
});