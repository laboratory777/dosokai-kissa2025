//js/script.js

// 混雑状況の読み込み（ローカル）
    const statusText = {
      green: 'すいています',
      yellow: 'やや混雑',
      red: '混んでいます'
    };

    const display = document.getElementById('status-display');

    // file:// で開いた場合はデフォルト値を使う
    if (location.protocol === 'file:') {
      const localStatus = 'green'; // ← JSONと同じ値にしておけばOK
      display.textContent = statusText[localStatus] || '不明';
      display.classList.add(`status-${localStatus}`);
    } else {
      // Webサーバー経由ではfetchを使う
      fetch('data/status.json')
        .then(res => res.json())
        .then(data => {
          display.textContent = statusText[data.status] || '不明';
          display.classList.add(`status-${data.status}`);
        })
        .catch(err => {
          display.textContent = '取得失敗';
        });
    }

    // スライド制御
    let currentSlide = 0;
    function setSlide(index) {
      const slides = document.querySelector('.slides');
      const dots = document.querySelectorAll('.dot');
      currentSlide = index;
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }

    function prevSlide() {
      const totalSlides = document.querySelectorAll('.slides img').length;
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      setSlide(currentSlide);
    }

    function nextSlide() {
      const totalSlides = document.querySelectorAll('.slides img').length;
      currentSlide = (currentSlide + 1) % totalSlides;
      setSlide(currentSlide);
    }

    // 初期スライドを設定（ページ読み込み時）
    setSlide(0);

   // スライド自動再生（5秒ごと）
   setInterval(() => {
     nextSlide();
   }, 5000);
  
   // スワイプ対応（スマホ・タブレット）
   let startX = 0;
   const slider = document.querySelector('.slider');

   slider.addEventListener('touchstart', (e) => {
     startX = e.touches[0].clientX;
   });

   slider.addEventListener('touchend', (e) => {
     const endX = e.changedTouches[0].clientX;
     const diff = endX - startX;
     if (diff > 50) {
       prevSlide();
     } else if (diff < -50) {
       nextSlide();
     }
   });


   // トップへ戻るボタン表示制御
   const toTopBtn = document.getElementById("toTopBtn");

   window.addEventListener("scroll", () => {
     if (window.scrollY > 300) {
       toTopBtn.style.display = "block";
     } else {
       toTopBtn.style.display = "none";
     }
   });

   toTopBtn.addEventListener("click", () => {
     window.scrollTo({ top: 0, behavior: "smooth" });
   });

// 今の日時で「開催中」かを判定表示
(function checkOpenNow() {
  const now = new Date();
  const openNowMsg = document.getElementById("openNowMessage");

  // 開催日と時間帯（必要に応じて増やせます）
  const openPeriods = [
    { date: "2025-07-10", start: "18:00", end: "22:00" },
    { date: "2025-09-20", start: "11:00", end: "16:00" },
    { date: "2025-09-21", start: "11:00", end: "16:00" },
  ];

  const pad = n => n.toString().padStart(2, "0");
  const nowDateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const nowTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const period = openPeriods.find(p => p.date === nowDateStr &&
    nowTimeStr >= p.start && nowTimeStr <= p.end
  );

  if (period) {
    openNowMsg.textContent = ` 現在、営業中です！（${period.start}〜${period.end}）`;
    openNowMsg.classList.add('status-green');
  } else {
    openNowMsg.textContent = `現在、営業時間外です。`;
    openNowMsg.classList.add('status-red');
  }
})();

function scrollToSection(id) {
  const target = document.querySelector(`.${id}`) || document.getElementById(id);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 85,
      behavior: 'smooth'
    });
  }
}

// ハンバーガーメニューの開閉処理
const hamburgerBtn = document.getElementById("hamburgerBtn");
const hamburgerMenu = document.getElementById("hamburgerMenu");

hamburgerBtn.addEventListener("click", () => {
  hamburgerMenu.classList.toggle("show");
  document.body.classList.toggle("menu-opened");
});

// メニュー以外をクリック・タッチしたら閉じる
document.addEventListener("click", function (e) {
  const isMenu = hamburgerMenu.contains(e.target);
  const isButton = hamburgerBtn.contains(e.target);

  if (!isMenu && !isButton && hamburgerMenu.classList.contains("show")) {
    hamburgerMenu.classList.remove("show");
    document.body.classList.remove("menu-opened");
  }
});

//閉じる専用ボタンのクリック処理
const closeMenuBtn = document.querySelector(".close-menu-btn");

closeMenuBtn.addEventListener("click", () => {
  hamburgerMenu.classList.remove("show");
  document.body.classList.remove("menu-opened");
});

// メニュー内ボタンをクリックしたら閉じる
document.querySelectorAll("#hamburgerMenu button").forEach(btn => {
  btn.addEventListener("click", () => {
    hamburgerMenu.classList.remove("show");
    document.body.classList.remove("menu-opened");
  });
});

// 検索機能
document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'festivalSearch') {
    const keyword = e.target.value.trim().toLowerCase();
    const filtered = [];

    FES_DATA.forEach(floor => {
      const matchedStalls = floor.stalls.filter(stall =>
        stall.name.toLowerCase().includes(keyword) ||
        stall.place.toLowerCase().includes(keyword) ||
        stall.group.toLowerCase().includes(keyword)
      );
      if (matchedStalls.length > 0) {
        filtered.push({
          floor: floor.floor,
          stalls: matchedStalls
        });
      }
    });

    currentFestivalPage = 1; // reset
    renderFestivalPage(filtered.length > 0 ? filtered : FES_DATA, currentFestivalPage);
  }
});

