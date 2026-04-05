import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { BatchCard } from "@/components/batch-card";
import Link from "next/link";
import { PlusCircle, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  const batches = await db
    .select()
    .from(schema.batches)
    .where(eq(schema.batches.user_id, userId))
    .orderBy(desc(schema.batches.created_at));

  const fermenting = batches.filter((b) => b.status === "fermenting").length;
  const inFridge = batches.filter((b) => b.status === "in_fridge").length;
  const finished = batches.filter((b) => b.status === "finished").length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Your Batches</h1>
          <p className="text-text-muted text-sm mt-1">
            Track every batch from first salt to last spoonful.
          </p>
        </div>
        <Link
          href="/batches/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Batch
        </Link>
      </div>

      {/* Stats */}
      {batches.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Fermenting"
            value={fermenting}
            color="accent"
            dot
          />
          <StatCard label="In Fridge" value={inFridge} color="blue" />
          <StatCard label="Finished" value={finished} color="primary" />
        </div>
      )}

      {/* Batches grid */}
      {batches.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  dot,
}: {
  label: string;
  value: number;
  color: "accent" | "blue" | "primary";
  dot?: boolean;
}) {
  const colorMap = {
    accent: "text-accent",
    blue: "text-blue-600",
    primary: "text-primary",
  };
  const dotColorMap = {
    accent: "bg-accent",
    blue: "bg-blue-500",
    primary: "bg-primary",
  };

  return (
    <div className="bg-bg-card rounded-xl border border-border p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {dot && (
          <span
            className={`w-2 h-2 rounded-full ${dotColorMap[color]} fermenting-badge inline-block`}
          />
        )}
        <p className="text-xs text-text-muted">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Layers className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-text mb-2">
        No batches yet
      </h2>
      <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
        Start tracking your first kimchi batch. Record your recipe, monitor
        fermentation, and perfect your craft.
      </p>
      <Link
        href="/batches/new"
        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm"
      >
        <PlusCircle className="w-4 h-4" />
        Start your first batch
      </Link>
    </div>
  );
}
