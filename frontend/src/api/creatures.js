const BASE_LIBRARY = "/api/tracker";
const BASE_COMBAT  = "/api/combat";

// ── LIBRARY ──────────────────────────────────────────────
export async function fetchCreatures(search = "") {
  const url = search ? `${BASE_LIBRARY}?search=${encodeURIComponent(search)}` : BASE_LIBRARY;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creatures");
  return res.json();
}

export async function createCreature(payload) {
  const res = await fetch(BASE_LIBRARY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create creature");
  return res.json();
}

export async function deleteCreature(id) {
  const res = await fetch(`${BASE_LIBRARY}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete creature");
}

export async function patchCreature(id, payload) {
  const res = await fetch(`${BASE_LIBRARY}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to patch creature");
  return res.json();
}

// ── COMBAT ───────────────────────────────────────────────
export async function fetchCombat() {
  const res = await fetch(BASE_COMBAT);
  if (!res.ok) throw new Error("Failed to fetch combat");
  return res.json();
}

export async function spawnCreature(creature_id, count = 1) {
  const res = await fetch(`${BASE_COMBAT}/${creature_id}/spawn?count=${count}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to spawn creature");
  return res.json();
}

export async function deleteCombatInstance(id) {
  const res = await fetch(`${BASE_COMBAT}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete instance");
}

export async function patchCombatInstance(id, payload) {
  const res = await fetch(`${BASE_COMBAT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to patch instance");
  return res.json();
}

export async function applyDamage(id, amount) {
  const res = await fetch(`${BASE_COMBAT}/${id}/damage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to apply damage");
  return res.json();
}

export async function applyHeal(id, amount) {
  const res = await fetch(`${BASE_COMBAT}/${id}/heal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to apply heal");
  return res.json();
}
