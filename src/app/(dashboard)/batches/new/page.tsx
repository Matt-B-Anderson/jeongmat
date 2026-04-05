"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SaltCalculator } from "@/components/salt-calculator";
import { ChevronLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const KIMCHI_TYPES = [
  { value: "baechu", label: "배추김치 Baechu-kimchi (Napa Cabbage)" },
  { value: "kkakdugi", label: "깍두기 Kkakdugi (Radish)" },
  { value: "yeolmu", label: "열무김치 Yeolmu (Young Radish)" },
  { value: "oi_sobagi", label: "오이소박이 Oi Sobagi (Cucumber)" },
  { value: "white", label: "백김치 Baek-kimchi (White, mild)" },
  { value: "nabak", label: "나박김치 Nabak (Water)" },
  { value: "other", label: "기타 Other" },
];

const SALT_TYPES = [
  { value: "coarse_sea", label: "Coarse Sea Salt (천일염)" },
  { value: "fine_sea", label: "Fine Sea Salt" },
  { value: "kosher", label: "Kosher Salt" },
  { value: "himalayan", label: "Himalayan Pink Salt" },
];

const CONTAINER_TYPES = [
  { value: "onggi", label: "옹기 Onggi (Traditional clay jar)" },
  { value: "glass_jar", label: "Glass jar" },
  { value: "plastic_container", label: "Plastic container" },
  { value: "kimchi_fridge", label: "Kimchi refrigerator container" },
  { value: "ziplock", label: "Ziplock bag" },
  { value: "other", label: "Other" },
];

interface FormData {
  name: string;
  kimchi_type: string;
  cabbage_weight_g: string;
  salt_amount_g: string;
  salt_type: string;
  gochugaru_amount_g: string;
  fish_sauce_ml: string;
  saeujeot_amount_g: string;
  garlic_amount_g: string;
  ginger_amount_g: string;
  container_type: string;
  ambient_temp_c: string;
  start_date: string;
  recipe_notes: string;
  is_vegan: boolean;
  is_shellfish_free: boolean;
  is_gluten_free: boolean;
}

const defaultForm: FormData = {
  name: "",
  kimchi_type: "baechu",
  cabbage_weight_g: "",
  salt_amount_g: "",
  salt_type: "coarse_sea",
  gochugaru_amount_g: "",
  fish_sauce_ml: "",
  saeujeot_amount_g: "",
  garlic_amount_g: "",
  ginger_amount_g: "",
  container_type: "glass_jar",
  ambient_temp_c: "18",
  start_date: new Date().toISOString().split("T")[0],
  recipe_notes: "",
  is_vegan: false,
  is_shellfish_free: false,
  is_gluten_free: false,
};

export default function NewBatchPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const cabbageWeightG = parseFloat(form.cabbage_weight_g) || undefined;

  const handleSaltApply = (saltG: number) => {
    set("salt_amount_g", saltG.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload = {
          name: form.name.trim(),
          kimchi_type: form.kimchi_type,
          cabbage_weight_g: parseFloat(form.cabbage_weight_g),
          salt_amount_g: parseFloat(form.salt_amount_g),
          salt_type: form.salt_type,
          gochugaru_amount_g:
            form.gochugaru_amount_g ? parseFloat(form.gochugaru_amount_g) : null,
          fish_sauce_ml:
            form.fish_sauce_ml ? parseFloat(form.fish_sauce_ml) : null,
          saeujeot_amount_g:
            form.saeujeot_amount_g ? parseFloat(form.saeujeot_amount_g) : null,
          garlic_amount_g:
            form.garlic_amount_g ? parseFloat(form.garlic_amount_g) : null,
          ginger_amount_g:
            form.ginger_amount_g ? parseFloat(form.ginger_amount_g) : null,
          container_type: form.container_type || null,
          ambient_temp_c: parseFloat(form.ambient_temp_c),
          start_date: form.start_date,
          recipe_notes: form.recipe_notes.trim() || null,
          is_vegan: form.is_vegan,
          is_shellfish_free: form.is_shellfish_free,
          is_gluten_free: form.is_gluten_free,
        };

        const res = await fetch("/api/batches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(data.error ?? "Failed to create batch");
        }

        const batch = (await res.json()) as { id: string };
        router.push(`/batches/${batch.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-primary">New Batch</h1>
        <p className="text-text-muted text-sm mt-1">
          Record your kimchi recipe for this batch.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-accent/10 text-accent border border-accent/20 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Section title="Batch Info">
          <Field label="Batch Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              placeholder="e.g. Mum's Winter Baechu 2025"
              className={inputClass}
            />
          </Field>

          <Field label="Kimchi Type" required>
            <select
              value={form.kimchi_type}
              onChange={(e) => set("kimchi_type", e.target.value)}
              className={inputClass}
            >
              {KIMCHI_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" required>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field
              label="Ambient Temp (°C)"
              required
              hint="Temperature where kimchi will ferment"
            >
              <div className="relative">
                <input
                  type="number"
                  value={form.ambient_temp_c}
                  onChange={(e) => set("ambient_temp_c", e.target.value)}
                  required
                  min={10}
                  max={35}
                  step={0.5}
                  className={inputClass}
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* Salting */}
        <Section title="Salting">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cabbage / Veg Weight (g)" required>
              <input
                type="number"
                value={form.cabbage_weight_g}
                onChange={(e) => set("cabbage_weight_g", e.target.value)}
                required
                min={0}
                step={1}
                placeholder="e.g. 2000"
                className={inputClass}
              />
            </Field>
            <Field label="Salt Amount (g)" required>
              <input
                type="number"
                value={form.salt_amount_g}
                onChange={(e) => set("salt_amount_g", e.target.value)}
                required
                min={0}
                step={1}
                placeholder="e.g. 50"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Salt Type" required>
            <select
              value={form.salt_type}
              onChange={(e) => set("salt_type", e.target.value)}
              className={inputClass}
            >
              {SALT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          {/* Salt calculator widget */}
          <SaltCalculator
            onApply={handleSaltApply}
            cabbageWeight={cabbageWeightG}
          />
        </Section>

        {/* Seasoning */}
        <Section title="Seasoning (Yangnyeom)">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gochugaru (g)" hint="Korean red pepper flakes">
              <input
                type="number"
                value={form.gochugaru_amount_g}
                onChange={(e) => set("gochugaru_amount_g", e.target.value)}
                min={0}
                step={1}
                placeholder="e.g. 80"
                className={inputClass}
              />
            </Field>
            <Field label="Garlic (g)">
              <input
                type="number"
                value={form.garlic_amount_g}
                onChange={(e) => set("garlic_amount_g", e.target.value)}
                min={0}
                step={1}
                placeholder="e.g. 30"
                className={inputClass}
              />
            </Field>
            <Field label="Ginger (g)">
              <input
                type="number"
                value={form.ginger_amount_g}
                onChange={(e) => set("ginger_amount_g", e.target.value)}
                min={0}
                step={1}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </Field>
            <Field label="Fish Sauce (ml)">
              <input
                type="number"
                value={form.fish_sauce_ml}
                onChange={(e) => set("fish_sauce_ml", e.target.value)}
                min={0}
                step={1}
                placeholder="e.g. 30"
                className={inputClass}
              />
            </Field>
            <Field label="Saeujeot (g)" hint="Salted shrimp">
              <input
                type="number"
                value={form.saeujeot_amount_g}
                onChange={(e) => set("saeujeot_amount_g", e.target.value)}
                min={0}
                step={1}
                placeholder="e.g. 20"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {/* Container */}
        <Section title="Storage">
          <Field label="Container Type">
            <select
              value={form.container_type}
              onChange={(e) => set("container_type", e.target.value)}
              className={inputClass}
            >
              {CONTAINER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        {/* Dietary */}
        <Section title="Dietary">
          <div className="space-y-3">
            <CheckboxField
              label="Vegan"
              hint="No fish sauce, no saeujeot, no other animal products"
              checked={form.is_vegan}
              onChange={(v) => set("is_vegan", v)}
            />
            <CheckboxField
              label="Shellfish-Free"
              hint="No saeujeot (salted shrimp) or other shellfish ingredients"
              checked={form.is_shellfish_free}
              onChange={(v) => set("is_shellfish_free", v)}
            />
            <CheckboxField
              label="Gluten-Free"
              hint="No soy sauce, no wheat starch in rice paste"
              checked={form.is_gluten_free}
              onChange={(v) => set("is_gluten_free", v)}
            />
          </div>
        </Section>

        {/* Notes */}
        <Section title="Recipe Notes">
          <textarea
            value={form.recipe_notes}
            onChange={(e) => set("recipe_notes", e.target.value)}
            rows={4}
            placeholder="Any special techniques, ingredient sources, changes from last batch…"
            className={cn(inputClass, "resize-none")}
          />
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Creating batch…" : "Create Batch"}
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg border border-border text-text-muted hover:bg-border-light transition-colors font-medium text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-bg">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
        {hint && (
          <span className="inline-flex items-center gap-0.5 ml-1.5 text-text-muted font-normal text-xs">
            <Info className="w-3 h-3" />
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary accent-primary"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-text-muted">{hint}</p>
      </div>
    </label>
  );
}
