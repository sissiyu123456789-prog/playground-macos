import { useEffect, useRef, useState } from "react";
import { profileKnowledge, privacyReplies, unrelatedReplies } from "~/data/profileKnowledge";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const privacyPattern = /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/;
const replyTo = (value: string, turn: number) => {
  if (privacyPattern.test(value)) return privacyReplies[turn % privacyReplies.length];
  const normalized = value.toLowerCase().replace(/\s/g, "");
  const match = profileKnowledge
    .map((entry) => ({ entry, score: entry.keywords.reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)[0];
  if (match && match.score > 0) return match.entry.answer;
  if (/你好|嗨|hello/.test(normalized)) return "你好呀，我们聊聊吧～";
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
