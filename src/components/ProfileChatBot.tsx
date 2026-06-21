"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, Sparkles, Trash2, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi, I am Mohamed's portfolio assistant. Ask me about his AI work, skills, projects, or how to contact him.",
  },
];

const MEMORY_KEY = "mohamed-profile-chat-memory";
const MAX_STORED_MESSAGES = 40;

const suggestedPrompts = [
  "What does Mohamed specialize in?",
  "How can I contact Mohamed?",
  "Tell me about his AI experience.",
];

export default function ProfileChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedMemory = useRef(false);

  useEffect(() => {
    try {
      const storedMemory = window.localStorage.getItem(MEMORY_KEY);
      const parsedMemory = storedMemory ? JSON.parse(storedMemory) : null;

      if (Array.isArray(parsedMemory) && parsedMemory.length > 0) {
        const restoredMessages = parsedMemory
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const role = item.role === "user" || item.role === "assistant" ? item.role : null;
            const content = typeof item.content === "string" ? item.content.trim() : "";
            const id = typeof item.id === "string" ? item.id : crypto.randomUUID();

            if (!role || !content) return null;
            return { id, role, content };
          })
          .filter((item): item is ChatMessage => Boolean(item))
          .slice(-MAX_STORED_MESSAGES);

        if (restoredMessages.length > 0) {
          setMessages(restoredMessages);
        }
      }
    } catch {
      window.localStorage.removeItem(MEMORY_KEY);
    } finally {
      hasLoadedMemory.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedMemory.current) return;

    window.localStorage.setItem(
      MEMORY_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES).map(({ id, role, content }) => ({ id, role, content })))
    );
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "The assistant could not answer right now.");
      }

      setMessages([
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The assistant could not answer right now.";
      setError(message);
      setMessages([
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I am having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const clearMemory = () => {
    window.localStorage.removeItem(MEMORY_KEY);
    setMessages(starterMessages);
    setError(null);
  };

  return (
    <div className="fixed bottom-5 right-4 z-80 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="mb-4 flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-2xl shadow-accent/10 backdrop-blur-xl"
            aria-label="Mohamed portfolio chat assistant"
          >
            <div className="relative overflow-hidden border-b border-white/10 bg-primary/30 px-5 py-4">
              <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full border border-accent/20" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent">
                    <Bot size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Mohamed AI Bot</p>
                    <p className="text-xs text-text-muted">Memory on in this browser</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={clearMemory}
                    className="rounded-full p-2 text-text/70 transition hover:bg-white/10 hover:text-text"
                    aria-label="Clear chat memory"
                    title="Clear memory"
                  >
                    <Trash2 size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-text/70 transition hover:bg-white/10 hover:text-text"
                    aria-label="Close chat"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-accent text-bg"
                        : "border border-white/10 bg-white/[0.06] text-text"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className={message.role === "user" ? "underline" : "text-accent hover:underline"}
                          >
                            {children}
                          </a>
                        ),
                        ul: ({ children }) => <ul className="list-disc space-y-1 pl-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal space-y-1 pl-4">{children}</ol>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-text-muted">
                    <Loader2 className="animate-spin" size={16} />
                    Thinking
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 bg-black/40 p-4">
              {messages.length === 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-text-muted transition hover:border-accent/40 hover:text-text"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {error && <p className="mb-3 text-xs text-red-300">{error}</p>}

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <label className="sr-only" htmlFor="profile-chat-input">
                  Ask Mohamed AI Bot
                </label>
                <textarea
                  id="profile-chat-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about Mohamed..."
                  rows={1}
                  className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-accent/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-primary/80 text-white shadow-2xl shadow-accent/20 backdrop-blur-md"
        aria-label={isOpen ? "Close Mohamed AI Bot" : "Open Mohamed AI Bot"}
      >
        <span className="absolute inset-0 rounded-full bg-accent/15 opacity-0 transition group-hover:opacity-100" />
        <span className="absolute -inset-1 rounded-full border border-accent/25 opacity-70 animate-pulse" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "sparkles" : "message"}
            initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            {isOpen ? <Sparkles size={26} /> : <MessageCircle size={27} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
