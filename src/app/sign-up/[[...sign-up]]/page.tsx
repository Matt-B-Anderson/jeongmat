import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-bold text-primary">정맛</span>
          <p className="text-text-muted text-sm mt-1">Jeong Mat</p>
        </Link>
        <p className="text-text-muted text-sm mt-3 max-w-xs">
          Start tracking your kimchi batches. Free forever.
        </p>
      </div>

      <SignUp
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#1B4332",
            colorBackground: "#FFFFFF",
            colorInputBackground: "#FFFFFF",
            colorInputText: "#1A1A1A",
            borderRadius: "0.5rem",
            fontFamily: '"Noto Sans KR", system-ui, sans-serif',
          },
          elements: {
            card: "shadow-sm border border-border",
            headerTitle: "text-primary font-bold",
            formButtonPrimary:
              "bg-primary hover:bg-primary-hover text-white font-medium",
            footerActionLink: "text-primary hover:text-primary-hover",
          },
        }}
      />

      <p className="mt-6 text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
