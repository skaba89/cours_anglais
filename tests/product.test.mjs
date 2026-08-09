import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the product is branded and exposes its trust pages", async () => {
  const [layout, page, packageJson] = await Promise.all([
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("package.json"),
  ]);

  assert.match(layout, /Hello!/);
  assert.match(layout, /m[ée]thode C\.L\.A\.I\.R\./i);
  assert.match(page, /Conçu pour les francophones/i);
  assert.match(page, /\/confidentialite/);
  assert.match(page, /\/conditions/);
  assert.match(page, /\/assistance/);
  assert.match(packageJson, /"name": "hello-anglais"/);
  assert.doesNotMatch(packageJson, /WRANGLER_LOG_PATH=/);
});

test("commercial promises match the currently available beta", async () => {
  const page = await read("app/page.tsx");

  assert.doesNotMatch(page, />389</);
  assert.doesNotMatch(page, /389 s[ée]ances A1[–-]C2/i);
  assert.doesNotMatch(page, /niveaux certifiants/i);
  assert.match(page, /b[êe]ta fondatrice/i);
  assert.match(page, /24 expressions/i);
  assert.match(page, /6 [ée]pisodes/i);
});

test("authentication helpers reject unsafe return paths", async () => {
  const auth = await read("app/chatgpt-auth.ts");

  assert.match(auth, /!value\.startsWith\("\/"\)/);
  assert.match(auth, /value\.startsWith\("\/\/"\)/);
  assert.match(auth, /url\.origin !== "https:\/\/app\.local"/);
  assert.match(auth, /isReservedAuthPath/);
});

test("account writes are bounded and validated", async () => {
  const route = await read("app/api/account/route.ts");

  assert.match(route, /120_000/);
  assert.match(route, /application\/json/);
  assert.match(route, /selectedPlan/);
  assert.match(route, /billingCycle/);
});
