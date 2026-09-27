import { format, formatDistanceToNowStrict } from "date-fns";

export function formatTime(value: string) {
  return format(new Date(value), "h:mm a");
}

export function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, h:mm a");
}

export function formatRelativeTime(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}
