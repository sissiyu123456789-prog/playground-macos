import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  profileKnowledge,
  privacyReplies,
  unrelatedReplies
} from "~/data/profileKnowledge";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
  status?: "streaming" | "error" | "done";
  thinking?: boolean;
  thinkingPhase?: "thinking" | "generating";
}
const MAX_INPUT = 1000;
const MAX_OUTPUT = 1600;
const TYPEWRITER_INTERVAL = 22;
const NL = String.fromCharCode(10);
const privacyPattern =
  /电话|手机|手机号|微信号|邮箱|邮件|住址|地址|家庭|家人|婚姻|恋爱|对象|工资|薪资|收入|身份证|隐私/;
const aiTopicPattern =
  /大模型|语言模型|LLM|GPT|RAG|检索增强|Agent|智能体|AI|人工智能|机器学习|深度学习|生成式|多模态|AI产品|产品设计|面试|模型趋势|提示词|评测|推理|微调|向量数据库/i;
const casualPattern = /天气|下雨|气温|温度|吃什么|电影|音乐|星座|旅游|笑话/;
const replyTo = (value: string, turn: number) => {
  if (privacyPattern.test(value)) return privacyReplies[turn % privacyReplies.length];
  const normalized = value.toLowerCase().replace(/\s/g, "");
  const match = profileKnowledge
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce(
        (score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0),
        0
      )
    }))
    .sort((a, b) => b.score - a.score)[0];
  if (match && match.score >= 2) return match.entry.answer;
  if (/你好|嗨|hello/.test(normalized)) return "你好呀，我们聊聊吧～";
  if (aiTopicPattern.test(value))
    return "这是个很好的产品体验问题。\n\n- **先看目标**：用户为什么需要它，在哪个场景里卡住。\n- **再看体验**：信息、流程和反馈是否让人看得懂、用得顺。\n- **最后验证**：技术只负责把体验托住，方案还要用用户反馈和指标验证。";
  if (!casualPattern.test(value))
    return "我先确认一下问题，再结合具体场景回答。你可以补充一下想了解的对象、时间范围或使用场景吗？";
  return unrelatedReplies[turn % unrelatedReplies.length];
};
const limitAnswer = (value: string) => {
  const chars = Array.from(value);
  if (chars.length <= MAX_OUTPUT) return value;
  const safe = chars.slice(0, MAX_OUTPUT).join("");
  const sentenceEnd = Math.max(
    safe.lastIndexOf("。"),
    safe.lastIndexOf("！"),
    safe.lastIndexOf("？"),
    safe.lastIndexOf("!"),
    safe.lastIndexOf("?"),
    safe.lastIndexOf("；"),
    safe.lastIndexOf(";"),
    safe.lastIndexOf("\n")
  );
  return sentenceEnd > 0 ? safe.slice(0, sentenceEnd + 1).trimEnd() : value;
};

function parseSse(block: string) {
  let event = "message";
  const data: string[] = [];
  block.split(String.fromCharCode(10)).forEach((line) => {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    if (line.startsWith("data:")) data.push(line.slice(5).trim());
  });
  try {
    return { event, payload: data.length ? JSON.parse(data.join(NL)) : null };
  } catch {
    return { event, payload: null };
  }
}

