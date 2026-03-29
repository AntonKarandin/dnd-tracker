const BASE = "/api/tracker";

export async function fetchCreatures() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch creatures");
  return res.json();
}

export async function createCreature(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create creature");
  return res.json();
}

export async function deleteCreature(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete creature");
}

export async function patchCreature(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to patch creature");
  return res.json();
}

export async function applyDamage(id, amount) {
  const res = await fetch(`${BASE}/${id}/damage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to apply damage");
  return res.json();
}

export async function applyHeal(id, amount) {
  const res = await fetch(`${BASE}/${id}/heal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to apply heal");
  return res.json();
}
