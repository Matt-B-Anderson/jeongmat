import { TroubleshootGuide } from "@/components/troubleshoot-guide";
import { HelpCircle, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troubleshooting Guide",
};

export default function TroubleshootPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-primary">
            Troubleshooting Guide
          </h1>
        </div>
        <p className="text-text-muted">
          Common kimchi problems and how to fix them. Select a symptom to see
          possible causes and solutions.
        </p>
      </div>

      {/* Tips banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3">
        <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">
            General kimchi wisdom
          </p>
          <ul className="text-text-muted space-y-1 list-disc list-inside">
            <li>Taste kimchi daily during room-temp fermentation</li>
            <li>Keep kimchi submerged under brine — no air exposure</li>
            <li>When in doubt, move to the fridge to slow fermentation</li>
            <li>
              Over-fermented kimchi isn&apos;t wasted — it&apos;s perfect for
              cooking
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive guide */}
      <TroubleshootGuide />

      {/* Footer note */}
      <div className="mt-8 text-center text-sm text-text-muted">
        <p>
          Kimchi fermentation is part art, part science. Every batch teaches
          something new.
        </p>
        <p className="mt-1">
          Keep your tasting notes to spot patterns across batches.
        </p>
      </div>
    </div>
  );
}
