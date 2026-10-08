import { useEffect, useRef, useState } from "react";
import { profileKnowledge, privacyReplies, unrelatedReplies } from "~/data/profileKnowledge";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const privacyPattern = /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/;
const aiTopicPattern = /大模型|语言模型|LLM|GPT|RAG|检索增强|Agent|智能体|AI|人工智能|机器学习|深度学习|生成式|多模态|AI产品|产品设计|面试|模型趋势|提示词|评测|推理|微调|向量数据库/i;
const casualPattern = /天气|下雨|气温|温度|吃什么|电影|音乐|星座|旅游|笑话/;
const replyTo = (value: string, turn: number) => {
  if (privacyPattern.test(value)) return privacyReplies[turn % privacyReplies.length];
  const normalized = value.toLowerCase().replace(/\s/g, "");
  const match = profileKnowledge
    .map((entry) => ({ entry, score: entry.keywords.reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)[0];
  if (match && match.score > 0 && match.score >= 2) return match.entry.answer;
  if (/你好|嗨|hello/.test(normalized)) return "你好呀，我们聊聊吧～";
  if (aiTopicPattern.test(value)) return "这是个很好的 AI 产品设计问题。我可以从用户价值、技术能力、交互体验和落地指标几个方面来分析。结合我的项目经历来看，我会先明确目标用户和核心场景，再验证模型能力是否真正改善了任务完成率与体验。你也可以继续追问具体的大模型趋势或面试题。";
  if (!casualPattern.test(value)) return "我先确认一下问题，再结合具体场景回答。你可以补充一下想了解的对象、时间范围或使用场景吗？";
  return unrelatedReplies[turn % unrelatedReplies.length];
};

export default function Askme() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "你好，我们聊聊吧～" }
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messagesRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const send = () => {
    const value = input.trim();
    if (!value) return;
    const turn = messages.length;
    setMessages((current) => [
      ...current,
      { role: "user", text: value },
      { role: "assistant", text: "正在思考…" }
    ]);
    setInput("");
    fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: value, history: messages }) })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("chat unavailable")))
      .then((data) => setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant" ? { ...item, text: data.reply || replyTo(value, turn) } : item)))
      .catch(() => setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant" ? { ...item, text: replyTo(value, turn) } : item)));
  };

  return (
    <div className="askme-window size-full">
      <div className="askme-header">
        <img className="askme-avatar" src="img/icons/doubao.png" alt="Askme" />
        <div>
          <div className="font-semibold">Askme</div>
          <div className="text-xs opacity-60">AI conversation</div>
        </div>
      </div>
      <div ref={messagesRef} className="askme-messages">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`askme-message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form
        className="askme-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="和我聊聊…"
          aria-label="Message Askme"
        />
        <button type="submit" aria-label="Send message">
          <span className="i-lucide:arrow-up" />
        </button>
      </form>
    </div>
  );
}
