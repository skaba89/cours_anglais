import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";
const MAX_PROGRESS_BYTES = 120_000;

async function ensureTables() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS learner_profiles (user_id TEXT PRIMARY KEY, email TEXT NOT NULL, progress_json TEXT NOT NULL DEFAULT '{}', selected_plan TEXT NOT NULL DEFAULT 'free', billing_cycle TEXT NOT NULL DEFAULT 'yearly', updated_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS commercial_interests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, email TEXT NOT NULL, plan TEXT NOT NULL, billing_cycle TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_commercial_interests_user_id ON commercial_interests(user_id)"),
    env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_commercial_interests_user_plan ON commercial_interests(user_id, plan)"),
  ]);
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ signedIn: false }, { status: 401 });
  await ensureTables();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, '{}', 'free', 'yearly', ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email").bind(user.userId, user.email, Date.now()).run();
  const profile = await env.DB.prepare("SELECT progress_json, selected_plan, billing_cycle, updated_at FROM learner_profiles WHERE user_id = ?").bind(user.userId).first();
  return Response.json({ signedIn: true, email: user.email, profile }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentification requise" }, { status: 401 });
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return Response.json({ error: "Format JSON requis" }, { status: 415 });

  let body: { progress?: unknown; selectedPlan?: string; billingCycle?: string; registerInterest?: boolean };
  try { body = await request.json(); } catch { return Response.json({ error: "JSON invalide" }, { status: 400 }); }
  const progress = body.progress && typeof body.progress === "object" && !Array.isArray(body.progress) ? body.progress : {};
  const progressJson = JSON.stringify(progress);
  if (progressJson.length > MAX_PROGRESS_BYTES) return Response.json({ error: "Progression trop volumineuse" }, { status: 413 });

  const selectedPlan = body.selectedPlan === "premium" ? "premium" : "free";
  const billingCycle = body.billingCycle === "monthly" ? "monthly" : "yearly";
  const now = Date.now();
  await ensureTables();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, progress_json = excluded.progress_json, selected_plan = excluded.selected_plan, billing_cycle = excluded.billing_cycle, updated_at = excluded.updated_at")
    .bind(user.userId, user.email, progressJson, selectedPlan, billingCycle, now).run();
  if (body.registerInterest === true && selectedPlan === "premium") {
    await env.DB.prepare("INSERT INTO commercial_interests (user_id, email, plan, billing_cycle, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, plan) DO UPDATE SET email = excluded.email, billing_cycle = excluded.billing_cycle, created_at = excluded.created_at").bind(user.userId, user.email, selectedPlan, billingCycle, now).run();
  }
  return Response.json({ ok: true, updatedAt: now }, { headers: { "cache-control": "no-store" } });
}

export async function DELETE() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentification requise" }, { status: 401 });
  await ensureTables();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM commercial_interests WHERE user_id = ?").bind(user.userId),
    env.DB.prepare("DELETE FROM learner_profiles WHERE user_id = ?").bind(user.userId),
  ]);
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
