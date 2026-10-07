import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, Trash2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  openChat,
  closeChat,
  addMessage,
  setTyping,
  setError,
  clearMessages,
} from '../aiSlice.js';
import {
  useRagQueryMutation,
  useClearRagHistoryMutation,
} from '../api.js';

export function AIChatWidget() {
  const dispatch = useDispatch();
  const { messages, isOpen, isTyping, error } = useSelector((s) => s.ai);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [ragQuery] = useRagQueryMutation();
  const [clearHistory, { isLoading: clearing }] =
    useClearRagHistoryMutation();

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    dispatch(addMessage({ role: 'user', text }));
    setInput('');
    dispatch(setTyping(true));
    dispatch(setError(null));

    try {
      const res = await ragQuery(text).unwrap();
      console.log('[RAG] response:', res);

      dispatch(
        addMessage({
          role: 'assistant',
          text: res.answer || "Sorry, I couldn't generate a response.",
          sources: res.sources || [],
        })
      );
    } catch (err) {
      console.error('[RAG] error:', err);
      const errorMsg =
        err?.data?.detail ||
        err?.error ||
        'Failed to reach AI assistant. Please try again.';

      dispatch(setError(errorMsg));
      dispatch(
        addMessage({
          role: 'assistant',
          text: `❌ ${errorMsg}`,
          isError: true,
        })
      );
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Clear all chat history? This cannot be undone.')) return;
    try {
      await clearHistory().unwrap();
      dispatch(clearMessages());
    } catch (err) {
      console.error('Clear history failed:', err);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => dispatch(openChat())}
          className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700 hover:shadow-xl"
          aria-label="Open AI assistant"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[440px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-sm">
                🤖
              </div>
              <div>
                <div className="text-sm font-semibold">AI Assistant</div>
                <div className="text-xs text-white/80">
                  Always here to help
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-50"
                title="Clear chat history"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => dispatch(closeChat())}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                  🤖
                </div>
                <div className="flex-1 space-y-2 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Input */}
          <footer className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything…"
                disabled={isTyping}
                className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTyping ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Press Enter to send · Shift+Enter for new line
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Chat Bubble Component — with Markdown Rendering
   ═══════════════════════════════════════════════════════════ */
function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
          🤖
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? 'rounded-tr-sm bg-brand-600 text-white'
            : isError
            ? 'rounded-tl-sm border border-red-200 bg-red-50 text-red-800'
            : 'rounded-tl-sm bg-white text-slate-800'
        }`}
      >
        {/* User message — plain text */}
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.text}</div>
        ) : (
          /* AI message — Markdown rendered */
          <div className="ai-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-3 mb-2 text-lg font-bold text-slate-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-3 mb-2 text-base font-bold text-slate-900">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-2 mb-1.5 text-sm font-bold text-slate-900">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mt-2 mb-1 text-sm font-semibold text-slate-800">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mb-2 leading-relaxed text-slate-700 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 list-disc space-y-1 pl-5 text-slate-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 list-decimal space-y-1 pl-5 text-slate-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-700">{children}</em>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-pink-700">
                      {children}
                    </code>
                  ) : (
                    <pre className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                      <code>{children}</code>
                    </pre>
                  ),
                blockquote: ({ children }) => (
                  <blockquote className="my-2 border-l-4 border-brand-500 bg-brand-50 py-2 pl-3 pr-2 text-sm italic text-slate-700">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 underline hover:text-brand-700"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="my-3 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-slate-200 text-xs">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-100">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-800">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">
                    {children}
                  </td>
                ),
                hr: () => <hr className="my-3 border-slate-200" />,
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}

        {/* RAG Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500">
            <div className="font-medium">Sources:</div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {message.sources.slice(0, 3).map((src, i) => (
                <li key={i} className="truncate">
                  {typeof src === 'string'
                    ? src
                    : src.title || src.name || JSON.stringify(src)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}