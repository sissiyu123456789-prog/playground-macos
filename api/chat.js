const privacyPattern = /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/i;

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const { message, history = [] } = request.body || {};
  if (!message) return response.status(400).json({ error: "Message is required" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return response.status(200).json({ reply: "本地还没有配置大模型 API key。请在启动 API 服务前设置 OPENAI_API_KEY；配置完成后，我会直接回答大模型趋势、AI 产品设计和面试问题。" });
  if (privacyPattern.test(message)) return response.status(200).json({ reply: "这个问题你可以当面问我哈哈哈" });
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const upstream = await fetch(baseUrl + "/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
  body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "你是 Sissi Yu 个人作品集中的 Askme，也是一位资深 AI 产品设计师。你正在进行真实的面试式对话。优先回答：Sissi Yu 的职业经历、项目、教育和技能；AI 产品设计方法；大模型、RAG、Agent、AI 搜索、评测、产品趋势、行业变化，以及面试官可能询问的相关问题。遇到‘最近大模型趋势’等科技和大模型问题时，必须基于你的知识认真回答，给出清晰、有结构、可落地的中文回答，并在涉及最新动态时说明信息可能随时间变化。只有天气、闲聊、娱乐等与个人经历和 AI 产品设计无关的问题，才回答‘咱们还是聊聊和我相关的吧～’，可以轮换自然措辞。个人隐私问题回答‘这个问题你可以当面问我哈哈哈’，也可以使用意思相同的自然措辞。不要声称自己只能回答作品集问题。" },
        ...history.slice(-8).map((item) => ({ role: item.role === "user" ? "user" : "assistant", content: item.text })),
        { role: "user", content: message }
      ]
    })
  });
  if (!upstream.ok) return response.status(502).json({ error: "Upstream chat failed" });
  const data = await upstream.json();
  return response.status(200).json({ reply: data.choices?.[0]?.message?.content || "咱们还是聊聊和我相关的吧" });
}
