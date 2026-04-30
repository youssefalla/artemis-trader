"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, LoaderIcon, Sparkles, TrendingUp, Newspaper, ShieldCheck, BarChart2, Paperclip, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import VaporTextIn from "@/components/ui/VaporTextIn";

interface ImageAttachment {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  preview: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: { preview: string };
}

const QUICK_PROMPTS = [
  { icon: <TrendingUp size={13} />, label: "Gold market today",  text: "What's happening with Gold (XAUUSD) in the market today?" },
  { icon: <Newspaper size={13} />,  label: "Forex news",         text: "What are the latest important Forex market news and events?" },
  { icon: <BarChart2 size={13} />,  label: "Best pairs now",     text: "Which currency pairs have the best trading opportunities right now?" },
  { icon: <ShieldCheck size={13} />,label: "Risk management",    text: "Give me key risk management tips for Forex and Gold trading." },
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
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 6 }}>
        {msg.image && (
          <img
            src={msg.image.preview}
            alt="attachment"
            style={{ maxWidth: 220, maxHeight: 180, borderRadius: "0.75rem", objectFit: "cover", border: "1px solid rgba(212,175,55,0.25)" }}
          />
        )}
        {msg.content && (
          <div style={{
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
        )}
      </div>
    </motion.div>
  );
}

export default function AIChatPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [image, setImage]         = useState<ImageAttachment | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const base64 = result.split(",")[1];
      setImage({
        base64,
        mediaType: file.type as ImageAttachment["mediaType"],
        preview: result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if ((!content && !image) || loading) return;

    const userMsg: Message = {
      role: "user",
      content: content || (image ? "Analyze this chart." : ""),
      image: image ? { preview: image.preview } : undefined,
    };

    const apiMessages = [
      ...messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      image
        ? {
            role: "user" as const,
            content: [
              { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
              { type: "text", text: content || "Analyze this trading chart and give me insights." },
            ],
          }
        : { role: "user" as const, content },
    ];

    setMessages(p => [...p, userMsg]);
    setInput("");
    setImage(null);
    if (textareaRef.current) textareaRef.current.style.height = "28px";
    setLoading(true);

    try {
      const res  = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(p => [...p, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(p => [...p, { role: "assistant", content: `Error: ${data.error ?? "No response from AI"}` }]);
      }
    } catch (err) {
      setMessages(p => [...p, { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Something went wrong"}` }]);
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

  const boxBg     = dark ? "rgba(16,16,21,0.45)"    : "rgba(255,255,255,0.55)";
  const boxBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.75)";
  const divider   = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  const canSend = (input.trim() || !!image) && !loading;

  return (
    <div style={{
      position: "relative",
      minHeight: "calc(100vh - 4rem)",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      justifyContent: hasMessages ? "flex-start" : "center",
      padding: hasMessages ? "1.5rem 0 0" : "0",
      overflow: "hidden",
    }}>

      {/* Gold bg glow */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
          >
            <div style={{ position: "absolute", left: "20%", top: "15%", width: "45vw", height: "45vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,55,0.13) 0%,transparent 70%)", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", right: "15%", bottom: "20%", width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,208,96,0.10) 0%,transparent 70%)", filter: "blur(50px)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heading */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            key="heading"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", marginBottom: "2.5rem", zIndex: 1, width: "100%", maxWidth: 640 }}
          >
            <VaporTextIn
              text="How can I help today?"
              fontSize={32}
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight={700}
              color={dark ? "rgba(255,255,255,0.88)" : "rgba(26,16,0,0.88)"}
              duration={1000}
              style={{ margin: "0 0 0.5rem" }}
            />
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Type a question or upload a chart for analysis
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      {hasMessages && (
        <div style={{ width: "100%", maxWidth: 700, flex: 1, overflowY: "auto", padding: "0 0 1.5rem", maskImage: "linear-gradient(to bottom,transparent 0,black 40px)" }}>
          {messages.map((m, i) => <MessageBubble key={i} msg={m} dark={dark} />)}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#D4AF37,#f0d060)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={12} color="#0a0700" />
              </div>
              <div style={{ padding: "0.625rem 0.875rem", borderRadius: "0.25rem 1.25rem 1.25rem 1.25rem", background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", border: dark ? "1px solid rgba(212,175,55,0.14)" : "1px solid rgba(0,0,0,0.08)" }}>
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input box */}
      <motion.div layout style={{ width: "100%", maxWidth: 640, zIndex: 1 }}>
        <div style={{
          background: boxBg, border: `1px solid ${boxBorder}`,
          borderRadius: "1.25rem",
          backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: dark
            ? "0 8px 32px rgba(0,0,0,0.45), inset 1px 1px 1px rgba(255,255,255,0.06), inset -1px -1px 1px rgba(212,175,55,0.05)"
            : "0 8px 32px rgba(0,0,0,0.07), inset 2px 2px 1px rgba(255,255,255,0.85), inset -1px -1px 1px rgba(255,255,255,0.50)",
          overflow: "hidden",
        }}>

          {/* Image preview */}
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ padding: "0.75rem 1.25rem 0", display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={image.preview} alt="preview" style={{ height: 72, width: "auto", borderRadius: "0.625rem", objectFit: "cover", border: "1px solid rgba(212,175,55,0.30)", display: "block" }} />
                  <button
                    onClick={() => setImage(null)}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: dark ? "#333" : "#ddd", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={10} color={dark ? "#fff" : "#333"} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <div style={{ padding: "1rem 1.25rem 0.5rem" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInput}
              onKeyDown={onKey}
              placeholder={image ? "Ask about this chart…" : "Ask Artemis AI a question…"}
              rows={1}
              style={{ width: "100%", boxSizing: "border-box", resize: "none", height: "28px", maxHeight: "140px", background: "transparent", border: "none", outline: "none", fontSize: "0.9375rem", color: "var(--text-primary)", fontFamily: "inherit", lineHeight: 1.55 }}
            />
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.875rem 0.875rem", borderTop: `1px solid ${divider}` }}>
            {/* Paperclip */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "0.625rem", background: image ? "rgba(212,175,55,0.15)" : "none", border: image ? "1px solid rgba(212,175,55,0.35)" : "none", cursor: "pointer", color: image ? "#D4AF37" : "var(--text-secondary)", transition: "color 0.2s" }}
              onMouseEnter={e => { if (!image) e.currentTarget.style.color = "#D4AF37"; }}
              onMouseLeave={e => { if (!image) e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <Paperclip size={15} />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {/* Send */}
            <button
              onClick={() => sendMessage()}
              disabled={!canSend}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.45rem 1rem", borderRadius: "0.75rem",
                background: canSend ? (dark ? "rgba(255,255,255,0.90)" : "#1a1000") : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
                border: "none",
                color: canSend ? (dark ? "#0a0700" : "#ffffff") : "var(--text-secondary)",
                fontSize: "0.8125rem", fontWeight: 600,
                cursor: canSend ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {loading ? <LoaderIcon size={14} style={{ animation: "spin 1s linear infinite" }} /> : <SendIcon size={14} />}
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "1.25rem" }}
            >
              {QUICK_PROMPTS.map((q, i) => (
                <motion.button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.875rem", borderRadius: "0.625rem", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.09)", color: "var(--text-secondary)", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.12)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"; e.currentTarget.style.color = "#D4AF37"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {q.icon}{q.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-secondary)", opacity: 0.6, margin: "0.875rem 0 0" }}>
          Artemis AI provides analysis only — not financial advice.
        </p>
      </motion.div>
    </div>
  );
}
