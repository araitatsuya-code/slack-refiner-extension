// background.js
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === "REFINE_REQUEST") {
    (async () => {
      const {
        openaiKey,
        claudeKey,
        model = "openai",
      } = await chrome.storage.local.get(["openaiKey", "claudeKey", "model"]);
      let apiKey = model === "claude" ? claudeKey : openaiKey;
      if (!apiKey) {
        respond({ error: "APIキーが設定されていません" });
        return;
      }
      try {
        let refined;
        if (model === "claude") {
          // Claude API
          const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify({
              model: "claude-3-opus-20240229",
              max_tokens: 1024,
              messages: [
                {
                  role: "user",
                  content:
                    "以下の日本語文章を明確かつ読みやすく推敲してください。",
                },
                { role: "user", content: msg.text },
              ],
            }),
          });
          if (!apiRes.ok) {
            const errText = await apiRes.text();
            throw new Error(`Status ${apiRes.status}: ${errText}`);
          }
          const data = await apiRes.json();
          refined = data.content?.[0]?.text?.trim();
          if (!refined) throw new Error("推敲結果が取得できませんでした");
        } else {
          // OpenAI API
          const apiRes = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
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
          refined = data.choices?.[0]?.message?.content?.trim();
          if (!refined) {
            throw new Error("推敲結果が取得できませんでした");
          }
        }
        respond({ refined });
      } catch (e) {
        console.error("API error:", e);
        respond({ error: e.message });
      }
    })();
    return true;
  }
});
