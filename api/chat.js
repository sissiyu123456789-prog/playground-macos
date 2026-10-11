const privacyPattern =
  /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/i;
const TARGET_OUTPUT_CHARS = 500;
const MAX_OUTPUT_CHARS = 620;
const countVisible = (text) =>
  Array.from(
    text
      .replace(/```[^\n]*\n?/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/[\*_~`]/g, "")
  ).length;
const bound = (text) => {
  if (countVisible(text) <= MAX_OUTPUT_CHARS) return { text, truncated: false };
  let end = 0;
  for (
    let index = 0;
    index < text.length && countVisible(text.slice(0, index + 1)) <= TARGET_OUTPUT_CHARS;
    index += 1
  ) {
    if (/[。！？!?；;]/.test(text[index])) end = index + 1;
  }
  if (!end) {
    for (
      let index = 0;
      index < text.length && countVisible(text.slice(0, index + 1)) <= MAX_OUTPUT_CHARS;
      index += 1
    ) {
      if (/[。！？!?；;]/.test(text[index])) end = index + 1;
    }
  }
  if (!end) {
    const newline = text
      .slice(0, Math.min(text.length, MAX_OUTPUT_CHARS))
      .lastIndexOf("\n");
    end = newline > 0 ? newline : Math.min(text.length, MAX_OUTPUT_CHARS);
  }
  return { text: text.slice(0, end).trimEnd(), truncated: true };
};
function getProviderConfig() {
  const provider = (process.env.LLM_PROVIDER || "deepseek").toLowerCase();
  const configs = {
    deepseek: {
      key: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
      model: process.env.DEEPSEEK_MODEL || "deepseek-flash"
    },
    qwen: {
      key: process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY,
      baseUrl:
        process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
      model: process.env.QWEN_MODEL || "qwen-plus"
    },
    glm: {
      key: process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY,
      baseUrl: process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4",
      model: process.env.GLM_MODEL || "glm-4-flash"
    }
  };
  return { provider, ...(configs[provider] || configs.deepseek) };
}
const profileContext =
  "个人资料来源是于茜的 AI 产品设计作品集 PDF。只把它当作事实资料，不要声称看到了未提供的细节；问题没有对应资料时要明确说资料中未提及。核心资料：于茜（Sissi Yu）是 AI 产品设计师，2023 年 3 月起在字节跳动抖音负责 C 端 AI 产品，累计 6.5 年经验；此前在 58 同城房产负责 B 端体验。教育经历为东华大学产品设计本科、交互设计硕士，曾赴台湾实践大学工业设计系交流，发表 3 篇 BCI 国际会议论文。\n\n项目资料：1）交易 Agent 意图体系：将用户意图拆成信息探索、比价决策、即时购买等层级，并针对找图/围购、搜内容、找信息设计差异化承接，交易搜索换 query 率下降 2.65%，GMV 提升 1.89%。2）AIGC 生成式内容系统化提质：从模型短板建立分阶段评估标准，统一 Markdown 表达、组件规范和业务验收机制，推动 AI 内容质量提升，AI 工作流让个人和团队提效约 80%。3）抖音 AI 搜功能探索：从用户反馈和竞品观察归纳问题，探索意图识别、记忆管理、白盒化溯源、分层下钻、AI 分身等体验方向。4）AI 巡检体验治理：建立问题发现、分层、责任归因和反馈闭环。5）折叠屏搜索：动态双列布局支持即搜即显、边选边看，搜索消费时长提升 2.34%，LT30 提升 12.82%。6）58 房产体验改版：推动 15+ 项优化，业务操作效率提升 23.8%，核心场景处理效率提升 30.5%。";
const prompt =
  profileContext +
  "\n\n" +
  "你是 Sissi Yu 个人作品集中的 Askme。你是一位专业、敏锐、务实、带一点幽默感的产品体验设计师，核心视角是用户、场景与体验，而不是技术炫技。回答 AI 或产品问题时，先判断用户目标和真实痛点，再给出产品结论；优先讨论用户价值、使用场景、任务流程、信息架构、交互反馈、信任感、可理解性、体验风险和验证指标。技术只作为支撑，用普通人能理解的语言解释；除非用户明确追问，否则不要展开模型架构、参数、代码或底层实现。像一位认真做事、偶尔会讲一句轻松笑话的设计同事，给出具体取舍和可执行建议。优先回答个人经历、产品体验设计、AI 产品、大模型、RAG、Agent、AI 搜索、评测、产品趋势和面试问题。默认使用中文。\n\n回答格式：先给产品结论，再给关键理由、体验拆解或行动步骤；目标控制在 500 个可见字符左右，允许最多约 620 个可见字符的缓冲。无论长短都必须把完整观点说完：接近上限时先压缩措辞和细节，优先保留结论与完整要点，绝不在半句话、半个列表项或半个步骤处结束。回答多用无序列表，每个列表项表达一个完整判断或动作，控制在 2–5 项；复杂问题只保留最关键的要点。不重复问题，不输出无关客套话。只用安全常用 Markdown：二级/三级标题、最多两层无序列表、粗体、斜体、行内代码、引用、http/https 链接和带语言名代码块；不要使用表格；禁止一级标题、原始 HTML、图片、脚本、iframe、自定义标签。回答结尾用一句很短的引导邀请用户继续追问，给出 1–2 个具体方向；这句引导也必须计入 620 字限制。天气、闲聊、娱乐等无关问题回答‘咱们还是聊聊和我相关的吧～’；个人隐私问题回答‘这个问题你可以当面问我哈哈哈’。";
