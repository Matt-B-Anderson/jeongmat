import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

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

    return Response.json(batch);
  } catch (err) {
    console.error(`GET /api/batches/${id} error:`, err);
    return Response.json({ error: "Failed to fetch batch" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    // Verify ownership
    const [existing] = await db
      .select()
      .from(schema.batches)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      )
      .limit(1);

    if (!existing) {
      return Response.json({ error: "Batch not found" }, { status: 404 });
    }

    const updates: Partial<schema.Batch> = {
      updated_at: new Date().toISOString(),
    };

    // Only update provided fields
    const allowedStringFields = [
      "name",
      "kimchi_type",
      "salt_type",
      "container_type",
      "start_date",
      "fridge_date",
      "recipe_notes",
      "lessons_learned",
      "status",
    ] as const;

    const allowedNumericFields = [
      "cabbage_weight_g",
      "salt_amount_g",
      "gochugaru_amount_g",
      "fish_sauce_ml",
      "saeujeot_amount_g",
      "garlic_amount_g",
      "ginger_amount_g",
      "ambient_temp_c",
      "overall_rating",
    ] as const;

    for (const field of allowedStringFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    for (const field of allowedNumericFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] =
          body[field] != null ? Number(body[field]) : null;
      }
    }

    if ("is_vegan" in body) updates.is_vegan = body.is_vegan ? 1 : 0;
    if ("is_shellfish_free" in body)
      updates.is_shellfish_free = body.is_shellfish_free ? 1 : 0;
    if ("is_gluten_free" in body)
      updates.is_gluten_free = body.is_gluten_free ? 1 : 0;
    // NOTE: body is Record<string,unknown> so boolean coercion above is intentional

    await db
      .update(schema.batches)
      .set(updates)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      );

    const [updated] = await db
      .select()
      .from(schema.batches)
      .where(eq(schema.batches.id, id))
      .limit(1);

    return Response.json(updated);
  } catch (err) {
    console.error(`PUT /api/batches/${id} error:`, err);
    return Response.json({ error: "Failed to update batch" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    // Verify ownership
    const [existing] = await db
      .select()
      .from(schema.batches)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      )
      .limit(1);

    if (!existing) {
      return Response.json({ error: "Batch not found" }, { status: 404 });
    }

    // Delete tasting logs first (cascade)
    await db
      .delete(schema.tasting_logs)
      .where(eq(schema.tasting_logs.batch_id, id));

    // Delete batch
    await db
      .delete(schema.batches)
      .where(
        and(eq(schema.batches.id, id), eq(schema.batches.user_id, userId))
      );

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/batches/${id} error:`, err);
    return Response.json({ error: "Failed to delete batch" }, { status: 500 });
  }
}
