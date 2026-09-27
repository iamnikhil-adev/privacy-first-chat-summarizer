import Link from "next/link";
import { MessageSquareText, Users, Volume2 } from "lucide-react";
import type { AppChat } from "@/lib/types";
import { cn, formatCompactNumber } from "@/lib/utils";

export function GroupSidebar({
  chats,
  selectedChatId
}: {
  chats: AppChat[];
  selectedChatId?: string;
}) {
  return (
    <aside className="rounded-[28px] border border-pine/10 bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4 border-b border-pine/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/55">Supported in v1</p>
          <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-bold text-pine">
            Group overload, not DMs
          </h2>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-2 text-right text-xs text-pine/70">
          <div>Large groups</div>
          <div>Communities</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/?chat=${chat.id}`}
            className={cn(
              "block rounded-[24px] border p-4 transition hover:-translate-y-0.5 hover:border-pine/20 hover:bg-mist/70",
              selectedChatId === chat.id
                ? "border-pine bg-mist shadow-md"
                : "border-pine/10 bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-pine">{chat.title}</h3>
                <p className="mt-1 text-sm text-pine/65">{chat.description}</p>
              </div>
              <span className="rounded-full bg-whatsapp px-2.5 py-1 text-xs font-semibold text-white">
                {chat.unreadCount} unread
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-pine/60">
              <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1">
                <Users className="size-3.5" />
                {formatCompactNumber(chat.participantCount)} members
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1">
                <Volume2 className="size-3.5" />
                High activity
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1">
                <MessageSquareText className="size-3.5" />
                {chat.type === "COMMUNITY" ? "Community" : "Group"}
              </span>
              {chat.summaryOptOut ? (
                <span className="inline-flex rounded-full bg-coral/15 px-2.5 py-1 font-medium text-coral">
                  Summaries paused
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
