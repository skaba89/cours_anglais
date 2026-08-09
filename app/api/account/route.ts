import { env } from "cloudflare:workers";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function identity() {
  const requestHeaders = await headers();
  return {
    id: requestHeaders.get("oai-authenticated-user-id"),
    email: requestHeaders.get("oai-authenticated-user-email"),
  };
}

async function ensureTables() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS learner_profiles (user_id TEXT PRIMARY KEY, email TEXT NOT NULL, progress_json TEXT NOT NULL DEFAULT '{}', selected_plan TEXT NOT NULL DEFAULT 'free', billing_cycle TEXT NOT NULL DEFAULT 'yearly', updated_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS commercial_interests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, email TEXT NOT NULL, plan TEXT NOT NULL, billing_cycle TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_commercial_interests_user_id ON commercial_interests(user_id)"),
  ]);
}

export async function GET() {
  const user = await identity();
  if (!user.id || !user.email) return Response.json({ signedIn: false }, { status: 401 });
  await ensureTables();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, '{}', 'free', 'yearly', ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email").bind(user.id, user.email, Date.now()).run();
  const profile = await env.DB.prepare("SELECT progress_json, selected_plan, billing_cycle, updated_at FROM learner_profiles WHERE user_id = ?").bind(user.id).first();
  return Response.json({ signedIn: true, email: user.email, profile });
}

export async function POST(request: Request) {
  const user = await identity();
  if (!user.id || !user.email) return Response.json({ error: "Authentification requise" }, { status: 401 });
  const body = await request.json() as { progress?: unknown; selectedPlan?: string; billingCycle?: string; registerInterest?: boolean };
  const progressJson = JSON.stringify(body.progress ?? {});
  if (progressJson.length > 120_000) return Response.json({ error: "Progression trop volumineuse" }, { status: 413 });
  const selectedPlan = ["free", "premium"].includes(body.selectedPlan ?? "") ? body.selectedPlan! : "free";
  const billingCycle = ["monthly", "yearly"].includes(body.billingCycle ?? "") ? body.billingCycle! : "yearly";
  const now = Date.now();
  await ensureTables();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, progress_json = excluded.progress_json, selected_plan = excluded.selected_plan, billing_cycle = excluded.billing_cycle, updated_at = excluded.updated_at")
    .bind(user.id, user.email, progressJson, selectedPlan, billingCycle, now).run();
  if (body.registerInterest && selectedPlan === "premium") {
    await env.DB.prepare("INSERT INTO commercial_interests (user_id, email, plan, billing_cycle, created_at) VALUES (?, ?, ?, ?, ?)").bind(user.id, user.email, selectedPlan, billingCycle, now).run();
  }
  return Response.json({ ok: true, updatedAt: now });
}