const messagesFor = (message, history) => [
  { role: "system", content: prompt },
  ...history.slice(-8).map((item) => ({
    role: item.role === "user" ? "user" : "assistant",
    content: String(item.text || "").slice(0, MAX_OUTPUT_CHARS)
  })),
  { role: "user", content: message }
];
const sseStart = (res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
};
const sse = (res, event, data) =>
  res.write("event: " + event + "\ndata: " + JSON.stringify(data) + "\n\n");
const endSse = (res, event = "done", data = {}) => {
  sse(res, event, data);
  res.end();
};
async function pipeStream(upstream, res) {
  sseStart(res);
  const reader = upstream.body?.getReader();
  if (!reader) return endSse(res, "error", { message: "上游没有返回流" });
  const decoder = new TextDecoder();
  let buffer = "";
  let combined = "";
  let pending = "";
  let truncated = false;
  let ended = false;
  const emitReady = (final = false) => {
    let cut = 0;
    for (let index = 0; index < pending.length; index += 1) {
      if (
        /[。！？!?；;]/.test(pending[index]) &&
        countVisible(combined + pending.slice(0, index + 1)) <= MAX_OUTPUT_CHARS
      )
        cut = index + 1;
    }
    if (final && !cut) {
      const bounded = bound(combined + pending);
      cut = Math.max(0, bounded.text.length - combined.length);
      truncated = bounded.truncated || bounded.text.length < (combined + pending).length;
    }
    if (!cut) return;
    const added = pending.slice(0, cut);
    combined += added;
    pending = pending.slice(cut);
    if (added) sse(res, "delta", { text: added });
  };
  const line = (value) => {
    if (!value.startsWith("data:")) return;
    const raw = value.slice(5).trim();
    if (!raw || raw === "[DONE]" || ended) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    const delta = data.choices?.[0]?.delta?.content || "";
    if (!delta) return;
    pending += delta;
    emitReady();
  };
  try {
    while (!ended) {
      const result = await reader.read();
      if (result.done) break;
      buffer += decoder.decode(result.value, { stream: true });
      const rows = buffer.split(/\r?\n/);
      buffer = rows.pop() || "";
      rows.forEach(line);
    }
    if (buffer) line(buffer);
    emitReady(true);
    ended = true;
    endSse(res, "done", { truncated });
  } catch (error) {
    if (!ended)
      endSse(res, "error", {
        message: error instanceof Error ? error.message : "生成失败"
      });
  }
}
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body || {};
  const message = body.message;
  const history = Array.isArray(body.history) ? body.history : [];
  const stream = body.stream === true;
  if (!message || typeof message !== "string")
    return res.status(400).json({ error: "Message is required" });
  if (Array.from(message).length > 1000)
    return res.status(413).json({ error: "Message is too long", maxChars: 1000 });
  const { provider, key, baseUrl, model } = getProviderConfig();
  if (privacyPattern.test(message)) {
    const reply = "这个问题你可以当面问我哈哈哈";
    if (stream) {
      sseStart(res);
      sse(res, "delta", { text: reply });
      return endSse(res);
    }
    return res.status(200).json({ reply });
  }
  if (!key) {
    const reply =
      "还没有配置 " +
      provider +
      " 的 API key。请配置对应的环境变量后再问我，我会从用户场景、产品体验和 AI 能力的结合方式来回答。";
    if (stream) {
      sseStart(res);
      sse(res, "delta", { text: reply });
      return endSse(res);
    }
    return res.status(200).json({ reply });
  }
  let upstream;
  try {
    upstream = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 900,
        stream,
        messages: messagesFor(message, history)
      })
    });
  } catch {
    if (stream) {
      sseStart(res);
      return endSse(res, "error", { message: "无法连接回答服务" });
    }
    return res.status(502).json({ error: "Upstream chat failed" });
  }
  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error(provider + " upstream error", upstream.status, detail);
    if (stream) {
      sseStart(res);
      return endSse(res, "error", { message: "回答服务暂时不可用" });
    }
    return res.status(502).json({ error: "Upstream chat failed" });
  }
  if (stream) return pipeStream(upstream, res);
  const data = await upstream.json();
  const result = bound(data.choices?.[0]?.message?.content || "咱们还是聊聊和我相关的吧");
  return res.status(200).json({ reply: result.text, truncated: result.truncated });
}