const renderableMarkdown = (text: string) =>
  (text.match(/```/g) || []).length % 2 === 1
    ? text + NL + String.fromCharCode(96).repeat(3)
    : text;

export default function Askme() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "你好，我们聊聊吧～",
      status: "done",
      thinking: false
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(2);
  const typewriterQueueRef = useRef("");
  const typewriterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterIdRef = useRef<number | null>(null);
  const streamDoneRef = useRef(false);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);
  const update = (id: number, fn: (message: Message) => Message) =>
    setMessages((items) => items.map((item) => (item.id === id ? fn(item) : item)));

  const stopTypewriter = () => {
    if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current);
    typewriterTimerRef.current = null;
  };

  const stopThinkingTimer = () => {
    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    thinkingTimerRef.current = null;
  };

  const pumpTypewriter = (id: number) => {
    if (typewriterIdRef.current !== id || typewriterTimerRef.current) return;
    if (!typewriterQueueRef.current) {
      if (streamDoneRef.current) {
        update(id, (item) => ({ ...item, status: "done" }));
        setIsStreaming(false);
      }
      return;
    }
    const [character, ...rest] = Array.from(typewriterQueueRef.current);
    typewriterQueueRef.current = rest.join("");
    update(id, (item) => ({ ...item, text: item.text + character }));
    typewriterTimerRef.current = setTimeout(() => {
      typewriterTimerRef.current = null;
      pumpTypewriter(id);
    }, TYPEWRITER_INTERVAL);
  };

  const enqueueTypewriter = (id: number, text: string) => {
    typewriterIdRef.current = id;
    typewriterQueueRef.current += text;
    pumpTypewriter(id);
  };

  const waitForTypewriter = (id: number) =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (
          typewriterIdRef.current !== id ||
          (!typewriterQueueRef.current &&
            !typewriterTimerRef.current &&
            streamDoneRef.current)
        ) {
          resolve();
          return;
        }
        setTimeout(check, 30);
      };
      check();
    });

  const flushTypewriter = (id: number, status: Message["status"] = "done") => {
    stopTypewriter();
    const pending = typewriterQueueRef.current;
    typewriterQueueRef.current = "";
    if (pending) update(id, (item) => ({ ...item, text: item.text + pending }));
    update(id, (item) => ({ ...item, status }));
  };

  useEffect(() => () => stopTypewriter(), []);
  useEffect(() => () => stopThinkingTimer(), []);

  const fallback = async (
    value: string,
    id: number,
    history: Message[],
    signal: AbortSignal
  ) => {
    const response = await fetch("/api/chat", {
      signal,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value, history, stream: false })
    });
    if (!response.ok) throw new Error("fallback failed");
    const data = await response.json();
    stopTypewriter();
    typewriterIdRef.current = id;
    typewriterQueueRef.current = "";
    streamDoneRef.current = true;
    enqueueTypewriter(id, limitAnswer(data.reply || replyTo(value, history.length)));
    await waitForTypewriter(id);
  };

  const send = async () => {
    const value = input.trim();
    if (!value || isStreaming || value.length > MAX_INPUT) return;
    const history = messages;
    const assistantId = idRef.current++;
    const userId = idRef.current++;
    setMessages((items) => [
      ...items,
      { id: userId, role: "user", text: value, status: "done" },
      {
        id: assistantId,
        role: "assistant",
        text: "",
        status: "streaming",
        thinking: true,
        thinkingPhase: "thinking"
      }
    ]);
    setInput("");
    setIsStreaming(true);
    stopThinkingTimer();
    thinkingTimerRef.current = setTimeout(() => {
      update(assistantId, (item) => ({ ...item, thinkingPhase: "generating" }));
    }, 3000);
    const controller = new AbortController();
    abortRef.current = controller;
    stopTypewriter();
    typewriterQueueRef.current = "";
    typewriterIdRef.current = assistantId;
    streamDoneRef.current = false;
    let received = false;
    let completed = false;
    try {
      const response = await fetch("/api/chat", {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ message: value, history, stream: true })
      });
      if (!response.ok || !response.body) throw new Error("stream unavailable");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/event-stream")) {
        const data = await response.json();
        completed = true;
        streamDoneRef.current = true;
        enqueueTypewriter(
          assistantId,
          limitAnswer(data.reply || replyTo(value, history.length))
        );
        await waitForTypewriter(assistantId);
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const process = (block: string) => {
        if (completed) return;
        const parsed = parseSse(block);
        if (!parsed.payload) return;
        if (parsed.event === "delta" && parsed.payload.text) {
          received = true;
          stopThinkingTimer();
          update(assistantId, (item) => ({ ...item, thinkingPhase: "generating" }));
          enqueueTypewriter(assistantId, parsed.payload.text);
        }
        if (parsed.event === "done") {
          completed = true;
          streamDoneRef.current = true;
          pumpTypewriter(assistantId);
        }
        if (parsed.event === "error")
          throw new Error(parsed.payload.message || "stream failed");
      };
      while (!completed) {
        const result = await reader.read();
        if (result.done) break;
        buffer += decoder.decode(result.value, { stream: true });
        const blocks = buffer.split(NL + NL);
        buffer = blocks.pop() || "";
        blocks.forEach(process);
      }
      buffer += decoder.decode();
      if (buffer.trim()) process(buffer);
      if (!received) throw new Error("empty stream");
      if (completed) pumpTypewriter(assistantId);
      else {
        flushTypewriter(assistantId, "error");
        update(assistantId, (item) => ({
          ...item,
          text: item.text + NL + NL + "_回答未完成，请重试。_"
        }));
      }
    } catch (error) {
      if (controller.signal.aborted) {
        flushTypewriter(assistantId);
        update(assistantId, (item) => ({
          ...item,
          text: item.text || "已停止生成。"
        }));
      } else if (!received) {
        try {
          await fallback(value, assistantId, history, controller.signal);
          completed = true;
        } catch {
          update(assistantId, (item) => ({
            ...item,
            status: "error",
            text:
              limitAnswer(replyTo(value, history.length)) +
              NL +
              NL +
              "_回答服务暂时不可用，请稍后重试。_"
          }));
        }
      } else {
        flushTypewriter(assistantId, "error");
        update(assistantId, (item) => ({
          ...item,
          text: item.text + NL + NL + "_回答未完成，请重试。_"
        }));
      }
    } finally {
      abortRef.current = null;
      stopThinkingTimer();
      if (!completed) setIsStreaming(false);
    }
  };
  const stop = () => {
    if (abortRef.current) abortRef.current.abort();
    else if (typewriterIdRef.current !== null) {
      flushTypewriter(typewriterIdRef.current);
      setIsStreaming(false);
    }
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`askme-message ${message.role} ${message.status || ""}`}
          >
            {message.role === "assistant" ? (
              <div className="askme-markdown">
                {message.thinking ? (
                  <div
                    className={`askme-thinking-status ${
                      message.status === "streaming" &&
                      message.thinkingPhase !== "generating"
                        ? "is-active"
                        : ""
                    }`}
                  >
                    {message.status !== "streaming"
                      ? "思考完成"
                      : message.thinkingPhase === "generating"
                        ? "正在生成…"
                        : "正在思考…"}
                  </div>
                ) : null}
                {message.text ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {renderableMarkdown(message.text)}
                  </ReactMarkdown>
                ) : null}
              </div>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <form
        className="askme-composer"
        onSubmit={(event) => {
          event.preventDefault();
          if (isStreaming) stop();
          else void send();
        }}
      >
        <input
          maxLength={MAX_INPUT}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="和我聊聊…"
          aria-label="Message Askme"
        />
        <span className="askme-counter">{input.length}/1000</span>
        <button
          type="submit"
          aria-label={isStreaming ? "Stop generating" : "Send message"}
        >
          <span className={isStreaming ? "i-lucide:square" : "i-lucide:arrow-up"} />
        </button>
      </form>
    </div>
  );
}
