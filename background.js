// background.js
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === "REFINE_REQUEST") {
    (async () => {
      const { openaiKey } = await chrome.storage.local.get("openaiKey");
      if (!openaiKey) {
        respond({ error: "APIキーが設定されていません" });
        return;
      }

      try {
        const apiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: "文章を明確かつ読みやすく推敲してください。",
                },
                { role: "user", content: msg.text },
              ],
            }),
          }
        );

        if (!apiRes.ok) {
          const errText = await apiRes.text();
          throw new Error(`Status ${apiRes.status}: ${errText}`);
        }

        const data = await apiRes.json();
        const refined = data.choices?.[0]?.message?.content?.trim();
        if (!refined) {
          throw new Error("推敲結果が取得できませんでした");
        }

        respond({ refined });
      } catch (e) {
        console.error("OpenAI API error:", e);
        respond({ error: e.message });
      }
    })();

    // 非同期 sendResponse を使うことを明示
    return true;
  }
});
