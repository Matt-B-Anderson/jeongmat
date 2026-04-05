import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { generateId } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    const batches = await db
      .select()
      .from(schema.batches)
      .where(eq(schema.batches.user_id, userId))
      .orderBy(desc(schema.batches.created_at));

    return Response.json(batches);
  } catch (err) {
    console.error("GET /api/batches error:", err);
    return Response.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const body = (await req.json()) as Record<string, unknown>;

    // Validate required fields
    if (
      !body.name ||
      !body.kimchi_type ||
      body.cabbage_weight_g == null ||
      body.salt_amount_g == null ||
      !body.salt_type ||
      body.ambient_temp_c == null ||
      !body.start_date
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = generateId();

    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    const newBatch: schema.NewBatch = {
      id,
      user_id: userId,
      name: body.name as string,
      kimchi_type: body.kimchi_type as string,
      cabbage_weight_g: Number(body.cabbage_weight_g),
      salt_amount_g: Number(body.salt_amount_g),
      salt_type: body.salt_type as string,
      gochugaru_amount_g:
        body.gochugaru_amount_g != null ? Number(body.gochugaru_amount_g) : null,
      fish_sauce_ml:
        body.fish_sauce_ml != null ? Number(body.fish_sauce_ml) : null,
      saeujeot_amount_g:
        body.saeujeot_amount_g != null ? Number(body.saeujeot_amount_g) : null,
      garlic_amount_g:
        body.garlic_amount_g != null ? Number(body.garlic_amount_g) : null,
      ginger_amount_g:
        body.ginger_amount_g != null ? Number(body.ginger_amount_g) : null,
      container_type: (body.container_type as string | null) ?? null,
      ambient_temp_c: Number(body.ambient_temp_c),
      start_date: body.start_date as string,
      fridge_date: (body.fridge_date as string | null) ?? null,
      recipe_notes: (body.recipe_notes as string | null) ?? null,
      is_vegan: body.is_vegan ? 1 : 0,
      is_shellfish_free: body.is_shellfish_free ? 1 : 0,
      is_gluten_free: body.is_gluten_free ? 1 : 0,
      overall_rating: (body.overall_rating as number | null) ?? null,
      lessons_learned: (body.lessons_learned as string | null) ?? null,
      status: (body.status as string) ?? "fermenting",
      created_at: now,
      updated_at: now,
    };

    await db.insert(schema.batches).values(newBatch);

    return Response.json(newBatch, { status: 201 });
  } catch (err) {
    console.error("POST /api/batches error:", err);
    return Response.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
