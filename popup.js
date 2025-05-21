document.addEventListener("DOMContentLoaded", async () => {
  const {
    openaiKey = "",
    claudeKey = "",
    model = "openai",
    target = "boss",
    style = "formal",
    emoji = "no",
    keigo = "normal",
    tone = "normal",
    lang = "ja",
    refineLevel = "normal",
    customPrompt = "",
    autoSend = false,
  } = await chrome.storage.local.get([
    "openaiKey",
    "claudeKey",
    "model",
    "target",
    "style",
    "emoji",
    "keigo",
    "tone",
    "lang",
    "refineLevel",
    "customPrompt",
    "autoSend",
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
  document.getElementById("keigo").value = keigo;
  document.getElementById("tone").value = tone;
  document.getElementById("lang").value = lang;
  document.getElementById("refineLevel").value = refineLevel;
  document.getElementById("customPrompt").value = customPrompt;
  document.getElementById("autoSend").checked = !!autoSend;
});

document.getElementById("save").addEventListener("click", () => {
  const openaiKey = document.getElementById("apiKey").value.trim();
  const claudeKey = document.getElementById("claudeKey").value.trim();
  const model = document.querySelector('input[name="model"]:checked').value;
  const target = document.getElementById("target").value;
  const style = document.querySelector('input[name="style"]:checked').value;
  const emoji = document.querySelector('input[name="emoji"]:checked').value;
  const keigo = document.getElementById("keigo").value;
  const tone = document.getElementById("tone").value;
  const lang = document.getElementById("lang").value;
  const refineLevel = document.getElementById("refineLevel").value;
  const customPrompt = document.getElementById("customPrompt").value.trim();
  const autoSend = document.getElementById("autoSend").checked;
  chrome.storage.local.set(
    {
      openaiKey,
      claudeKey,
      model,
      target,
      style,
      emoji,
      keigo,
      tone,
      lang,
      refineLevel,
      customPrompt,
      autoSend,
    },
    () => {
      alert("設定を保存しました");
    }
  );
});
