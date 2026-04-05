import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { generateId } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    // Verify batch belongs to user
    const [batch] = await db
      .select()
      .from(schema.batches)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      )
      .limit(1);

    if (!batch) {
      return Response.json({ error: "Batch not found" }, { status: 404 });
    }

    const tastings = await db
      .select()
      .from(schema.tasting_logs)
      .where(eq(schema.tasting_logs.batch_id, id))
      .orderBy(desc(schema.tasting_logs.tasting_date));

    return Response.json(tastings);
  } catch (err) {
    console.error(`GET /api/batches/${id}/tastings error:`, err);
    return Response.json(
      { error: "Failed to fetch tastings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const body = (await req.json()) as Record<string, unknown>;

    if (!body.tasting_date) {
      return Response.json(
        { error: "tasting_date is required" },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    // Verify batch belongs to user
    const [batch] = await db
      .select()
      .from(schema.batches)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      )
      .limit(1);

    if (!batch) {
      return Response.json({ error: "Batch not found" }, { status: 404 });
    }

    const newTasting: schema.NewTastingLog = {
      id: generateId(),
      batch_id: id,
      user_id: userId,
      tasting_date: body.tasting_date as string,
      sourness: (body.sourness as number | null) ?? null,
      saltiness: (body.saltiness as number | null) ?? null,
      crunch: (body.crunch as number | null) ?? null,
      fizz: (body.fizz as number | null) ?? null,
      overall: (body.overall as number | null) ?? null,
      notes: (body.notes as string | null) ?? null,
      created_at: new Date().toISOString(),
    };

    await db.insert(schema.tasting_logs).values(newTasting);

    return Response.json(newTasting, { status: 201 });
  } catch (err) {
    console.error(`POST /api/batches/${id}/tastings error:`, err);
    return Response.json(
      { error: "Failed to create tasting note" },
      { status: 500 }
    );
  }
}
