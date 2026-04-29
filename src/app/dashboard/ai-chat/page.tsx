"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, LoaderIcon, Sparkles, TrendingUp, Newspaper, ShieldCheck, BarChart2, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { icon: <TrendingUp size={13} />, label: "Gold market today" ,  text: "What's happening with Gold (XAUUSD) in the market today?" },
  { icon: <Newspaper size={13} />,  label: "Forex news",          text: "What are the latest important Forex market news and events?" },
  { icon: <BarChart2 size={13} />,  label: "Best pairs now",      text: "Which currency pairs have the best trading opportunities right now?" },
  { icon: <ShieldCheck size={13} />,label: "Risk management",     text: "Give me key risk management tips for Forex and Gold trading." },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37" }}
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "1rem" }}
    >
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          marginRight: 10, marginTop: 2,
          background: "linear-gradient(135deg,#D4AF37,#f0d060)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={12} color="#0a0700" />
        </div>
      )}
      <div style={{
        maxWidth: "72%",
        padding: "0.75rem 1rem",
        borderRadius: isUser ? "1.25rem 1.25rem 0.25rem 1.25rem" : "0.25rem 1.25rem 1.25rem 1.25rem",
        fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap",
        background: isUser
          ? "linear-gradient(135deg,#D4AF37,#c9a227)"
          : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
        color: isUser ? "#0a0700" : "var(--text-primary)",
        border: isUser ? "none" : dark ? "1px solid rgba(212,175,55,0.14)" : "1px solid rgba(0,0,0,0.08)",
        fontWeight: isUser ? 600 : 400,
        boxShadow: isUser ? "0 4px 16px rgba(212,175,55,0.22)" : "none",
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
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "52px"; }
    setLoading(true);

    try {
      const res  = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data.reply) setMessages(p => [...p, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "28px";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }

  // ── colours ──────────────────────────────────────────────────
  const boxBg     = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)";
  const boxBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const divider   = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <div style={{
      position: "relative",
      minHeight: "calc(100vh - 4rem)",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      justifyContent: hasMessages ? "flex-start" : "center",
      padding: hasMessages ? "1.5rem 0 0" : "0",
      overflow: "hidden",
      transition: "justify-content 0.4s",
    }}>

      {/* Background gold glow — only when no messages */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
          >
            <div style={{
              position: "absolute", left: "20%", top: "15%",
              width: "45vw", height: "45vw", borderRadius: "50%",
              background: "radial-gradient(circle,rgba(212,175,55,0.13) 0%,transparent 70%)",
              filter: "blur(60px)",
            }} />
            <div style={{
              position: "absolute", right: "15%", bottom: "20%",
              width: "35vw", height: "35vw", borderRadius: "50%",
              background: "radial-gradient(circle,rgba(240,208,96,0.10) 0%,transparent 70%)",
              filter: "blur(50px)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EMPTY STATE: centered heading ── */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            key="heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", marginBottom: "2.5rem", zIndex: 1, width: "100%", maxWidth: 640 }}
          >
            <h1 style={{
              fontSize: "2rem", fontWeight: 700,
              background: dark
                ? "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.42))"
                : "linear-gradient(135deg,#1a1000,#6b4f00)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 0.5rem", letterSpacing: "-0.03em",
            }}>
              How can I help today?
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Type a question or choose a topic below
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MESSAGES ── */}
      {hasMessages && (
        <div style={{
          width: "100%", maxWidth: 700,
          flex: 1, overflowY: "auto",
          padding: "0 0 1.5rem",
          maskImage: "linear-gradient(to bottom,transparent 0,black 40px)",
        }}>
          {messages.map((m, i) => <MessageBubble key={i} msg={m} dark={dark} />)}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "1rem" }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#D4AF37,#f0d060)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Sparkles size={12} color="#0a0700" />
              </div>
              <div style={{
                padding: "0.625rem 0.875rem",
                borderRadius: "0.25rem 1.25rem 1.25rem 1.25rem",
                background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                border: dark ? "1px solid rgba(212,175,55,0.14)" : "1px solid rgba(0,0,0,0.08)",
              }}>
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* ── INPUT BOX ── */}
      <motion.div
        layout
        style={{
          width: "100%", maxWidth: 640, zIndex: 1,
          marginBottom: hasMessages ? "0" : "0",
        }}
      >
        <div style={{
          background: boxBg,
          border: `1px solid ${boxBorder}`,
          borderRadius: "1.25rem",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          boxShadow: dark
            ? "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}>
          {/* Textarea */}
          <div style={{ padding: "1rem 1.25rem 0.5rem" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInput}
              onKeyDown={onKey}
              placeholder="Ask Artemis AI a question…"
              rows={1}
              style={{
                width: "100%", boxSizing: "border-box",
                resize: "none", height: "28px", maxHeight: "140px",
                background: "transparent", border: "none", outline: "none",
                fontSize: "0.9375rem", color: "var(--text-primary)",
                fontFamily: "inherit", lineHeight: 1.55,
              }}
            />
          </div>

          {/* Bottom bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.5rem 0.875rem 0.875rem",
            borderTop: `1px solid ${divider}`,
          }}>
            {/* Left — attachment */}
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: "0.625rem",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-secondary)", transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              <Paperclip size={15} />
            </button>

            {/* Right — send */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.45rem 1rem", borderRadius: "0.75rem",
                background: input.trim() && !loading
                  ? dark ? "rgba(255,255,255,0.90)" : "#1a1000"
                  : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: "none",
                color: input.trim() && !loading
                  ? dark ? "#0a0700" : "#ffffff"
                  : "var(--text-secondary)",
                fontSize: "0.8125rem", fontWeight: 600,
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {loading
                ? <LoaderIcon size={14} style={{ animation: "spin 1s linear infinite" }} />
                : <SendIcon size={14} />
              }
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* ── QUICK PROMPTS ── */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "1.25rem" }}
            >
              {QUICK_PROMPTS.map((q, i) => (
                <motion.button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.45rem 0.875rem", borderRadius: "0.625rem",
                    background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.09)",
                    color: "var(--text-secondary)", fontSize: "0.8125rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = dark ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.12)";
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
                    e.currentTarget.style.color = "#D4AF37";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {q.icon}
                  {q.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{
          textAlign: "center", fontSize: "0.7rem",
          color: "var(--text-secondary)", opacity: 0.6,
          margin: "0.875rem 0 0",
        }}>
          Artemis AI provides analysis only — not financial advice.
        </p>
      </motion.div>
    </div>
  );
}
