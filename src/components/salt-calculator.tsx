"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaltCalculatorProps {
  onApply?: (saltG: number) => void;
  cabbageWeight?: number;
}

const SALT_TYPES = [
  { value: "coarse_sea", label: "Coarse Sea Salt", densityFactor: 1.0 },
  { value: "fine_sea", label: "Fine Sea Salt", densityFactor: 1.2 },
  { value: "kosher", label: "Kosher Salt", densityFactor: 0.85 },
  { value: "himalayan", label: "Himalayan Pink", densityFactor: 1.05 },
];

const RATIO_PRESETS = [
  { label: "Light (1.5%)", value: 1.5 },
  { label: "Standard (2%)", value: 2.0 },
  { label: "Traditional (2.5%)", value: 2.5 },
  { label: "Strong (3%)", value: 3.0 },
];

export function SaltCalculator({ onApply, cabbageWeight }: SaltCalculatorProps) {
  const [weightKg, setWeightKg] = useState(
    cabbageWeight ? (cabbageWeight / 1000).toString() : ""
  );
  const [ratio, setRatio] = useState(2.0);
  const [saltType, setSaltType] = useState("coarse_sea");
  const [open, setOpen] = useState(false);

  const weight = parseFloat(weightKg);
  const selectedSalt = SALT_TYPES.find((s) => s.value === saltType)!;

  const baseSaltG = isNaN(weight) ? 0 : weight * 1000 * (ratio / 100);
  const adjustedSaltG = Math.round(baseSaltG * selectedSalt.densityFactor);

  const handleApply = () => {
    if (onApply && adjustedSaltG > 0) {
      onApply(adjustedSaltG);
      setOpen(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-bg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-primary" />
          Salt Calculator
        </div>
        <span className="text-text-muted text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-xs text-text-muted mt-3 mb-4">
            Calculate the ideal salt amount for your cabbage weight. The
            traditional range is 2–3% by weight.
          </p>

          <div className="space-y-4">
            {/* Cabbage weight */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Cabbage Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 2.5"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Salt ratio presets */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Salt Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RATIO_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setRatio(preset.value)}
                    className={cn(
                      "text-xs py-1.5 px-2 rounded-lg border font-medium transition-colors",
                      ratio === preset.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border text-text-muted hover:border-primary hover:text-primary"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold text-primary w-12 text-right">
                  {ratio.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Salt type */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Salt Type
              </label>
              <select
                value={saltType}
                onChange={(e) => setSaltType(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {SALT_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1">
                Density factor: {selectedSalt.densityFactor}× (coarse = 1.0
                baseline)
              </p>
            </div>

            {/* Result */}
            {adjustedSaltG > 0 ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-1">
                    Recommended salt amount
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {adjustedSaltG}g
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {(adjustedSaltG / 1000).toFixed(3)} kg ·{" "}
                    {Math.round(adjustedSaltG / 5)} tsp (approx.)
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-text-muted">Cabbage</p>
                    <p className="font-semibold text-text">
                      {isNaN(weight) ? "—" : (weight * 1000).toFixed(0)}g
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Ratio</p>
                    <p className="font-semibold text-text">{ratio.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Type</p>
                    <p className="font-semibold text-text">
                      {selectedSalt.label.split(" ")[0]}
                    </p>
                  </div>
                </div>

                {onApply && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="mt-3 w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Use {adjustedSaltG}g in form
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-text-muted text-sm">
                Enter cabbage weight to calculate
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
