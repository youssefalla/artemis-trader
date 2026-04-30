"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, LoaderIcon, Sparkles, TrendingUp, Newspaper, ShieldCheck, BarChart2, Paperclip, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

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

function TypeWriter({ text, speed = 38 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(tick); setDone(true); }
    }, speed);
    return () => clearInterval(tick);
  }, [text, speed]);

  return (
    <>
      <style>{`
        @keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .tw-cursor {
          display: inline-block; width: 3px; height: 0.85em;
          background: #D4AF37; border-radius: 1px;
          margin-left: 2px; vertical-align: middle;
          animation: tw-blink 0.9s step-start infinite;
          opacity: ${done ? 0 : 1};
          transition: opacity 0.4s ease 0.6s;
        }
      `}</style>
      <span>{displayed}</span>
      <span className="tw-cursor" />
    </>
  );
}

const BARS1 = [0.4,0.6,0.3,0.8,0.5,0.7,0.4,0.9,0.5,0.7,0.6,0.8,0.5,0.9];
const BARS2 = [0.5,0.4,0.7,0.5,0.8,0.6,0.9,0.5,0.7,0.8,0.5,0.9,0.6,1.0];

function MockDashboard({ dark }: { dark: boolean }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/New_York" }) + " EST";
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  const card = {
    bg: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        width: "100%", borderRadius: "1.375rem", overflow: "hidden", marginBottom: "1.25rem",
        background: dark ? "rgba(14,14,18,0.72)" : "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.85)",
        boxShadow: dark
          ? "0 24px 64px rgba(0,0,0,0.55), inset 1px 1px 1px rgba(255,255,255,0.05)"
          : "0 24px 64px rgba(0,0,0,0.08), inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(255,255,255,0.5)",
      }}
    >
      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.7rem 1.1rem", borderBottom: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", gap:5 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c => <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.375rem" }}>
          <motion.div
            animate={{ scale:[1,1.3,1], opacity:[0.7,1,0.7] }}
            transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}
            style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }}
          />
          <span className="font-mono" style={{ fontSize:"0.67rem", color:"var(--text-secondary)", letterSpacing:"0.05em" }}>artemis · live</span>
        </div>
        <span className="font-mono" style={{ fontSize:"0.67rem", color:"var(--text-secondary)", opacity:0.65 }}>{time}</span>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.625rem", padding:"0.7rem 1.1rem" }}>
        {([
          { label:"Today P/L",    main:"+$1,305", suffix:".40", sub:"▲ 2.55%", subClr:"#22C55E", delay:0.18 },
          { label:"Open Trades",  main:"7",        sub:"3 long · 4 short",      delay:0.28 },
          { label:"Win Rate · 30D", main:"68%",   sub:"142/209", gold:true,     delay:0.38 },
        ] as const).map(s => (
          <motion.div key={s.label}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:s.delay, duration:0.4, ease:[0.22,0.61,0.36,1] }}
            style={{ padding:"0.625rem", borderRadius:"0.75rem", background:card.bg, border:s.gold?"1px solid rgba(212,175,55,0.25)":card.border }}
          >
            <p className="font-mono" style={{ fontSize:"0.57rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-secondary)", margin:"0 0 0.35rem" }}>{s.label}</p>
            <p style={{ fontSize:s.label==="Today P/L"?"1.05rem":"1.35rem", fontWeight:700, color:s.gold?"#D4AF37":"var(--text-primary)", margin:0, lineHeight:1 }}>
              {s.main}{s.suffix&&<span style={{ color:"#D4AF37", fontSize:"0.68rem" }}>{s.suffix}</span>}
            </p>
            <p style={{ fontSize:"0.62rem", color:s.subClr||"var(--text-secondary)", margin:"0.22rem 0 0" }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Equity Curve ── */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}
        style={{ padding:"0 1.1rem 0.7rem" }}>
        <div style={{ padding:"0.7rem", borderRadius:"0.75rem", background:card.bg, border:card.border }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.45rem" }}>
            <p style={{ fontSize:"0.73rem", fontWeight:600, color:"var(--text-primary)", margin:0 }}>
              Equity Curve <span style={{ fontSize:"0.6rem", fontWeight:400, color:"var(--text-secondary)" }}>30D</span>
            </p>
            <div style={{ display:"flex", gap:3 }}>
              {["1D","30D","YTD"].map(tf => (
                <span key={tf} style={{ fontSize:"0.58rem", padding:"0.15rem 0.4rem", borderRadius:"0.3rem", border:tf==="30D"?"1px solid rgba(212,175,55,0.5)":"none", color:tf==="30D"?"#D4AF37":"var(--text-secondary)", fontWeight:tf==="30D"?700:400 }}>{tf}</span>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 620 175" style={{ width:"100%", height:88, display:"block", overflow:"visible" }}>
            <defs>
              <linearGradient id="eq-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[35,75,115,155].map(y => (
              <line key={y} x1="0" y1={y} x2="620" y2={y} stroke={dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"} strokeWidth="1" />
            ))}
            <motion.path
              d="M 10 168 C 60 155,110 144,160 132 C 210 120,260 110,310 96 C 360 82,410 68,460 54 C 510 40,555 26,608 12 L 608 170 L 10 170 Z"
              fill="url(#eq-g)"
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85, duration:0.55 }}
            />
            <motion.path
              d="M 10 168 C 60 155,110 144,160 132 C 210 120,260 110,310 96 C 360 82,410 68,460 54 C 510 40,555 26,608 12"
              fill="none" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round"
              initial={{ pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:1 }}
              transition={{ delay:0.58, duration:1.5, ease:[0.22,0.61,0.36,1] }}
            />
            <motion.circle cx="608" cy="12" r="4.5" fill="#D4AF37"
              initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ delay:2.0, duration:0.35, type:"spring", stiffness:300 }}
            />
            <motion.circle cx="608" cy="12" r="9" fill="none" stroke="#D4AF37" strokeWidth="1"
              initial={{ scale:0, opacity:0 }} animate={{ scale:[1,1.8,1], opacity:[0.6,0,0.6] }}
              transition={{ delay:2.15, duration:1.8, repeat:Infinity }}
            />
          </svg>
        </div>
      </motion.div>

      {/* ── Market pairs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.625rem", padding:"0 1.1rem 0.85rem" }}>
        {[
          { pair:"EUR/USD", change:"+0.22%", bars:BARS1, delay:0.62 },
          { pair:"XAU/USD", change:"+1.04%", bars:BARS2, delay:0.72 },
        ].map((m, mi) => (
          <motion.div key={m.pair}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:m.delay, duration:0.4, ease:[0.22,0.61,0.36,1] }}
            style={{ padding:"0.625rem", borderRadius:"0.75rem", background:card.bg, border:card.border }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.45rem" }}>
              <span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--text-primary)" }}>{m.pair}</span>
              <span style={{ fontSize:"0.7rem", fontWeight:600, color:"#22C55E" }}>{m.change}</span>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:2.5, height:32 }}>
              {m.bars.map((h, i) => (
                <motion.div key={i}
                  initial={{ scaleY:0 }} animate={{ scaleY:1 }}
                  transition={{ delay:m.delay+0.05+i*0.035, duration:0.35, ease:[0.22,0.61,0.36,1] }}
                  style={{ flex:1, background:"#D4AF37", borderRadius:2, height:`${h*100}%`, opacity:0.55+h*0.45, originY:1 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
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
      justifyContent: "flex-start",
      paddingTop: hasMessages ? "1.5rem" : "2rem",
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

      {/* ── Empty state: heading + mock dashboard ── */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ zIndex: 1, width: "100%", maxWidth: 640, marginBottom: "1.25rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 className="font-display" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.4rem", letterSpacing: "-0.03em" }}>
                <TypeWriter text="How can I help today?" speed={42} />
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                Type a question or upload a chart for analysis
              </p>
            </div>
            <MockDashboard dark={dark} />
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
