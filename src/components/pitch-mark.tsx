import { PITCH_COORDS } from "@/lib/football";
import { cn } from "@/lib/utils";

export function PitchMark({
  position,
  className,
}: {
  position: string | null | undefined;
  className?: string;
}) {
  const coord = position ? PITCH_COORDS[position] : null;
  return (
    <svg
      viewBox="0 0 80 120"
      className={cn("text-pitch", className)}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="76" height="116" rx="4" fill="#0e1411" stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="60" x2="78" y2="60" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="40" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <rect x="22" y="2" width="36" height="16" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <rect x="22" y="102" width="36" height="16" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {coord && (
        <circle cx={coord.x * 0.8} cy={coord.y * 1.2} r="4.5" fill="#c5d0c8" />
      )}
    </svg>
  );
}
