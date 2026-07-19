import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

interface TripOfferCountdownProps {
  endsAt?: string | null;
  className?: string;
}

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days} يوم و${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة و${minutes} دقيقة`;
  return `${minutes} دقيقة و${seconds} ثانية`;
}

export function TripOfferCountdown({ endsAt, className = "" }: TripOfferCountdownProps) {
  const endTime = useMemo(() => (endsAt ? new Date(endsAt).getTime() : Number.NaN), [endsAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!Number.isFinite(endTime) || endTime <= Date.now()) return;

    const interval = window.setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      if (nextNow >= endTime) window.clearInterval(interval);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [endTime]);

  if (!Number.isFinite(endTime) || endTime <= now) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Clock3 className="h-4 w-4" />
      ينتهي العرض خلال {formatRemaining(endTime - now)}
    </span>
  );
}
