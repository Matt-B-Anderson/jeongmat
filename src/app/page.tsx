import Link from "next/link";
import {
  FlaskConical,
  Thermometer,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Leaf,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary tracking-tight">
              정맛
            </span>
            <span className="text-sm text-text-muted font-medium hidden sm:block">
              Jeong Mat
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-text-muted hover:text-text transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Start Tracking
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="hanji-texture relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-sm text-text-muted mb-6">
                <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                Honouring the art of kimjang
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight mb-6">
                Your kimchi,
                <br />
                <span className="text-accent">perfectly tracked.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 max-w-2xl">
                Jeong Mat (정맛) means &ldquo;that feeling of the right
                taste&rdquo; — the satisfaction of kimchi that turned out just
                right. Track every batch, refine your recipe, and carry your
                family&apos;s tradition forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors text-base"
                >
                  Start your first batch
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-border text-text px-6 py-3 rounded-lg font-medium hover:border-primary transition-colors text-base"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative kimchi jar SVG */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-10 pointer-events-none select-none">
            <div className="text-[240px] leading-none">🥬</div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Everything your kimchi deserves
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                From the first salting to the last spoonful, track every detail
                that makes your kimchi yours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Batch Records"
                description="Log every ingredient — cabbage weight, salt ratio, gochugaru, fish sauce, saeujeot, and more. Never lose a recipe again."
                color="primary"
              />
              <FeatureCard
                icon={<Thermometer className="w-6 h-6" />}
                title="Smart Timeline"
                description="Temperature-adjusted fermentation predictions. Know exactly when to taste and when to move to the fridge."
                color="accent"
              />
              <FeatureCard
                icon={<FlaskConical className="w-6 h-6" />}
                title="Salt Calculator"
                description="Get the perfect 2–3% salt ratio every time. Supports coarse sea salt, fine salt, and kosher salt conversions."
                color="gold"
              />
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Privacy First"
                description="Your recipes are yours. No sharing, no social features — just your private kimchi journal, securely stored."
                color="primary"
              />
            </div>
          </div>
        </section>

        {/* Kimjang tradition section */}
        <section className="py-20 bg-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-5xl mb-6">🥢</div>
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Rooted in kimjang tradition
                </h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  Kimjang (김장) — the communal making of kimchi in late autumn
                  — is a UNESCO Intangible Cultural Heritage. For generations,
                  families gathered to prepare enough kimchi to last through
                  winter, passing down techniques and proportions through memory
                  and touch.
                </p>
                <p className="text-text-muted leading-relaxed mb-6">
                  Jeong Mat honours this tradition by helping you record and
                  refine the details that once lived only in experienced hands.
                  Your grandmother&apos;s instinct for salt. Your mother&apos;s
                  gochugaru ratio. Now yours to keep and build upon.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "배추김치 Baechu",
                    "깍두기 Kkakdugi",
                    "열무김치 Yeolmu",
                    "백김치 White",
                    "비건 Vegan",
                  ].map((type) => (
                    <span
                      key={type}
                      className="text-xs bg-white border border-border text-text-muted px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <TimelinePreview
                  step={1}
                  label="Day 1 — Batch Started"
                  desc="Cabbage salted, rinsed, and mixed with yangnyeom."
                />
                <TimelinePreview
                  step={2}
                  label="Day 3 — First Taste"
                  desc="Gentle fizz developing. Sourness at 18°C is just right."
                />
                <TimelinePreview
                  step={3}
                  label="Day 3 — Moved to Fridge"
                  desc="Desired sourness reached. Slow cold fermentation begins."
                />
                <TimelinePreview
                  step={4}
                  label="Day 10 — Well Fermented"
                  desc="Deep, complex flavour. Perfect for kimchi jjigae."
                  last
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dietary section */}
        <section className="py-16 bg-white border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Leaf className="w-12 h-12 text-primary-light flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Track dietary accommodations
                </h3>
                <p className="text-text-muted">
                  Mark batches as vegan (no fish sauce, no saeujeot), shellfish-free,
                  or gluten-free. Share confidently with guests who have
                  dietary restrictions.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <DietBadge label="Vegan" color="green" />
                <DietBadge label="Shellfish-Free" color="blue" />
                <DietBadge label="Gluten-Free" color="gold" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary hanji-texture">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for your best batch yet?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Free to use. No credit card required. Start tracking today.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-primary font-medium px-8 py-3.5 rounded-lg hover:bg-bg transition-colors text-base"
            >
              Create your account
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-bg py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">정맛</span>
            <span className="text-border">·</span>
            <span>Jeong Mat</span>
          </div>
          <p>Crafted with care for kimchi makers everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "accent" | "gold";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    gold: "bg-gold/10 text-gold",
  };

  return (
    <div className="bg-bg rounded-xl border border-border p-6 card-hover">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function TimelinePreview({
  step,
  label,
  desc,
  last = false,
}: {
  step: number;
  label: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {step}
        </div>
        {!last && <div className="w-0.5 bg-border flex-1 mt-2 min-h-6"></div>}
      </div>
      <div className="pb-4">
        <p className="font-medium text-text text-sm">{label}</p>
        <p className="text-text-muted text-sm">{desc}</p>
      </div>
    </div>
  );
}

function DietBadge({
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
      className={`text-sm px-3 py-1.5 rounded-full border font-medium ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}
