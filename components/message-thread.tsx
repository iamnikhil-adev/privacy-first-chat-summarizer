import { formatTime } from "@/lib/format";
import type { AppChat } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageThread({ chat }: { chat: AppChat }) {
  const unreadIndex = chat.lastSeenAt
    ? chat.messages.findIndex(
        (message) => +new Date(message.sentAt) > +new Date(chat.lastSeenAt!)
      )
    : -1;

  return (
    <section className="rounded-[32px] border border-pine/10 bg-[#efeae2] shadow-soft">
      
      {/* 🔹 HEADER */}
      <div className="flex items-center justify-between border-b border-pine/10 bg-white/80 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/55">
            High-activity group context
          </p>

          <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-bold text-pine">
            {chat.title}
          </h2>

          <p className="mt-1 text-sm text-pine/65">{chat.description}</p>

          {/* 🔥 PM ADDITION */}
          <div className="mt-2 flex items-center gap-2 text-xs text-pine/60">
            {chat.isHighActivity && (
              <span className="rounded-full bg-coral/10 px-2 py-1 font-semibold text-coral">
                High Activity
              </span>
            )}
            <span>{chat.unreadCount} unread → summarization candidate</span>
          </div>
        </div>

        {/* 🔹 STATS BOX */}
        <div className="rounded-2xl bg-white px-4 py-3 text-right text-xs text-pine/65 shadow-sm">
          <div>{chat.participantCount} participants</div>
          <div>{chat.unreadCount} unread messages</div>
        </div>
      </div>

      {/* 🔹 MESSAGE AREA */}
      <div
        className="h-[560px] overflow-y-auto bg-grid bg-[length:22px_22px] px-4 py-5"
        style={{ backgroundColor: "#efeae2" }}
      >
        <div className="space-y-3">
          {chat.messages.map((message, index) => {
            const isMine = message.sender === "You";
            const showDivider = unreadIndex === index && chat.unreadCount > 0;

            return (
              <div key={message.id}>
                
                {/* 🔥 UNREAD DIVIDER */}
                {showDivider && (
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-pine/15" />
                    <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      Unread messages
                    </span>
                    <div className="h-px flex-1 bg-pine/15" />
                  </div>
                )}

                {/* 🔹 MESSAGE BUBBLE */}
                <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-[20px] px-4 py-3 shadow-sm",
                      isMine
                        ? "rounded-br-md bg-[#dcf8c6] text-ink"
                        : "rounded-bl-md bg-white text-ink"
                    )}
                  >
                    {!isMine && (
                      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-whatsapp">
                        {message.sender}
                      </div>
                    )}

                    <p className="text-sm leading-6">{message.content}</p>

                    <div className="mt-2 text-right text-[11px] text-pine/50">
                      {formatTime(message.sentAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 PM INSIGHT FOOTER */}
      <div className="border-t border-pine/10 bg-white/70 px-6 py-3 text-xs text-pine/60">
        This chat qualifies for summarization due to high activity and unread message density.
      </div>
    </section>
  );
}