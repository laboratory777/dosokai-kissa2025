// js/favorite.js

// 追加ボタンをstall-detailに表示
function addFavoriteButton(stallKey) {
  const container = document.querySelector(".stall-detail");
  if (!container) return;

  const btn = document.createElement("button");
  btn.innerHTML = `お気に入りに追加`;
  btn.className = "back-button";
  btn.style.background = "#e60033";

  // 既に追加済みかチェック
  const favs = getFavorites();
  if (favs.includes(stallKey)) {
    btn.innerHTML = `お気に入りから削除`;
    btn.style.background = "#5555aa";
  }

  btn.onclick = () => {
    toggleFavorite(stallKey);
    const isFav = getFavorites().includes(stallKey);
    btn.innerHTML = isFav ? `お気に入りから削除` : `お気に入りに追加`;
    btn.style.background = isFav ? "#5555aa" : "#e60033"; // 色切替も連動
  };

  container.appendChild(btn);
}

// お気に入りの取得
function getFavorites() {
  const favs = localStorage.getItem("favorites") || "[]";
  return JSON.parse(favs);
}

// お気に入りの追加/削除
function toggleFavorite(name) {
  let favs = getFavorites();
  let added = false;

  if (favs.includes(name)) {
    favs = favs.filter(f => f !== name);
  } else {
    favs.push(name);
    added = true;
  }
  localStorage.setItem("favorites", JSON.stringify(favs));

  // ここで通知を表示（操作感UP）
  showFavoriteNotification(
    added ? "お気に入りに追加されました" : "お気に入りから削除されました"
  );
}


// showFestivalDetail に追加ボタン注入
const originalShowDetail = window.showFestivalDetail;
window.showFestivalDetail = function (stallName) {
  originalShowDetail(stallName);
  addFavoriteButton(stallName);
};

//ハンバーガーメニューに「お気に入り」ボタン追加
const waitHamburger = setInterval(() => {
  const menu = document.querySelector(".hamburger-menu");
  if (!menu) return;

  const favBtn = document.createElement("button");
  favBtn.innerHTML = `<img src="image/Star.svg" alt="">お気に入り`;
  favBtn.onclick = openFavoriteModal;

  const infoBtn = [...menu.querySelectorAll("button")].find(btn =>
    btn.innerText.includes("文化祭")
  );
  if (infoBtn && !menu.innerHTML.includes("お気に入り")) {
    infoBtn.insertAdjacentElement("afterend", favBtn);
  }

  clearInterval(waitHamburger);
}, 300);

//お気に入りモーダルを表示
function openFavoriteModal() {

  const menu = document.getElementById("hamburgerMenu");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
    document.body.classList.remove("menu-opened");
  }

  const modalHTML = `
    <div class="modal-overlay" id="favoriteModal">
      <div class="modal-box" id="favoriteModalBox">
        <button class="modal-close" onclick="closeFavoriteModal()">
         <img src="image/Close.svg" alt="閉じる" class="modal-close-icon">
        </button>
        <h2>お気に入り</h2>
        <div id="festivalContent">読み込み中...</div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  renderFavoriteList();
}

function closeFavoriteModal() {
  const modal = document.getElementById("favoriteModal");
  if (modal) modal.remove();
}

function renderFavoriteList() {
  const favs = getFavorites();
  const container = document.getElementById("festivalContent");

  const result = [];

  for (const floor of FES_DATA) {
    const matches = floor.stalls.filter(stall => favs.includes(stall.name + " @ " + stall.place));
    if (matches.length === 0) continue;
    result.push({ floor: floor.floor, stalls: matches });
  }

  if (result.length === 0) {
    container.innerHTML = `<p class="nohit-message">お気に入りに追加された模擬店がありません。</p>`;
    return;
  }

  container.innerHTML = result.map(floor => `
    <h3>${floor.floor}</h3>
    <ul>
      ${floor.stalls.map(stall => `
        <li onclick="showFestivalDetail('${(stall.name + " @ " + stall.place).replace(/'/g, "\\'")}')">
          <strong>${stall.name}</strong>
          <p>＠${stall.place}</p>
          <p class="stall-group">${stall.group}</p>
        </li>
      `).join("")}
    </ul>
  `).join("");

  // 検索・ページネーションを非表示に
  const box = document.getElementById("favoriteModalBox");
  const search = box.querySelector("#searchWrapper");
  const pagination = box.querySelector(".pagination-wrapper");
  if (search) search.style.display = "none";
  if (pagination) pagination.style.display = "none";
}

//お気に入り通知ポップアップ（DOM自動生成・自動削除)
function showFavoriteNotification(message) {
  // ラッパーがなければ作成
  let wrapper = document.querySelector(".favorite-popup-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "favorite-popup-wrapper";
    document.body.appendChild(wrapper);
  }

  const popup = document.createElement("div");
  popup.className = "favorite-popup";
  popup.textContent = message;

  if (message.includes("追加")) {
    popup.style.backgroundColor = "#e60033";
  } else if (message.includes("削除")) {
    popup.style.backgroundColor = "#5555aa";
  }

  // 表示アニメーションのために少し遅らせてクラス追加
  wrapper.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 10);
  setTimeout(() => {
    popup.classList.remove("show");
    popup.addEventListener("transitionend", () => {
      popup.remove();

      // wrapperが空なら削除
      if (wrapper && wrapper.children.length === 0) {
        wrapper.remove();
      }
    });
  }, 3000);
}
