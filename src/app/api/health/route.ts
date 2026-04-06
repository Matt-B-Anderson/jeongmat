export const runtime = "edge";

export function GET() {
  return Response.json({
    ok: true,
    env: {
      hasClerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
