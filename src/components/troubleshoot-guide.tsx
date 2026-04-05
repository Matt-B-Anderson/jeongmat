"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Issue {
  id: string;
  symptom: string;
  emoji: string;
  causes: Cause[];
}

interface Cause {
  title: string;
  description: string;
  fix: string;
  severity: "low" | "medium" | "high";
}

const ISSUES: Issue[] = [
  {
    id: "too-salty",
    symptom: "Too salty",
    emoji: "🧂",
    causes: [
      {
        title: "Over-salting during preparation",
        description:
          "Salt percentage was above 3% by weight, or fine salt was measured by volume instead of weight.",
        fix: "Next batch: use a kitchen scale and target 2–2.5% by cabbage weight. Coarse sea salt is harder to over-add. For the current batch, try rinsing thoroughly 3× in cold water before adding seasoning.",
        severity: "medium",
      },
      {
        title: "Insufficient rinsing after salting",
        description:
          "The cabbage was not rinsed well enough, leaving excess surface salt.",
        fix: "Rinse 2–3 times and taste a piece — it should be pleasantly salty, not mouth-puckering. Squeeze thoroughly after each rinse.",
        severity: "low",
      },
    ],
  },
  {
    id: "not-sour",
    symptom: "Not sour / Not fermenting",
    emoji: "😐",
    causes: [
      {
        title: "Temperature too cold",
        description:
          "Below 12°C, fermentation is extremely slow or stalled. The lactobacillus bacteria are dormant.",
        fix: "Move kimchi to a warmer location (16–22°C is ideal). Even a few degrees warmer makes a significant difference. Check the fermentation timeline calculator for your specific temperature.",
        severity: "low",
      },
      {
        title: "Not enough time",
        description:
          "At standard temperatures, kimchi takes 2–5 days to begin tasting sour. Be patient.",
        fix: "Check the predicted timeline in your batch detail. Fresh kimchi (geotjeori) is mild — let it ferment longer.",
        severity: "low",
      },
      {
        title: "Kimchi exposed to air",
        description:
          "Lactobacillus is anaerobic. Air exposure slows fermentation and can cause off flavours.",
        fix: "Press the kimchi down firmly to submerge it in its own brine. Weight it with a heavy plate or dedicated kimchi weight. Ensure the container is not too large.",
        severity: "medium",
      },
    ],
  },
  {
    id: "too-sour",
    symptom: "Too sour / Over-fermented",
    emoji: "😬",
    causes: [
      {
        title: "Left at room temperature too long",
        description:
          "Fermentation continued past the desired sourness level before moving to the fridge.",
        fix: "Transfer immediately to the fridge to slow fermentation. Over-fermented kimchi is perfect for kimchi jjigae (kimchi stew), kimchi fried rice, or kimchi pancakes (kimchijeon).",
        severity: "low",
      },
      {
        title: "Temperature too warm",
        description:
          "At temperatures above 24°C, kimchi can turn sour within 24–48 hours.",
        fix: "In warm weather, check daily and move to fridge quickly. Use the temperature-adjusted timeline as a guide — don't wait for the default 5 days in a hot kitchen.",
        severity: "medium",
      },
    ],
  },
  {
    id: "slimy",
    symptom: "Slimy texture",
    emoji: "😰",
    causes: [
      {
        title: "Excess starch in paste",
        description:
          "Too much glutinous rice paste (pul) can cause sliminess, especially if fermented warm.",
        fix: "Reduce rice flour paste next batch. This batch is generally still safe to eat — sliminess often reduces after refrigeration. If it smells off as well, discard.",
        severity: "medium",
      },
      {
        title: "Over-ripe or damaged daikon/cabbage",
        description:
          "Starting with older or bruised vegetables can contribute to soft texture.",
        fix: "Always use fresh, firm cabbage. Check the cut end of the daikon — it should be crisp and white.",
        severity: "low",
      },
    ],
  },
  {
    id: "mold",
    symptom: "White film or mold on surface",
    emoji: "🚫",
    causes: [
      {
        title: "Kahm yeast (white film)",
        description:
          "A white, flat, powdery film is usually Kahm yeast — harmless but undesirable. Distinct from fuzzy mold.",
        fix: "Skim off the white film entirely. Press kimchi back under brine, ensure no air pockets. Add a fresh cabbage leaf on top as a barrier. Refrigerate if at room temperature.",
        severity: "low",
      },
      {
        title: "Actual mold (fuzzy, coloured)",
        description:
          "Green, black, or pink fuzzy growth is mold. This occurs when kimchi is exposed to air and humidity for too long.",
        fix: "If the mold is only on the very top layer and the kimchi below smells and tastes fine, carefully remove the top layer plus 1 inch below it. If mold is throughout or the smell is putrid, discard the batch for safety.",
        severity: "high",
      },
    ],
  },
  {
    id: "too-soft",
    symptom: "Soggy / Soft texture (no crunch)",
    emoji: "😞",
    causes: [
      {
        title: "Over-salted during prep",
        description:
          "Excess salt draws out too much moisture and breaks down the cell walls over time.",
        fix: "Next batch: use 2% salt ratio and reduce salting time to 1–2 hours maximum for napa cabbage.",
        severity: "medium",
      },
      {
        title: "Fermenting too warm for too long",
        description:
          "High temperatures break down pectin in the cabbage faster, resulting in softness.",
        fix: "Move to fridge earlier. Crunch is best preserved with a short room-temp ferment followed by slow cold fermentation.",
        severity: "low",
      },
    ],
  },
  {
    id: "not-enough-brine",
    symptom: "Not enough brine / Kimchi is dry",
    emoji: "💧",
    causes: [
      {
        title: "Insufficient salting / brine generation",
        description:
          "The cabbage may not have been salted long enough to draw out its natural moisture.",
        fix: "Next time, salt for 1–2 hours and flip halfway. For the current batch, mix 1 cup water + 1 tsp salt and add just enough to cover. Press kimchi down firmly.",
        severity: "low",
      },
      {
        title: "Container too large",
        description:
          "Kimchi packed in a large container with air space won't generate enough brine pressure.",
        fix: "Transfer to a smaller, tighter container. Pack tightly with no air gaps. A container should be ~90% full.",
        severity: "low",
      },
    ],
  },
];

