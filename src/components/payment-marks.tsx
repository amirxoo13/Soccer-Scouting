import { cn } from "@/lib/utils";

type MarkProps = { className?: string; title?: string };

export function VisaMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 48 16" className={cn("h-5 w-auto", className)} aria-label="Visa">
      <text x="0" y="13" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="14" fontWeight="800" fill="#1a1f71" letterSpacing="-0.5">
        VISA
      </text>
    </svg>
  );
}

export function MastercardMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 40 24" className={cn("h-6 w-auto", className)} aria-label="Mastercard">
      <circle cx="15" cy="12" r="10" fill="#eb001b" />
      <circle cx="25" cy="12" r="10" fill="#f79e1b" />
      <path d="M20 4.4a10 10 0 0 1 0 15.2 10 10 0 0 1 0-15.2Z" fill="#ff5f00" />
    </svg>
  );
}

export function AmexMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 48 16" className={cn("h-5 w-auto", className)} aria-label="American Express">
      <rect width="48" height="16" rx="2" fill="#006fcf" />
      <text x="24" y="11.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        AMEX
      </text>
    </svg>
  );
}

export function PayPalMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 16" className={cn("h-5 w-auto", className)} aria-label="PayPal">
      <text x="0" y="13" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#003087">
        Pay
      </text>
      <text x="28" y="13" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#009cde">
        Pal
      </text>
    </svg>
  );
}

export function UsdtMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-label="USDT">
      <circle cx="12" cy="12" r="12" fill="#26a17b" />
      <path fill="#fff" d="M13.1 11.3V8.8h3.2V6.6H7.7v2.2h3.2v2.5C7.8 11.5 6 12.4 6 13.6c0 1.4 2.3 2.5 6 2.5s6-1.1 6-2.5c0-1.2-1.8-2.1-4.9-2.3Zm-1.1 3.3c-2.7 0-4.4-.7-4.4-1.4s1.7-1.4 4.4-1.4 4.4.7 4.4 1.4-1.7 1.4-4.4 1.4Z" />
    </svg>
  );
}

export function BtcMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-label="Bitcoin">
      <circle cx="12" cy="12" r="12" fill="#f7931a" />
      <text x="12" y="16.5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="Georgia, serif">
        ₿
      </text>
    </svg>
  );
}

export function EthMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-label="Ethereum">
      <circle cx="12" cy="12" r="12" fill="#627eea" />
      <path fill="#fff" fillOpacity=".8" d="M12 4.2 7.5 12.1 12 14.8l4.5-2.7z" />
      <path fill="#fff" d="M12 4.2v10.6l4.5-2.7z" />
      <path fill="#fff" fillOpacity=".8" d="M12 16.1 7.5 13.3 12 20.2z" />
      <path fill="#fff" d="M12 16.1v4.1l4.5-6.9z" />
    </svg>
  );
}

export function ApplePayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 52 16" className={cn("h-5 w-auto", className)} aria-label="Apple Pay">
      <text x="0" y="13" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="currentColor">
        Apple Pay
      </text>
    </svg>
  );
}

export function GooglePayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 56 16" className={cn("h-5 w-auto", className)} aria-label="Google Pay">
      <text x="0" y="13" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="currentColor">
        G Pay
      </text>
    </svg>
  );
}

export const PAYMENT_STRIP = [
  { id: "visa", node: VisaMark },
  { id: "mastercard", node: MastercardMark },
  { id: "amex", node: AmexMark },
  { id: "paypal", node: PayPalMark },
  { id: "apple", node: ApplePayMark },
  { id: "google", node: GooglePayMark },
  { id: "usdt", node: UsdtMark },
  { id: "btc", node: BtcMark },
  { id: "eth", node: EthMark },
] as const;

export function PaymentStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-foreground", className)}>
      {PAYMENT_STRIP.map((item) => {
        const Icon = item.node;
        return (
          <span key={item.id} className="pay-chip grid h-8 place-items-center rounded-md px-2">
            <Icon />
          </span>
        );
      })}
    </div>
  );
}
