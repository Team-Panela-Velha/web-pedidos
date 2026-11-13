import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/services/apiService";

type ChatMessage = { id: number; role: "assistant" | "user"; content: string };
type ChatResponse = { response: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", content: "Olá! Posso ajudar com informações sobre cardápio, pedidos e comandas. O que você precisa?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || sending) return;

    setMessage("");
    setSending(true);
    setMessages((current) => [...current, { id: nextId.current++, role: "user", content }]);

    try {
      const result = await apiService.post<ChatResponse, { message: string }>("/chat", { message: content });
      setMessages((current) => [...current, {
        id: nextId.current++,
        role: "assistant",
        content: result.response || "Não consegui gerar uma resposta. Tente novamente.",
      }]);
    } catch {
      setMessages((current) => [...current, {
        id: nextId.current++,
        role: "assistant",
        content: "Não foi possível falar com o agente agora. Verifique sua conexão e tente novamente.",
      }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Chat com o agente"
          className="flex h-[min(640px,calc(100dvh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-floating)]"
        >
          <header className="flex items-center gap-3 border-b bg-sidebar px-4 py-3.5">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold">Agente Pokes &amp; Boas</h2>
              <p className="text-xs text-muted-foreground">Assistente operacional</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Fechar chat" onClick={() => setOpen(false)}>
              <X aria-hidden="true" />
            </Button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-muted/40 p-4" aria-live="polite">
            {messages.map((item) => (
              <div key={item.id} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  item.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border bg-card text-card-foreground shadow-sm"
                }`}>
                  {item.content}
                </p>
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                O agente está pensando…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t bg-card p-3">
            <label htmlFor="agent-chat-message" className="sr-only">Escreva sua mensagem</label>
            <div className="flex items-end gap-2">
              <Textarea
                id="agent-chat-message"
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, 4000))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Escreva sua mensagem…"
                maxLength={4000}
                rows={1}
                disabled={sending}
                className="max-h-32 min-h-11 flex-1 resize-none py-2.5 text-sm"
              />
              <Button type="submit" size="icon" aria-label="Enviar mensagem" disabled={sending || !message.trim()}>
                <Send aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">Enter para enviar · Shift+Enter para nova linha</p>
          </form>
        </section>
      )}

      <Button
        size="icon"
        aria-label={open ? "Fechar chat com agente" : "Abrir chat com agente"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="size-14 rounded-full shadow-[var(--shadow-floating)]"
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
      </Button>
    </div>
  );
}
