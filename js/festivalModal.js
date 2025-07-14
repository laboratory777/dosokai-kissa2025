//js/festivalModal.js

const DEFAULT_STALL_IMAGE = "image/no_image_logo.png";

// モーダルのHTMLをテンプレートとして定義
const festivalModalHTML = `
  <div class="modal-overlay" id="festivalModal">
    <div class="modal-box" id="festivalModalBox">
      <button class="modal-close" onclick="closeFestivalModal()">
      <img src="image/Close.svg" alt="閉じる" class="modal-close-icon">
      </button>
      <h2>文化祭マップ・模擬店一覧</h2>
      <div id="searchWrapper">
       <input type="text" id="festivalSearch" placeholder="キーワード検索(模擬店・教室等)">
       <button id="searchButton">検索</button>
      </div>
      <div id="festivalContent">読み込み中...</div>
    </div>
  </div>
`;

// モーダルを開く関数
function openFestivalModal() {
  // すでに存在していたら削除してから追加（再表示時のため）
  const existing = document.getElementById("festivalModal");
  if (existing) existing.remove();

  document.body.insertAdjacentHTML("beforeend", festivalModalHTML);

  // 表示内容を外部データから埋め込む
  if (typeof FES_DATA !== "undefined") {
    const container = document.getElementById("festivalContent");
    container.innerHTML = createFestivalHTML(FES_DATA);
  }
}

// モーダルを閉じる関数
function closeFestivalModal() {
  const modal = document.getElementById("festivalModal");
  if (modal) modal.remove();
}

// データをHTMLとして整形
let currentFestivalPage = 1;
const ITEMS_PER_PAGE = 2; // 1ページに2セット (h3 + ul)

function openFestivalModal() {
  const existing = document.getElementById("festivalModal");
  if (existing) existing.remove();

  document.body.insertAdjacentHTML("beforeend", festivalModalHTML);

  if (typeof FES_DATA !== "undefined") {
    renderFestivalPage(FES_DATA, currentFestivalPage);
  }
}

function renderFestivalPage(data, page) {
  const container = document.getElementById("festivalContent");

  // liを12件ごとにページングするように flatten
  const flatItems = [];

  data.forEach(floor => {
    floor.stalls.forEach(stall => {
      flatItems.push({
        floor: floor.floor,
        name: stall.name,
        place: stall.place,
        group: stall.group
      });
    });
  });

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(flatItems.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = flatItems.slice(start, end);

  // floor ごとにまとめ直す
  const grouped = {};
  pageItems.forEach(item => {
    if (!grouped[item.floor]) grouped[item.floor] = [];
    grouped[item.floor].push(item);
  });

  // HTML構築
  container.innerHTML = Object.entries(grouped).map(([floor, stalls]) => `
    <h3>${floor}</h3>
    <ul>
      ${stalls.map(stall => `
        <li onclick="showFestivalDetail('${(stall.name + " @ " + stall.place).replace(/'/g, "\\'")}')">
          <strong>${stall.name}</strong>
          <p>＠${stall.place}</p>
          <p class="stall-group">${stall.group}</p>
        </li>
      `).join("")}
    </ul>
  `).join("");

  const modalBox = document.getElementById("festivalModalBox");
  const oldPagination = modalBox.querySelector(".pagination-wrapper");
  if (oldPagination) oldPagination.remove(); // 再表示時の重複回避
  modalBox.insertAdjacentHTML("beforeend", createPaginationControls(page, totalPages));
}


function createPaginationControls(current, total) {
  return `
    <div class="pagination-wrapper">
      <button class="pagination-button" onclick="changeFestivalPage(-1)" ${current === 1 ? 'disabled' : ''}>← 前へ</button>
      <span class="pagination">${current} / ${total}ページ</span>
      <button class="pagination-button" onclick="changeFestivalPage(1)" ${current === total ? 'disabled' : ''}>次へ →</button>
    </div>
  `;
}

function changeFestivalPage(direction) {
    const flatItems = FES_DATA.flatMap(floor =>
    floor.stalls.map(stall => ({
      floor: floor.floor,
      name: stall.name,
      place: stall.place,
      group: stall.group
    }))
  );
  const totalPages = Math.ceil(flatItems.length / ITEMS_PER_PAGE);
  currentFestivalPage += direction;
  if (currentFestivalPage < 1) currentFestivalPage = 1;
  if (currentFestivalPage > totalPages) currentFestivalPage = totalPages;

  renderFestivalPage(FES_DATA, currentFestivalPage);
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "searchButton") {
    runFestivalSearch(); // ← 共通処理に分離
  }
});

document.addEventListener("input", function (e) {
  if (e.target && e.target.id === "festivalSearch") {
    runFestivalSearch(); // ← 入力と同時に反映
  }
});

function runFestivalSearch() {
  const keyword = document.getElementById("festivalSearch").value.trim().toLowerCase();
  const container = document.getElementById("festivalContent");

  if (!keyword) {
    renderFestivalPage(FES_DATA, 1);
    return;
  }

  const filtered = FES_DATA.map(floor => ({
    floor: floor.floor,
    stalls: floor.stalls.filter(stall => {
      const targetText = [
        stall.name,
        stall.place,
        stall.group,
        ...(stall.keywords || [])
      ].join(" ").toLowerCase();
      return targetText.includes(keyword);
    })
  })).filter(f => f.stalls.length > 0);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="nohit-message">該当する模擬店・教室が見つかりませんでした。</p>`;
    return;
  }

  renderFestivalPage(filtered, 1);
}

//詳細表示用
function showFestivalDetail(stallKey) {
  let found = null;
  for (const floor of FES_DATA) {
    const match = floor.stalls.find(s => (s.name + " @ " + s.place) === stallKey);
    if (match) {
      found = { ...match, floor: floor.floor };
      break;
    }
  }

  if (!found) return;

  // modal-box h2 書き換え
  const h2 = document.querySelector("#festivalModalBox h2");
  if (h2) h2.textContent = found.name;

  // 詳細情報HTML構築
  const container = document.getElementById("festivalContent");
  const imgSrc = found.image || DEFAULT_STALL_IMAGE;

  container.innerHTML = `
    <div class="stall-detail">
      <img src="${imgSrc}" alt="${found.name}" class="stall-thumbnail">
      <div class="stall-detail-text">
        <p><strong>場所：</strong>${found.place}</p>
        <p><strong>団体：</strong>${found.group || "―"}</p>
        <p><strong>フロア：</strong>${found.floor}</p>
        <p style="border: none;"><strong>説明文：</strong>${found.description}</p>
      </div>
        <button onclick="backToFestivalList()" class="back-button">一覧に戻る</button>
    </div>
  `;

  // ページネーション・検索フォームも非表示に
  const searchWrapper = document.getElementById("searchWrapper");
  if (searchWrapper) searchWrapper.style.display = "none";

  const paginationWrapper = document.querySelector(".pagination-wrapper");
  if (paginationWrapper) paginationWrapper.style.display = "none";
}

function backToFestivalList() {
  // h2戻す
  const h2 = document.querySelector("#festivalModalBox h2");
  if (h2) h2.textContent = "文化祭マップ・模擬店";

  // 表示復元
  renderFestivalPage(FES_DATA, currentFestivalPage);

  const searchWrapper = document.getElementById("searchWrapper");
  if (searchWrapper) searchWrapper.style.display = "flex";

  const paginationWrapper = document.querySelector(".pagination-wrapper");
  if (paginationWrapper) paginationWrapper.style.display = "block";
}
