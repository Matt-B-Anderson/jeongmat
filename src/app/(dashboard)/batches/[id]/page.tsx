import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { notFound } from "next/navigation";
import { FermentationTimeline } from "@/components/fermentation-timeline";
import { TastingForm } from "@/components/tasting-form";
import {
  ChevronLeft,
  Star,
  Thermometer,
  FlaskConical,
  Clock,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { formatDate, saltPercentage, daysAgo } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { BatchActions } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  return { title: `Batch ${id}` };
}

const KIMCHI_TYPE_LABELS: Record<string, string> = {
  baechu: "배추김치 Baechu-kimchi",
  kkakdugi: "깍두기 Kkakdugi",
  yeolmu: "열무김치 Yeolmu",
  oi_sobagi: "오이소박이 Oi Sobagi",
  white: "백김치 Baek-kimchi",
  nabak: "나박김치 Nabak",
  other: "기타 Other",
};

export default async function BatchDetailPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  const [batch] = await db
    .select()
    .from(schema.batches)
    .where(and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId)))
    .limit(1);

  if (!batch) notFound();

  const tastings = await db
    .select()
    .from(schema.tasting_logs)
    .where(eq(schema.tasting_logs.batch_id, id))
    .orderBy(desc(schema.tasting_logs.tasting_date));

  const saltPct = saltPercentage(batch.salt_amount_g, batch.cabbage_weight_g);
  const days = daysAgo(batch.start_date);
  const kimchiLabel = KIMCHI_TYPE_LABELS[batch.kimchi_type] ?? batch.kimchi_type;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back nav */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        All Batches
      </Link>

      {/* Header */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div
          className={`h-1.5 ${
            batch.status === "fermenting"
              ? "bg-accent"
              : batch.status === "in_fridge"
                ? "bg-blue-500"
                : "bg-primary"
          }`}
        />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-primary">{batch.name}</h1>
              <p className="text-text-muted mt-0.5">{kimchiLabel}</p>
              <p className="text-sm text-text-muted mt-1">
                Started {formatDate(batch.start_date)} · {days} days ago
              </p>
            </div>

            <BatchActions batch={batch} />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <QuickStat
              icon={<FlaskConical className="w-4 h-4" />}
              label="Salt Ratio"
              value={`${saltPct}%`}
            />
            <QuickStat
              icon={<Thermometer className="w-4 h-4" />}
              label="Temperature"
              value={`${batch.ambient_temp_c}°C / ${Math.round(batch.ambient_temp_c * 9 / 5 + 32)}°F`}
            />
            <QuickStat
              icon={<Clock className="w-4 h-4" />}
              label="Age"
              value={`${days} days`}
            />
            <QuickStat
              icon={<Leaf className="w-4 h-4" />}
              label="Weight"
              value={`${batch.cabbage_weight_g}g`}
            />
          </div>

          {/* Dietary tags */}
          <div className="flex gap-2 mt-4">
            {Boolean(batch.is_vegan) && <Tag label="Vegan" color="green" />}
            {Boolean(batch.is_shellfish_free) && (
              <Tag label="Shellfish-Free" color="blue" />
            )}
            {Boolean(batch.is_gluten_free) && (
              <Tag label="Gluten-Free" color="gold" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Fermentation Timeline — full width */}
        <div className="md:col-span-2">
          <FermentationTimeline
            startDate={batch.start_date}
            ambientTempC={batch.ambient_temp_c}
            fridgeDate={batch.fridge_date}
            status={batch.status}
          />
        </div>

        {/* Recipe Details */}
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Recipe Details
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <RecipeRow label="Cabbage / Veg" value={`${batch.cabbage_weight_g}g`} />
            <RecipeRow
              label="Salt"
              value={`${batch.salt_amount_g}g (${saltPct}%) · ${batch.salt_type.replace(/_/g, " ")}`}
            />
            {batch.gochugaru_amount_g != null && (
              <RecipeRow label="Gochugaru" value={`${batch.gochugaru_amount_g}g`} />
            )}
            {batch.garlic_amount_g != null && (
              <RecipeRow label="Garlic" value={`${batch.garlic_amount_g}g`} />
            )}
            {batch.ginger_amount_g != null && (
              <RecipeRow label="Ginger" value={`${batch.ginger_amount_g}g`} />
            )}
            {batch.fish_sauce_ml != null && (
              <RecipeRow label="Fish Sauce" value={`${batch.fish_sauce_ml}ml`} />
            )}
            {batch.saeujeot_amount_g != null && (
              <RecipeRow label="Saeujeot" value={`${batch.saeujeot_amount_g}g`} />
            )}
            {batch.container_type && (
              <RecipeRow
                label="Container"
                value={batch.container_type.replace(/_/g, " ")}
              />
            )}
          </div>
        </div>

        {/* Overall Rating & Lessons */}
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Batch Rating
            </h2>
          </div>
          <div className="p-5">
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    batch.overall_rating && star <= batch.overall_rating
                      ? "fill-gold text-gold"
                      : "text-border"
                  }`}
                />
              ))}
              {batch.overall_rating && (
                <span className="ml-2 text-sm text-text-muted self-center">
                  {batch.overall_rating}/5
                </span>
              )}
              {!batch.overall_rating && (
                <span className="ml-2 text-sm text-text-muted self-center">
                  Not yet rated
                </span>
              )}
            </div>

            {batch.lessons_learned && (
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1.5">
                  Lessons Learned
                </p>
                <p className="text-sm text-text leading-relaxed">
                  {batch.lessons_learned}
                </p>
              </div>
            )}

            {!batch.lessons_learned && !batch.overall_rating && (
              <p className="text-sm text-text-muted italic">
                Rate this batch after it&apos;s finished to capture your
                learnings.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recipe notes */}
      {batch.recipe_notes && (
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Recipe Notes
            </h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
              {batch.recipe_notes}
            </p>
          </div>
        </div>
      )}

      {/* Tasting logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add tasting note */}
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Add Tasting Note
            </h2>
          </div>
          <div className="p-5">
            <TastingForm batchId={id} />
          </div>
        </div>

        {/* Tasting history */}
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Tasting History
            </h2>
          </div>
          <div className="divide-y divide-border">
            {tastings.length === 0 ? (
              <div className="p-5 text-center text-sm text-text-muted">
                No tasting notes yet. Add your first taste!
              </div>
            ) : (
              tastings.map((t) => (
                <div key={t.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-text">
                      {formatDate(t.tasting_date)}
                    </p>
                    {t.overall != null && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= t.overall!
                                ? "fill-gold text-gold"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
                    {t.sourness != null && (
                      <TasteMetric label="🍋 Sourness" value={t.sourness} />
                    )}
                    {t.saltiness != null && (
                      <TasteMetric label="🧂 Saltiness" value={t.saltiness} />
                    )}
                    {t.crunch != null && (
                      <TasteMetric label="🌿 Crunch" value={t.crunch} />
                    )}
                    {t.fizz != null && (
                      <TasteMetric label="✨ Fizz" value={t.fizz} />
                    )}
                  </div>

                  {t.notes && (
                    <p className="text-xs text-text-muted mt-1 italic">
                      &ldquo;{t.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-bg rounded-lg p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5 text-xs">
        {icon}
        {label}
      </div>
      <p className="font-semibold text-text text-sm">{value}</p>
    </div>
  );
}

function RecipeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-text-muted flex-shrink-0">{label}</span>
      <span className="text-text font-medium text-right capitalize">{value}</span>
    </div>
  );
}

function Tag({
  label,
  color,
}: {
  label: string;
  color: "green" | "blue" | "gold";
}) {
  const colorMap = {
    green: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gold: "bg-gold/10 text-gold border-gold/20",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}

function TasteMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${s <= value ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
