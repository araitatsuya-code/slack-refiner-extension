document.getElementById("save").addEventListener("click", () => {
  const key = document.getElementById("apiKey").value.trim();
  chrome.storage.local.set({ openaiKey: key }, () => {
    alert("APIキーを保存しました");
  });
});
