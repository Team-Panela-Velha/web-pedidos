import { cn } from "@/lib/utils";

type BrandIconProps = {
  className?: string;
};

/** Compact, code-native interpretation of the bowl used by the app logo. */
export function BrandIcon({ className }: BrandIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-7"
      >
        <path
          d="M7 18.5h26c-.8 7.2-5.5 12-13 12s-12.2-4.8-13-12Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 14.5c2.5-2.2 4.8-2.2 7.2 0 2.4 2.2 4.7 2.2 7.1 0 2.4-2.2 4.7-2.2 7.2 0"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M13.5 10.5c.7-1.5 1.8-2.5 3.3-3M21 11c.5-1.8 1.5-3.1 3-4M27.5 11c.8-1.4 1.8-2.3 3-2.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
