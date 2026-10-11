import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PlayerPhoto({
  url,
  first,
  last,
  className,
}: {
  url: string | null;
  first: string;
  last: string;
  className?: string;
}) {
  if (url) {
    return <img src={url} alt={`${first} ${last}`} className={cn("object-cover", className)} />;
  }
  return (
    <div
      className={cn(
        "grid place-items-center bg-muted font-display text-2xl text-muted-foreground",
        className,
      )}
    >
      {initials(first, last)}
    </div>
  );
}
