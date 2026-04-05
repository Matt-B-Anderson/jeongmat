"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import {
  calculateFermentation,
  getTimelineStages,
} from "@/lib/fermentation";
import { cn, formatDate } from "@/lib/utils";

interface FermentationTimelineProps {
  startDate: string;
  ambientTempC: number;
  fridgeDate?: string | null;
  status?: string;
}

export function FermentationTimeline({
  startDate,
  ambientTempC,
  fridgeDate,
  status,
}: FermentationTimelineProps) {
  const fermentation = useMemo(
    () =>
      calculateFermentation(
        new Date(startDate),
        ambientTempC,
        fridgeDate ? new Date(fridgeDate) : undefined
      ),
    [startDate, ambientTempC, fridgeDate]
  );

  const stages = useMemo(
    () => getTimelineStages(new Date(startDate), fermentation),
    [startDate, fermentation]
  );

  const now = new Date();

  return (
    <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text">Fermentation Timeline</h3>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            {fermentation.stage}
          </span>
        </div>
        <p className="text-sm text-text-muted mt-1">{fermentation.description}</p>
      </div>

      <div className="p-5 space-y-0">
        {stages.map((stage, index) => {
          const isPast = stage.date <= now;
          const isCurrent =
            index < stages.length - 1
              ? stage.date <= now && stages[index + 1].date > now
              : isPast;

          const isLast = index === stages.length - 1;

          return (
            <div key={stage.label} className="relative flex gap-4">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[15px] top-8 bottom-0 w-0.5",
                    isPast ? "bg-primary/30" : "bg-border"
                  )}
                  style={{ height: "calc(100% - 8px)" }}
                />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 w-8 flex justify-center">
                {isPast ? (
                  <CheckCircle2 className="w-8 h-8 text-primary mt-0.5" />
                ) : isCurrent ? (
                  <Clock className="w-8 h-8 text-accent mt-0.5" />
                ) : (
                  <Circle className="w-8 h-8 text-border mt-0.5" />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={cn(
                        "font-medium text-sm",
                        isPast ? "text-text" : "text-text-muted"
                      )}
                    >
                      {stage.icon} {stage.label}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium flex-shrink-0",
                      isPast ? "text-primary" : "text-text-muted"
                    )}
                  >
                    {formatDate(stage.date.toISOString())}
                  </p>
                </div>

                {isCurrent && !isPast && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full border border-accent/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent fermenting-badge inline-block" />
                    Currently in progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="px-5 py-3 bg-bg border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Room temp ferment:{" "}
            <strong className="text-text">
              {fermentation.daysToTaste} days
            </strong>
          </span>
          <span>
            Fully ready:{" "}
            <strong className="text-text">
              {formatDate(fermentation.readyDate.toISOString())}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
