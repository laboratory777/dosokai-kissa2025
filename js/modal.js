// js/modal.js

document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu li");

  const menuDetails = {
    "コーヒー（ホットのみ）": {
      img: "image/menu_coffee.jpg",
      text: "香ばしい香りと深い味わいのホットコーヒーです。"
    },
    "紅茶（HOT・ICE）": {
      img: "image/menu_tea.jpeg",
      text: "紅茶です。ホットとアイスを選べます。"
    },
    "ウーロン茶": {
      img: "image/menu_oolong.jpeg",
      text: "広く知られているあのウーロン茶です。"
    },
    "コーラ": {
      img: "image/menu_cola.jpg",
      text: "キリッとした炭酸の効いた定番のコーラです。"
    },
    "オレンジジュース": {
      img: "image/menu_orange.jpeg",
      text: "果汁が少しは入っていると思うオレンジジュースです。"
    }
  };

  menuItems.forEach(item => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      const text = item.textContent.trim();
      const detail = menuDetails[text];

      if (!detail) return;

      const modal = document.createElement("div");
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-box">
          <button class="modal-close" aria-label="閉じる">
          <img src="image/Close.svg" alt="閉じる" class="modal-close-icon">
          </button>
          <img src="${detail.img}" alt="${text}">
          <p class="status-note">※画像はイメージです。</p>
          <p>${detail.text}</p>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector(".modal-close").addEventListener("click", () => {
        modal.remove();
      });

      // 背景クリックでも閉じる
      modal.addEventListener("click", e => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    });
  });
});
