(function () {
  let textarea = null;

  // ページ変化を監視して、Slack の入力欄をキャプチャ
  const obs = new MutationObserver(() => {
    const ta = document.querySelector('div[role="textbox"]');
    if (ta && ta !== textarea) {
      textarea = ta;
      attachHandler();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  function attachHandler() {
    textarea.addEventListener(
      "keydown",
      async (e) => {
        // Cmd/Ctrl + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();

          const original = textarea.innerText;
          showLoadingOverlay();

          const runtime = chrome.runtime || (window.browser && browser.runtime);
          if (!runtime?.sendMessage) {
            console.error("Runtime messaging is unavailable");
            hideLoadingOverlay();
            return;
          }

          runtime.sendMessage(
            { type: "REFINE_REQUEST", text: original },
            (resp) => {
              hideLoadingOverlay();
              if (resp.error) return alert(resp.error);
              if (resp.refined.startsWith("警告:")) {
                alert(resp.refined);
                return;
              }
              showPreviewDialog(original, resp.refined);
            }
          );
        }
      },
      true
    ); // ← キャプチャ有効
  }

  // ローディングオーバーレイ
  function showLoadingOverlay() {
    // 簡易実装例：半透明の固定要素を重ねる
    const ov = document.createElement("div");
    ov.id = "refine-loading";
    Object.assign(ov.style, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.3)",
      zIndex: 9999,
    });
    document.body.appendChild(ov);
  }
  function hideLoadingOverlay() {
    document.getElementById("refine-loading")?.remove();
  }

  // プレビュー＆適用ダイアログ
  function showPreviewDialog(original, refined) {
    // シンプルな prompt() でもいいですが、
    // 独自のモーダルを作ると UX 向上します。
    if (confirm("推敲後の文章を適用しますか？\n\n" + refined)) {
      // Slack の入力欄を書き換え
      textarea.innerText = refined;
      // カーソルを先頭へ
      const sel = window.getSelection();
      sel.selectAllChildren(textarea);
      sel.collapseToEnd();
    }
  }
})();
