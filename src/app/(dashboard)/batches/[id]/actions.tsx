"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Refrigerator, CheckSquare, Archive, Trash2, Loader2 } from "lucide-react";
import type { Batch } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface BatchActionsProps {
  batch: Batch;
}

const STATUS_LABELS: Record<string, string> = {
  fermenting: "Fermenting",
  in_fridge: "In Fridge",
  finished: "Finished",
  archived: "Archived",
};

const STATUS_STYLES: Record<string, string> = {
  fermenting: "bg-accent/10 text-accent border-accent/20",
  in_fridge: "bg-blue-50 text-blue-700 border-blue-200",
  finished: "bg-primary/10 text-primary border-primary/20",
  archived: "bg-border text-text-muted border-border",
};

export function BatchActions({ batch }: BatchActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateStatus = (status: string) => {
    setOpen(false);
    setError(null);
    startTransition(async () => {
      try {
        const body: Record<string, unknown> = { status };
        if (status === "in_fridge" && !batch.fridge_date) {
          body.fridge_date = new Date().toISOString().split("T")[0];
        }
        const res = await fetch(`/api/batches/${batch.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update batch");
        router.refresh();
      } catch {
        setError("Failed to update. Try again.");
      }
    });
  };

  const deleteBatch = () => {
    if (
      !confirm(
        "Delete this batch? This will also delete all tasting notes. This cannot be undone."
      )
    )
      return;
    setOpen(false);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/batches/${batch.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete batch");
        router.push("/dashboard");
      } catch {
        setError("Failed to delete. Try again.");
      }
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm px-3 py-1.5 rounded-full border font-medium",
            STATUS_STYLES[batch.status] ?? STATUS_STYLES.fermenting
          )}
        >
          {STATUS_LABELS[batch.status] ?? batch.status}
        </span>

        <button
          onClick={() => setOpen(!open)}
          disabled={isPending}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-border-light transition-colors disabled:opacity-50"
          aria-label="Batch options"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreVertical className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="absolute right-0 top-full mt-1 text-xs text-accent bg-white border border-accent/20 rounded-lg px-3 py-1.5 whitespace-nowrap z-10">
          {error}
        </p>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-border shadow-lg z-30 overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs text-text-muted font-medium">
                Change Status
              </p>
            </div>
            {batch.status !== "in_fridge" && batch.status !== "finished" && (
              <ActionItem
                icon={<Refrigerator className="w-4 h-4" />}
                label="Move to Fridge"
                onClick={() => updateStatus("in_fridge")}
              />
            )}
            {batch.status !== "finished" && (
              <ActionItem
                icon={<CheckSquare className="w-4 h-4" />}
                label="Mark as Finished"
                onClick={() => updateStatus("finished")}
              />
            )}
            {batch.status !== "fermenting" && (
              <ActionItem
                icon={<span className="text-sm">🥬</span>}
                label="Back to Fermenting"
                onClick={() => updateStatus("fermenting")}
              />
            )}
            {batch.status !== "archived" && (
              <ActionItem
                icon={<Archive className="w-4 h-4" />}
                label="Archive"
                onClick={() => updateStatus("archived")}
              />
            )}
            <div className="border-t border-border">
              <ActionItem
                icon={<Trash2 className="w-4 h-4" />}
                label="Delete Batch"
                onClick={deleteBatch}
                danger
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActionItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors",
        danger
          ? "text-accent hover:bg-accent/5"
          : "text-text hover:bg-bg"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
