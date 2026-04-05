import Link from "next/link";
import { Clock, Thermometer, Star, FlaskConical } from "lucide-react";
import type { Batch } from "@/lib/db/schema";
import { cn, daysAgo, formatDate, saltPercentage } from "@/lib/utils";
import { calculateFermentation } from "@/lib/fermentation";

interface BatchCardProps {
  batch: Batch;
}

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  fermenting: {
    label: "Fermenting",
    className: "bg-accent/10 text-accent border-accent/20",
    dot: "bg-accent fermenting-badge",
  },
  in_fridge: {
    label: "In Fridge",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  finished: {
    label: "Finished",
    className: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  archived: {
    label: "Archived",
    className: "bg-border text-text-muted border-border",
    dot: "bg-text-muted",
  },
};

const KIMCHI_TYPE_LABELS: Record<string, string> = {
  baechu: "배추김치 Baechu",
  kkakdugi: "깍두기 Kkakdugi",
  yeolmu: "열무김치 Yeolmu",
  oi_sobagi: "오이소박이 Oi Sobagi",
  white: "백김치 White",
  nabak: "나박김치 Nabak",
  other: "기타 Other",
};

export function BatchCard({ batch }: BatchCardProps) {
  const status = STATUS_STYLES[batch.status] ?? STATUS_STYLES.fermenting;
  const days = daysAgo(batch.start_date);
  const saltPct = saltPercentage(batch.salt_amount_g, batch.cabbage_weight_g);

  const fermentation = calculateFermentation(
    new Date(batch.start_date),
    batch.ambient_temp_c,
    batch.fridge_date ? new Date(batch.fridge_date) : undefined
  );

  const kimchiLabel =
    KIMCHI_TYPE_LABELS[batch.kimchi_type] ?? batch.kimchi_type;

  return (
    <Link
      href={`/batches/${batch.id}`}
      className="block bg-bg-card rounded-xl border border-border card-hover overflow-hidden group"
    >
      {/* Status bar */}
      <div
        className={cn(
          "h-1",
          batch.status === "fermenting"
            ? "bg-accent"
            : batch.status === "in_fridge"
              ? "bg-blue-500"
              : batch.status === "finished"
                ? "bg-primary"
                : "bg-border"
        )}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text truncate group-hover:text-primary transition-colors">
              {batch.name}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">{kimchiLabel}</p>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border flex-shrink-0",
              status.className
            )}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full inline-block", status.dot)}
            />
            {status.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Stat
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Age"
            value={`${days}d`}
          />
          <Stat
            icon={<Thermometer className="w-3.5 h-3.5" />}
            label="Temp"
            value={`${batch.ambient_temp_c}°C`}
          />
          <Stat
            icon={<FlaskConical className="w-3.5 h-3.5" />}
            label="Salt"
            value={`${saltPct}%`}
          />
        </div>

        {/* Timeline preview */}
        <div className="bg-bg rounded-lg p-3 text-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span>Taste by</span>
            <span className="font-medium text-text">
              {formatDate(fermentation.moveFridgeDate.toISOString())}
            </span>
          </div>
          <div className="flex items-center justify-between text-text-muted">
            <span>Well fermented</span>
            <span className="font-medium text-text">
              {formatDate(fermentation.readyDate.toISOString())}
            </span>
          </div>
        </div>

        {/* Rating + dietary tags */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-3.5 h-3.5",
                  batch.overall_rating && star <= batch.overall_rating
                    ? "fill-gold text-gold"
                    : "text-border"
                )}
              />
            ))}
            {!batch.overall_rating && (
              <span className="text-xs text-text-muted ml-1">Unrated</span>
            )}
          </div>

          <div className="flex gap-1">
            {Boolean(batch.is_vegan) && (
              <DietTag label="V" title="Vegan" color="green" />
            )}
            {Boolean(batch.is_shellfish_free) && (
              <DietTag label="SF" title="Shellfish-Free" color="blue" />
            )}
            {Boolean(batch.is_gluten_free) && (
              <DietTag label="GF" title="Gluten-Free" color="gold" />
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-text-muted">
          Started {formatDate(batch.start_date)}
        </p>
      </div>
    </Link>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center bg-bg rounded-lg p-2">
      <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-text">{value}</p>
    </div>
  );
}

function DietTag({
  label,
  title,
  color,
}: {
  label: string;
  title: string;
  color: "green" | "blue" | "gold";
}) {
  const colorMap = {
    green: "bg-primary/10 text-primary",
    blue: "bg-blue-50 text-blue-700",
    gold: "bg-gold/10 text-gold",
  };
  return (
    <span
      title={title}
      className={cn(
        "text-xs font-medium px-1.5 py-0.5 rounded text-[10px]",
        colorMap[color]
      )}
    >
      {label}
    </span>
  );
}
