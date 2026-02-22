import { useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL as string | undefined;

const starterPrompts = [
  'Show latest motorcycles',
  'How does leasing work?',
  'How can I contact support?',
];

const getFallbackReply = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes('lease') || normalized.includes('leasing')) {
    return 'Leasing is available through our Leasing Offer page. You can compare plans, submit your details, and our team will contact you with approval steps.';
  }

  if (normalized.includes('book') || normalized.includes('booking') || normalized.includes('test ride')) {
    return 'You can book directly from each motorcycle details page. Open a bike, choose your preferred schedule, and confirm in a few clicks.';
  }

  if (normalized.includes('contact') || normalized.includes('support') || normalized.includes('help')) {
    return 'You can reach support from the Contact Us page. Share your question and we will get back quickly.';
  }

  if (normalized.includes('price') || normalized.includes('cost') || normalized.includes('budget')) {
    return 'You can explore pricing in the Motorcycle Catalog and use filters to find options that match your budget.';
  }

  return 'I can help with motorcycles, leasing, booking, and support. Ask me anything about finding your next ride.';
};

const createMessage = (role: ChatRole, content: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
});

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', 'Hi! I’m your ride assistant. How can I help today?'),
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const requestAssistantReply = async (nextMessages: ChatMessage[], userText: string) => {
    if (!CHATBOT_API_URL) {
      return getFallbackReply(userText);
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: nextMessages.slice(-10).map((item) => ({ role: item.role, content: item.content })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Chat service failed');
      }

      const data = (await response.json()) as { reply?: string; message?: string };
      const reply = data.reply || data.message;

      if (!reply) {
        throw new Error('Invalid chat service response');
      }

      return reply;
    } catch {
      return getFallbackReply(userText);
    } finally {
      window.clearTimeout(timer);
    }
  };

  const sendMessage = async (value?: string) => {
    const text = (value ?? input).trim();
    if (!text || isSending) return;

    const userMessage = createMessage('user', text);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    const reply = await requestAssistantReply(nextMessages, text);

    setMessages((prev) => [...prev, createMessage('assistant', reply)]);
    setIsSending(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.22)] sm:right-6">
          <div className="flex items-center justify-between border-b border-slate-100 bg-sky-500 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Ride Assistant</p>
              <p className="text-xs text-white/85">Online now</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-white/90 transition hover:bg-white/20"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'ml-auto bg-sky-500 text-white'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isSending && (
              <div className="max-w-[85%] rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-600"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask about motorcycles, leasing, booking..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <button
                type="button"
                onClick={() => {
                  void sendMessage();
                }}
                disabled={!canSend}
                className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(14,116,244,0.35)] transition hover:bg-sky-600 sm:right-6"
        aria-label="Toggle chat assistant"
      >
        💬 Chat
      </button>
    </>
  );
}
