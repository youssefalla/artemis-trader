"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { SendIcon, LoaderIcon, Sparkles, TrendingUp, Newspaper, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { icon: <TrendingUp size={14} />, label: "Gold market today", text: "What's happening with Gold (XAUUSD) in the market today?" },
  { icon: <Newspaper size={14} />, label: "Forex news", text: "What are the latest important Forex market news and events?" },
  { icon: <TrendingUp size={14} />, label: "Best pairs now", text: "Which currency pairs have the best trading opportunities right now?" },
  { icon: <LayoutDashboard size={14} />, label: "Risk management", text: "Give me key risk management tips for Forex and Gold trading." },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#D4AF37" }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, dark }: { msg: Message; dark: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "0.875rem" }}
    >
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginRight: 10, marginTop: 2,
          background: "linear-gradient(135deg, #D4AF37, #f0d060)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={13} color="#0a0700" />
        </div>
      )}
      <div style={{
        maxWidth: "75%",
        padding: "0.75rem 1rem",
        borderRadius: isUser ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
        fontSize: "0.875rem",
        lineHeight: 1.65,
        whiteSpace: "pre-wrap",
        background: isUser
          ? "linear-gradient(135deg, #D4AF37, #c9a227)"
          : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        color: isUser ? "#0a0700" : "var(--text-primary)",
        border: isUser ? "none" : dark ? "1px solid rgba(212,175,55,0.15)" : "1px solid rgba(0,0,0,0.08)",
        fontWeight: isUser ? 600 : 400,
        boxShadow: isUser ? "0 4px 16px rgba(212,175,55,0.25)" : "none",
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIChatPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "52px";
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "52px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  const inputBg     = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = dark ? "rgba(212,175,55,0.20)" : "rgba(0,0,0,0.10)";
  const cardBg      = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.70)";
  const cardBorder  = dark ? "rgba(212,175,55,0.15)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ height: "calc(100vh - 4rem)", display: "flex", flexDirection: "column", maxWidth: "820px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #D4AF37, #f0d060)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(212,175,55,0.35)",
          }}>
            <Sparkles size={18} color="#0a0700" />
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Artemis AI</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>Trading assistant — Gold & Forex specialist</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "2rem", padding: "4px 12px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#15803d" }}>Online</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "1.25rem",
        background: cardBg, border: `1px solid ${cardBorder}`,
        borderRadius: "1.25rem 1.25rem 0 0",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "3rem 1rem" }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
              background: "linear-gradient(135deg, rgba(212,175,55,0.20), rgba(212,175,55,0.08))",
              border: "1px solid rgba(212,175,55,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={26} color="#D4AF37" />
            </div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
              How can I help today?
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0 0 2rem" }}>
              Ask me about the market, Gold, Forex pairs, or your trading strategy
            </p>

            {/* Quick prompts */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", justifyContent: "center" }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.5rem 1rem", borderRadius: "2rem",
                    background: dark ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    color: "#D4AF37", fontSize: "0.8125rem", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.20)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = dark ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.12)"; }}
                >
                  {q.icon}
                  {q.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} dark={dark} />
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.875rem" }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 2,
              background: "linear-gradient(135deg, #D4AF37, #f0d060)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={13} color="#0a0700" />
            </div>
            <div style={{
              padding: "0.75rem 1rem", borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: dark ? "1px solid rgba(212,175,55,0.15)" : "1px solid rgba(0,0,0,0.08)",
            }}>
              <TypingDots />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        background: cardBg, border: `1px solid ${cardBorder}`, borderTop: "none",
        borderRadius: "0 0 1.25rem 1.25rem",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        padding: "0.875rem 1rem",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the market, Gold, Forex..."
            rows={1}
            style={{
              flex: 1, resize: "none", height: "52px", maxHeight: "160px",
              background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: "0.875rem", padding: "0.875rem 1rem",
              fontSize: "0.875rem", color: "var(--text-primary)",
              outline: "none", transition: "border-color 0.2s",
              fontFamily: "inherit", lineHeight: 1.5,
            }}
            onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; }}
            onBlur={(e)  => { e.target.style.borderColor = inputBorder; }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: "0.875rem", flexShrink: 0,
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #D4AF37, #f0d060)"
                : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: input.trim() && !loading ? "0 4px 16px rgba(212,175,55,0.35)" : "none",
            }}
          >
            {loading
              ? <LoaderIcon size={18} color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} style={{ animation: "spin 1s linear infinite" }} />
              : <SendIcon size={18} color={input.trim() ? "#0a0700" : dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"} />
            }
          </button>
        </div>
        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: "0.5rem 0 0", textAlign: "center" }}>
          Artemis AI provides analysis only — not financial advice. Always verify live data.
        </p>
      </div>
    </div>
  );
}
