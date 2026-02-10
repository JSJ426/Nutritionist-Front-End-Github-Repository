import { cn } from "./ui/utils";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  showLabel?: boolean;
  estimatedWaitSeconds?: number;
  fullScreen?: boolean;
  className?: string;
  containerClassName?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export function Spinner({
  size = "md",
  label = "로딩 중",
  showLabel = false,
  estimatedWaitSeconds,
  fullScreen = false,
  className,
  containerClassName,
}: SpinnerProps) {
  const formattedWait =
    typeof estimatedWaitSeconds === "number"
      ? formatEstimatedWait(estimatedWaitSeconds)
      : null;

  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        "inline-flex items-center gap-2",
        fullScreen &&
          "fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm",
        containerClassName,
      )}
    >
      <div
        data-slot="spinner"
        className={cn(
          "animate-spin rounded-full border-muted-foreground/40 border-t-foreground",
          sizeClasses[size],
          className,
        )}
      />
      {label || formattedWait ? (
        <div className={cn("flex flex-col", !showLabel && "sr-only")}>
          {label ? (
            <span className="text-sm text-muted-foreground">{label}</span>
          ) : null}
          {formattedWait ? (
            <span className="text-xs text-muted-foreground">
              예상 대기 시간: {formattedWait}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function formatEstimatedWait(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  return `약 ${safeSeconds}초`;
}
