//js/statusColor.js

  const statusEl = document.getElementById('status-display');

  // 初期読み込みとリアルタイム監視
  database.ref('status').on('value', (snapshot) => {
    const val = snapshot.val();

    // クラスをすべて一度リセット（背景色切り替えのため）
    statusEl.classList.remove('status-green', 'status-yellow', 'status-red');

    if (val === 'green') {
      statusEl.textContent = '空いてる';
      statusEl.classList.add('status-green');
    } else if (val === 'yellow') {
      statusEl.textContent = 'やや混雑';
      statusEl.classList.add('status-yellow');
    } else if (val === 'red') {
      statusEl.textContent = '混雑中';
      statusEl.classList.add('status-red');
    } else {
      statusEl.textContent = '取得エラー';
    }
  });

