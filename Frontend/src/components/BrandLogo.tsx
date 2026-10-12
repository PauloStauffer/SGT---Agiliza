import logo from "@/assets/agiliza-logo.png";
import logoMark from "@/assets/agiliza-logo-mark.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <img
      src={compact ? logoMark : logo}
      alt={compact ? "" : "Agiliza"}
      width={compact ? 270 : 930}
      height={compact ? 263 : 284}
      className={cn("block object-contain", className)}
    />
  );
}

export function BrandLockup({ className, iconClassName, textClassName }: { className?: string; iconClassName?: string; textClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandLogo compact className={cn("size-10 shrink-0", iconClassName)} />
      <span className={cn("font-display text-2xl font-extrabold", textClassName)}>Agiliza</span>
    </span>
  );
}