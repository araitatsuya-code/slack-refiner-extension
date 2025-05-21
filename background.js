// background.js
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === "REFINE_REQUEST") {
    (async () => {
      const {
        openaiKey,
        claudeKey,
        model = "openai",
        target = "boss",
        style = "formal",
        emoji = "no",
        keigo,
        tone,
        lang,
        refineLevel,
        customPrompt,
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
      ]);
      let apiKey = model === "claude" ? claudeKey : openaiKey;
      if (!apiKey) {
        respond({ error: "APIキーが設定されていません" });
        return;
      }
      try {
        let refined;
        // 指示文の組み立て
        let targetText =
          target === "boss"
            ? "上司"
            : target === "subordinate"
            ? "部下"
            : "同僚";
        let styleText = style === "formal" ? "フォーマル" : "カジュアル";
        let emojiText =
          emoji === "yes"
            ? "適度に絵文字も使ってください。"
            : "絵文字は使わないでください。";
        let keigoText =
          keigo === "polite"
            ? "丁寧語"
            : keigo === "respect"
            ? "尊敬語"
            : keigo === "humble"
            ? "謙譲語"
            : "普通";
        let toneText =
          tone === "soft"
            ? "語尾を柔らかく"
            : tone === "hard"
            ? "語尾を強めに"
            : "";
        let langText =
          lang === "en" ? "英語で" : lang === "zh" ? "中国語で" : "日本語で";
        let refineLevelText =
          refineLevel === "light"
            ? "誤字脱字や簡単な表現のみ修正してください。"
            : refineLevel === "strong"
            ? "表現も大幅に修正してください。"
            : "";
        let customPromptText = customPrompt ? customPrompt : "";
        let instruction = `${langText}${targetText}に送る${styleText}な${keigoText}で${toneText}推敲してください。${emojiText}${refineLevelText}推敲後の文章のみを返してください。原文や説明、質問、謝罪、その他の返答は一切不要です。もしパワハラやセクハラに該当する表現が含まれている場合は、「警告: パワハラ表現が含まれています」や「警告: セクハラ表現が含まれています」と明記し、どの部分が該当するか、どのように改善すればよいかも簡潔にアドバイスしてください。${customPromptText}`;
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
                  content: instruction,
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
                    content: instruction,
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
