import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ConsoleSeal } from "@/components/layout/BrandMark";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, BookOpen, KeyRound, Loader2, Mail, Quote, Trophy, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(returnTo: string | null, fallback = "/dashboard") {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="console-ambient" aria-hidden="true" />
      <div className="console-fog" aria-hidden="true" />
      <div className="console-particles" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid w-full gap-0 overflow-hidden rounded-2xl border border-amethyst/20 bg-void/70 shadow-[var(--shadow-pop)] backdrop-blur lg:grid-cols-2">
          {/* Archive panel */}
          <aside className="relative hidden flex-col justify-between gap-8 border-r border-border p-10 lg:flex" aria-hidden="true">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(36rem 28rem at 20% 0%, var(--crimson-soft), transparent 60%), radial-gradient(30rem 24rem at 90% 100%, var(--amethyst-soft), transparent 60%)",
              }}
            />
            <div className="relative">
              <span className="relative flex size-12 items-center justify-center rounded-2xl border border-amethyst/35 bg-obsidian shadow-[0_0_24px_-6px_var(--crimson-glow)]">
                <ConsoleSeal className="size-7" />
              </span>
              <p className="font-display mt-6 text-3xl font-bold leading-tight text-parchment">
                Access the Archive. <span className="text-gradient-amethyst">Uncover Legends.</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-2">
                Inscribe records, catalog entities, settle rankings, and seal chronicles — the
                console keeps what its researchers write.
              </p>
            </div>
            <ul className="relative space-y-4 text-sm text-text-2">
              <li className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-amethyst" />
                A forbidden archive of series and their full casts
              </li>
              <li className="flex items-start gap-3">
                <Trophy className="mt-0.5 size-4 shrink-0 text-amethyst" />
                Researcher-settled rankings in four tiers
              </li>
              <li className="flex items-start gap-3">
                <Quote className="mt-0.5 size-4 shrink-0 text-crimson" />
                Chronicles preserved on every entity's record
              </li>
            </ul>
          </aside>

          {/* Form panel */}
          <div className="relative flex flex-col justify-center gap-6 p-6 sm:p-10">
            <div className="flex flex-col items-start gap-4 lg:items-center">
              <span className="flex size-10 items-center justify-center rounded-xl border border-amethyst/30 bg-void lg:hidden">
                <ConsoleSeal className="size-5" />
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-parchment">
                {step === "signIn" ? "Enter the Archive" : "Present your sigil"}
              </h1>
              <p className="text-sm text-text-2">
                {step === "signIn"
                  ? "Sign in with email, or continue as a wandering researcher."
                  : `A six-letter sigil was dispatched to ${step.email}.`}
              </p>
            </div>

            {step === "signIn" ? (
              <div className="space-y-5">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="auth-email" className="text-sm font-medium text-parchment">
                      Researcher email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" aria-hidden="true" />
                      <Input
                        id="auth-email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="input-console pl-9"
                        autoComplete="email"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="text-sm text-[#f2b8bb]">
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={isLoading} className="btn-amethyst w-full py-2.5">
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <KeyRound className="size-4" aria-hidden="true" />
                    )}
                    Send sign-in sigil
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-void px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-3">
                      or
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="btn-ember w-full py-2.5"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                >
                  <UserX className="size-4" aria-hidden="true" />
                  Continue as Guest
                </Button>
              </div>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) form.requestSubmit();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p role="alert" className="text-center text-sm text-[#f2b8bb]">
                    {error}
                  </p>
                )}

                <Button type="submit" className="btn-amethyst w-full py-2.5" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Verifying…
                    </>
                  ) : (
                    <>
                      Present sigil <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>

                <div className="flex flex-col gap-2 text-center text-sm">
                  <button
                    type="button"
                    className="rounded font-medium text-amethyst transition-colors hover:text-[#dccbfb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                  >
                    Didn't receive it? Request another
                  </button>
                  <button
                    type="button"
                    className="rounded text-text-3 transition-colors hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-xs text-text-3">
              <Link to="/" className="underline-offset-4 hover:text-parchment hover:underline">
                ← Back to the archive gate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
