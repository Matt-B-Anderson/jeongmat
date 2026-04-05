"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TastingFormProps {
  batchId: string;
}

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  emoji?: string;
}

function RatingInput({ label, value, onChange, emoji }: RatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-muted">
        {emoji} {label}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`Rate ${label} ${star} out of 5`}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                (hovered ? star <= hovered : star <= value)
                  ? "fill-gold text-gold"
                  : "text-border"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function TastingForm({ batchId }: TastingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [sourness, setSourness] = useState(0);
  const [saltiness, setSaltiness] = useState(0);
  const [crunch, setCrunch] = useState(0);
  const [fizz, setFizz] = useState(0);
  const [overall, setOverall] = useState(0);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/batches/${batchId}/tastings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tasting_date: date,
            sourness: sourness || null,
            saltiness: saltiness || null,
            crunch: crunch || null,
            fizz: fizz || null,
            overall: overall || null,
            notes: notes.trim() || null,
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(data.error ?? "Failed to save tasting note");
        }

        setSuccess(true);
        setSourness(0);
        setSaltiness(0);
        setCrunch(0);
        setFizz(0);
        setOverall(0);
        setNotes("");
        setDate(new Date().toISOString().split("T")[0]);

        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg px-4 py-3 text-sm font-medium">
          Tasting note saved!
        </div>
      )}
      {error && (
        <div className="bg-accent/10 text-accent border border-accent/20 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Tasting Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Ratings */}
      <div className="bg-bg rounded-lg p-4 space-y-3">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
          Flavour Profile
        </p>
        <RatingInput
          label="Sourness"
          value={sourness}
          onChange={setSourness}
          emoji="🍋"
        />
        <RatingInput
          label="Saltiness"
          value={saltiness}
          onChange={setSaltiness}
          emoji="🧂"
        />
        <RatingInput
          label="Crunch"
          value={crunch}
          onChange={setCrunch}
          emoji="🌿"
        />
        <RatingInput label="Fizz" value={fizz} onChange={setFizz} emoji="✨" />
        <div className="border-t border-border pt-3">
          <RatingInput
            label="Overall"
            value={overall}
            onChange={setOverall}
            emoji="⭐"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Notes{" "}
          <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Texture, aroma, colour, anything notable…"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Saving…" : "Add Tasting Note"}
      </button>
    </form>
  );
}
