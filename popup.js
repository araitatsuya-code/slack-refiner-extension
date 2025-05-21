document.addEventListener("DOMContentLoaded", async () => {
  const {
    openaiKey = "",
    claudeKey = "",
    model = "openai",
  } = await chrome.storage.local.get(["openaiKey", "claudeKey", "model"]);
  document.getElementById("apiKey").value = openaiKey;
  document.getElementById("claudeKey").value = claudeKey;
  document.querySelectorAll('input[name="model"]').forEach((r) => {
    r.checked = r.value === model;
  });
});

document.getElementById("save").addEventListener("click", () => {
  const openaiKey = document.getElementById("apiKey").value.trim();
  const claudeKey = document.getElementById("claudeKey").value.trim();
  const model = document.querySelector('input[name="model"]:checked').value;
  chrome.storage.local.set({ openaiKey, claudeKey, model }, () => {
    alert("設定を保存しました");
  });
});
