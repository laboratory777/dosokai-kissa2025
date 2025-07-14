document.addEventListener("DOMContentLoaded", () => {
  fetch("data/status.json")
    .then((res) => res.json())
    .then((data) => {
      const status = data.status;
      const display = document.getElementById("status-display");

      if (!display) return;

      let text = "";
      let color = "";

      switch (status) {
        case "green":
          text = "空いてる";
          color = "#4CAF50";
          break;
        case "yellow":
          text = "やや混雑";
          color = "#FFC107";
          break;
        case "red":
          text = "混雑中";
          color = "#F44336";
          break;
        default:
          text = "情報なし";
          color = "#9E9E9E";
      }

      display.textContent = text;
      display.style.backgroundColor = color;
      display.style.color = "#fff";
      display.style.padding = "0.5rem";
      display.style.borderRadius = "0.5rem";
      display.style.textAlign = "center";
    })
    .catch((err) => {
      console.error("混雑状況の取得に失敗:", err);
    });
});
