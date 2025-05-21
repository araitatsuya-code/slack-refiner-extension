document.addEventListener("DOMContentLoaded", async () => {
  const {
    openaiKey = "",
    claudeKey = "",
    model = "openai",
    target = "boss",
    style = "formal",
    emoji = "no",
  } = await chrome.storage.local.get([
    "openaiKey",
    "claudeKey",
    "model",
    "target",
    "style",
    "emoji",
  ]);
  document.getElementById("apiKey").value = openaiKey;
  document.getElementById("claudeKey").value = claudeKey;
  document.querySelectorAll('input[name="model"]').forEach((r) => {
    r.checked = r.value === model;
  });
  document.getElementById("target").value = target;
  document.querySelectorAll('input[name="style"]').forEach((r) => {
    r.checked = r.value === style;
  });
  document.querySelectorAll('input[name="emoji"]').forEach((r) => {
    r.checked = r.value === emoji;
  });
});

document.getElementById("save").addEventListener("click", () => {
  const openaiKey = document.getElementById("apiKey").value.trim();
  const claudeKey = document.getElementById("claudeKey").value.trim();
  const model = document.querySelector('input[name="model"]:checked').value;
  const target = document.getElementById("target").value;
  const style = document.querySelector('input[name="style"]:checked').value;
  const emoji = document.querySelector('input[name="emoji"]:checked').value;
  chrome.storage.local.set(
    { openaiKey, claudeKey, model, target, style, emoji },
    () => {
      alert("設定を保存しました");
    }
  );
});
