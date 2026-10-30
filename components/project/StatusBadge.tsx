import { Badge } from "@/components/ui/Badge";
import type { Status } from "@/lib/schema";

const tone: Record<Status, "success" | "warning" | "neutral" | "muted"> = {
  live: "success",
  "live-cold": "warning",
  code: "neutral",
  archived: "muted",
};

export function StatusBadge({ status, labels }: { status: Status; labels: Record<Status, string> }) {
  return (
    <Badge tone={tone[status]}>
      <span
        aria-hidden
        className={
          status === "live" || status === "live-cold" ? "size-1.5 rounded-full bg-current" : "hidden"
        }
      />
      {labels[status]}
    </Badge>
  );
}
