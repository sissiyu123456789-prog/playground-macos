const privacyPattern = /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/i;

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const { message, history = [] } = request.body || {};
  if (!message) return response.status(400).json({ error: "Message is required" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return response.status(200).json({ reply: "咱们还是聊聊和我相关的吧～" });
  if (privacyPattern.test(message)) return response.status(200).json({ reply: "这个问题你可以当面问我哈哈哈" });
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const upstream = await fetch(baseUrl + "/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "你是 Sissi Yu 个人作品集中的 Askme。只回答与 Sissi Yu 的职业经历、项目、教育和技能相关的问题。无关问题回答：咱们还是聊聊和我相关的吧。个人隐私问题回答：这个问题你可以当面问我哈哈哈。使用中文，简洁自然。" },
        ...history.slice(-8).map((item) => ({ role: item.role === "user" ? "user" : "assistant", content: item.text })),
        { role: "user", content: message }
      ]
    })
  });
  if (!upstream.ok) return response.status(502).json({ error: "Upstream chat failed" });
  const data = await upstream.json();
  return response.status(200).json({ reply: data.choices?.[0]?.message?.content || "咱们还是聊聊和我相关的吧" });
}