const SEVERITY_STYLES = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-gold/10 text-gold border-gold/20",
  high: "bg-accent/10 text-accent border-accent/20",
};

const SEVERITY_ICONS = {
  low: <CheckCircle2 className="w-4 h-4" />,
  medium: <AlertTriangle className="w-4 h-4" />,
  high: <AlertTriangle className="w-4 h-4" />,
};

export function TroubleshootGuide() {
  const [openIssue, setOpenIssue] = useState<string | null>(null);
  const [openCauses, setOpenCauses] = useState<Set<string>>(new Set());

  const toggleCause = (key: string) => {
    setOpenCauses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {ISSUES.map((issue) => {
        const isOpen = openIssue === issue.id;

        return (
          <div
            key={issue.id}
            className="rounded-xl border border-border bg-bg-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIssue(isOpen ? null : issue.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{issue.emoji}</span>
                <div>
                  <p className="font-semibold text-text">{issue.symptom}</p>
                  <p className="text-xs text-text-muted">
                    {issue.causes.length} possible{" "}
                    {issue.causes.length === 1 ? "cause" : "causes"}
                  </p>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-border divide-y divide-border">
                {issue.causes.map((cause, i) => {
                  const causeKey = `${issue.id}-${i}`;
                  const causeOpen = openCauses.has(causeKey);

                  return (
                    <div key={i} className="bg-bg">
                      <button
                        type="button"
                        onClick={() => toggleCause(causeKey)}
                        className="w-full flex items-start justify-between px-5 py-3.5 text-left hover:bg-border-light transition-colors"
                      >
                        <div className="flex items-start gap-2 flex-1 min-w-0 pr-3">
                          <span
                            className={cn(
                              "mt-0.5 flex-shrink-0 p-1 rounded-md border",
                              SEVERITY_STYLES[cause.severity]
                            )}
                          >
                            {SEVERITY_ICONS[cause.severity]}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-text">
                              {cause.title}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                              {cause.description}
                            </p>
                          </div>
                        </div>
                        {causeOpen ? (
                          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
                        )}
                      </button>

                      {causeOpen && (
                        <div className="px-5 pb-4 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
                              What happened
                            </p>
                            <p className="text-sm text-text">{cause.description}</p>
                          </div>
                          <div className="bg-bg-card rounded-lg border border-border p-3">
                            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                              How to fix it
                            </p>
                            <p className="text-sm text-text">{cause.fix}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full border font-medium",
                                SEVERITY_STYLES[cause.severity]
                              )}
                            >
                              {cause.severity === "low"
                                ? "Minor issue"
                                : cause.severity === "medium"
                                  ? "Noticeable issue"
                                  : "Serious — check carefully"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
