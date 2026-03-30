import { useState, useEffect } from "react";
import * as api from "./api/creatures.js";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0c10; --surface: #111520; --border: #1e2535;
    --accent: #c8973a; --accent-dim: #7a5a1e;
    --hp-green: #2d6e3e; --hp-green-bright: #4ade80;
    --hp-red: #8b1a1a; --temp-blue: #1a4a6e; --temp-blue-bright: #60a5fa;
    --text: #d4cfc4; --text-dim: #5a5a6a; --danger: #e53e3e;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Crimson Pro', Georgia, serif; min-height: 100vh; }
  .app { max-width: 960px; margin: 0 auto; padding: 0 16px 32px; }

  /* TABS */
  .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 28px; position: sticky; top: 0; background: var(--bg); z-index: 10; padding-top: 20px; }
  .tab {
    font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 10px 28px; border: none; background: none;
    color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s; margin-bottom: -1px;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* FORM */
  .add-form {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; margin-bottom: 24px;
    display: grid; gap: 10px; align-items: end;
  }
  .add-form.library-form { grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; }
  .add-form.spawn-form   { grid-template-columns: 1fr auto; }
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; font-family: 'Cinzel', serif; }
  .field input, .field select {
    background: #0a0c10; border: 1px solid var(--border); border-radius: 6px;
    color: var(--text); padding: 8px 10px; font-size: 15px; font-family: 'Crimson Pro', serif;
    outline: none; width: 100%; transition: border-color 0.2s;
  }
  .field input:focus, .field select:focus { border-color: var(--accent-dim); }
  .field input::placeholder { color: var(--text-dim); }

  /* SEARCH */
  .search-bar { margin-bottom: 16px; }
  .search-bar input {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); padding: 10px 14px;
    font-size: 15px; font-family: 'Crimson Pro', serif; outline: none; transition: border-color 0.2s;
  }
  .search-bar input:focus { border-color: var(--accent-dim); }
  .search-bar input::placeholder { color: var(--text-dim); }

  .btn-add {
    background: var(--accent); border: none; border-radius: 6px; color: #0a0c10;
    padding: 9px 18px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.06em; white-space: nowrap;
    transition: opacity 0.15s; align-self: end;
  }
  .btn-add:hover { opacity: 0.85; }
  .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

  /* LIBRARY LIST */
  .library-list { display: flex; flex-direction: column; gap: 10px; }
  .library-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;
    gap: 12px; animation: slideIn 0.2s ease;
  }
  .library-card:hover { border-color: #2a3550; }
  .lib-info { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; flex: 1; }
  .lib-name { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: #e8e0d0; }
  .lib-stat { font-size: 13px; color: var(--text-dim); }
  .lib-stat span { color: var(--text); }
  .lib-actions { display: flex; gap: 8px; align-items: center; }
  .spawn-count {
    width: 48px; background: #0a0c10; border: 1px solid var(--border); border-radius: 6px;
    color: var(--text); padding: 6px 8px; font-size: 14px; text-align: center;
    font-family: 'Crimson Pro', serif; outline: none;
  }
  .spawn-count::-webkit-inner-spin-button { -webkit-appearance: none; }
  .btn-spawn {
    background: #1e3060; border: 1px solid #3d5a9e; border-radius: 6px;
    color: #89b4f7; padding: 6px 14px; font-family: 'Cinzel', serif;
    font-size: 12px; cursor: pointer; white-space: nowrap; transition: opacity 0.15s;
  }
  .btn-spawn:hover { opacity: 0.8; }
  .btn-remove-lib {
    background: none; border: none; color: var(--text-dim); font-size: 16px;
    cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: color 0.15s;
  }
  .btn-remove-lib:hover { color: var(--danger); }

  /* COMBAT LIST */
  .combat-list { display: flex; flex-direction: column; gap: 14px; }
  .creature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 20px; transition: border-color 0.2s; animation: slideIn 0.25s ease;
  }
  .creature-card:hover { border-color: #2a3550; }
  .creature-card.dead { opacity: 0.45; }

  @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .init-badge {
    font-family: 'Cinzel', serif; font-size: 11px; color: var(--accent);
    background: rgba(200,151,58,0.08); border: 1px solid var(--accent-dim);
    border-radius: 20px; padding: 2px 10px; letter-spacing: 0.06em;
  }
  .btn-remove {
    background: none; border: none; color: var(--text-dim); font-size: 16px;
    cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: color 0.15s;
  }
  .btn-remove:hover { color: var(--danger); }

  .stats-row { display: flex; gap: 20px; margin-bottom: 14px; align-items: baseline; flex-wrap: wrap; }
  .creature-name { font-family: 'Cinzel', serif; font-size: 17px; font-weight: 600; color: #e8e0d0; letter-spacing: 0.04em; }
  .dead-label { font-family: 'Cinzel', serif; font-size: 11px; color: var(--danger); letter-spacing: 0.1em; margin-left: 8px; }
  .stat-pill { font-size: 13px; color: var(--text-dim); }
  .stat-pill span { color: var(--text); font-weight: 400; }

  .bars-section { margin-bottom: 14px; }
  .bar-wrap { margin-bottom: 6px; }
  .bar-label { font-size: 11px; color: var(--text-dim); margin-bottom: 3px; display: flex; justify-content: space-between; }
  .bar-label span { color: var(--text); }
  .bar-track { height: 14px; background: #0d1018; border-radius: 7px; overflow: hidden; border: 1px solid var(--border); }
  .bar-fill { height: 100%; border-radius: 7px; transition: width 0.4s cubic-bezier(.4,0,.2,1); position: relative; overflow: hidden; }
  .bar-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); }
  .bar-hp   { background: linear-gradient(90deg, var(--hp-red), var(--hp-green)); }
  .bar-temp { background: linear-gradient(90deg, var(--temp-blue), var(--temp-blue-bright)); }

  .controls { display: flex; gap: 8px; flex-wrap: wrap; }
  .ctrl-group { display: flex; border-radius: 7px; overflow: hidden; border: 1px solid var(--border); }
  .ctrl-input {
    width: 52px; background: #0a0c10; border: none; border-right: 1px solid var(--border);
    color: var(--text); padding: 6px 8px; font-size: 14px; font-family: 'Crimson Pro', serif;
    text-align: center; outline: none;
  }
  .ctrl-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .ctrl-btn {
    background: #131825; border: none; color: var(--text-dim);
    padding: 6px 12px; font-size: 12px; font-family: 'Cinzel', serif;
    cursor: pointer; letter-spacing: 0.04em; transition: background 0.15s, color 0.15s; white-space: nowrap;
  }
  .ctrl-btn:hover     { background: #1a2235; }
  .ctrl-btn.dmg:hover  { background: rgba(139,26,26,0.4); color: #fc8181; }
  .ctrl-btn.heal:hover { background: rgba(45,110,62,0.4); color: var(--hp-green-bright); }
  .ctrl-btn.temp:hover { background: rgba(26,74,110,0.4); color: var(--temp-blue-bright); }

  .empty {
    text-align: center; padding: 48px 20px; color: var(--text-dim);
    font-style: italic; font-size: 16px; border: 1px dashed var(--border); border-radius: 12px;
  }
  .error-msg { text-align: center; padding: 16px; color: var(--danger); font-size: 14px; margin-bottom: 12px; }

  @media (max-width: 640px) {
    .add-form.library-form { grid-template-columns: 1fr 1fr; }
    .stats-row { gap: 12px; }
    .controls { gap: 6px; }
  }
`;

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

// ─── COMBAT CARD ────────────────────────────────────────────────────────────
function CombatCard({ creature, onRemove, onUpdate }) {
  const [dmgVal,   setDmgVal]   = useState("");
  const [healVal,  setHealVal]  = useState("");
  const [tempVal,  setTempVal]  = useState("");
  const [initVal,  setInitVal]  = useState("");
  const [acVal,    setAcVal]    = useState("");
  const [maxHpVal, setMaxHpVal] = useState("");
  const [busy,     setBusy]     = useState(false);

  const hpPct   = clamp((creature.hp / creature.max_hp) * 100, 0, 100);
  const tempPct = creature.temp_hp > 0 ? clamp((creature.temp_hp / creature.max_hp) * 100, 0, 100) : 0;
  const isDead  = creature.hp <= 0;

  async function run(fn) {
    if (busy) return;
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  }
  function hk(fn) { return (e) => { if (e.key === "Enter") fn(); }; }

  const patch = (payload) => run(async () => { onUpdate(await api.patchCombatInstance(creature.id, payload)); });

  async function applyDamage() {
    const amount = parseInt(dmgVal);
    if (!amount || amount <= 0) return;
    run(async () => { onUpdate(await api.applyDamage(creature.id, amount)); setDmgVal(""); });
  }
  async function applyHeal() {
    const amount = parseInt(healVal);
    if (!amount || amount <= 0) return;
    run(async () => { onUpdate(await api.applyHeal(creature.id, amount)); setHealVal(""); });
  }
  async function applyTemp() {
    const v = parseInt(tempVal); if (!v || v <= 0) return;
    patch({ temp_hp: v }); setTempVal("");
  }
  async function applyInit() {
    const v = parseInt(initVal); if (isNaN(v)) return;
    patch({ initiative: v }); setInitVal("");
  }
  async function applyAc() {
    const v = parseInt(acVal); if (isNaN(v)) return;
    patch({ ac: v }); setAcVal("");
  }
  async function applyMaxHp() {
    const v = parseInt(maxHpVal); if (!v || v <= 0) return;
    patch({ max_hp: v }); setMaxHpVal("");
  }

  return (
    <div className={`creature-card${isDead ? " dead" : ""}`}>
      <div className="card-top">
        <div className="init-badge">Инициатива {creature.initiative}</div>
        <button className="btn-remove" onClick={() => onRemove(creature.id)}>✕</button>
      </div>
      <div className="stats-row">
        <span className="creature-name">
          {creature.name}{creature.number > 1 ? ` ${creature.number}` : ""}
          {isDead && <span className="dead-label">☠ Мёртв</span>}
        </span>
        <span className="stat-pill">КБ <span>{creature.ac}</span></span>
        <span className="stat-pill">Скорость <span>{creature.speed} фт</span></span>
      </div>
      <div className="bars-section">
        <div className="bar-wrap">
          <div className="bar-label"><span>HP</span><span>{creature.hp} / {creature.max_hp}</span></div>
          <div className="bar-track"><div className="bar-fill bar-hp" style={{ width: `${hpPct}%` }} /></div>
        </div>
        {creature.temp_hp > 0 && (
          <div className="bar-wrap">
            <div className="bar-label"><span>Временные HP</span><span>{creature.temp_hp}</span></div>
            <div className="bar-track"><div className="bar-fill bar-temp" style={{ width: `${tempPct}%` }} /></div>
          </div>
        )}
      </div>
      <div className="controls">
        {[
          { val: dmgVal,   set: setDmgVal,   fn: applyDamage, label: "Урон",    cls: "dmg",  ph: "0"  },
          { val: healVal,  set: setHealVal,  fn: applyHeal,   label: "Лечение", cls: "heal", ph: "0"  },
          { val: tempVal,  set: setTempVal,  fn: applyTemp,   label: "Врем.HP", cls: "temp", ph: "0"  },
          { val: initVal,  set: setInitVal,  fn: applyInit,   label: "Иниц.",   cls: "",     ph: "14" },
          { val: acVal,    set: setAcVal,    fn: applyAc,     label: "КБ",      cls: "",     ph: "±0" },
          { val: maxHpVal, set: setMaxHpVal, fn: applyMaxHp,  label: "Макс HP", cls: "",     ph: "20" },
        ].map(({ val, set, fn, label, cls, ph }) => (
          <div className="ctrl-group" key={label}>
            <input className="ctrl-input" type="number" placeholder={ph}
              value={val} onChange={e => set(e.target.value)} onKeyDown={hk(fn)} />
            <button className={`ctrl-btn ${cls}`} onClick={fn} disabled={busy}>{label}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LIBRARY TAB ────────────────────────────────────────────────────────────
function LibraryTab() {
  const [creatures, setCreatures] = useState([]);
  const [search,    setSearch]    = useState("");
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [spawnCounts, setSpawnCounts] = useState({});
  const [form, setForm] = useState({ name: "", hp: "", ac: "", speed: "", initiative_bonus: "" });

  useEffect(() => {
    api.fetchCreatures(search).then(setCreatures).catch(() => setError("Ошибка загрузки библиотеки"));
  }, [search]);

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setSpawnCount(id, v) { setSpawnCounts(s => ({ ...s, [id]: v })); }

  async function addCreature() {
    const hp  = parseInt(form.hp);
    const ac  = parseInt(form.ac);
    const spd = parseInt(form.speed);
    const ini = parseInt(form.initiative_bonus);
    if (!form.name.trim() || isNaN(hp) || hp <= 0) return;
    setSaving(true);
    try {
      const created = await api.createCreature({
        name: form.name.trim(), max_hp: hp, hp,
        temp_hp: 0,
        ac: isNaN(ac) ? 10 : ac,
        speed: isNaN(spd) ? 30 : spd,
        initiative_bonus: isNaN(ini) ? 0 : ini,
      });
      setCreatures(prev => [...prev, created]);
      setForm({ name: "", hp: "", ac: "", speed: "", initiative_bonus: "" });
    } catch { setError("Ошибка при создании"); }
    finally { setSaving(false); }
  }

  async function removeCreature(id) {
    await api.deleteCreature(id);
    setCreatures(prev => prev.filter(c => c.id !== id));
  }

  async function spawn(creature) {
    const count = parseInt(spawnCounts[creature.id]) || 1;
    await api.spawnCreature(creature.id, count);
    setSpawnCounts(s => ({ ...s, [creature.id]: "" }));
  }

  return (
    <>
      {error && <div className="error-msg">{error}</div>}
      <div className="add-form library-form">
        <div className="field"><label>Имя</label>
          <input placeholder="Гоблин" value={form.name} onChange={e => setField("name", e.target.value)} onKeyDown={e => e.key === "Enter" && addCreature()} /></div>
        <div className="field"><label>HP</label>
          <input type="number" placeholder="20" value={form.hp} onChange={e => setField("hp", e.target.value)} onKeyDown={e => e.key === "Enter" && addCreature()} /></div>
        <div className="field"><label>КБ</label>
          <input type="number" placeholder="13" value={form.ac} onChange={e => setField("ac", e.target.value)} onKeyDown={e => e.key === "Enter" && addCreature()} /></div>
        <div className="field"><label>Скорость</label>
          <input type="number" placeholder="30" value={form.speed} onChange={e => setField("speed", e.target.value)} onKeyDown={e => e.key === "Enter" && addCreature()} /></div>
         <div className="field"><label>Бонус иниц.</label>
          <input type="number" placeholder="0" value={form.initiative_bonus} onChange={e => setField("initiative_bonus", e.target.value)} onKeyDown={e => e.key === "Enter" && addCreature()} /></div>
        <button className="btn-add" onClick={addCreature} disabled={saving}>{saving ? "..." : "+ Добавить"}</button>
      </div>

      <div className="search-bar">
        <input placeholder="🔍 Поиск по имени..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="library-list">
        {creatures.length === 0 && <div className="empty">{search ? `Ничего не найдено по «${search}»` : "Библиотека пуста — добавь первое существо"}</div>}
        {creatures.map(c => (
          <div className="library-card" key={c.id}>
            <div className="lib-info">
              <span className="lib-name">{c.name}</span>
              <span className="lib-stat">HP <span>{c.max_hp}</span></span>
              <span className="lib-stat">КБ <span>{c.ac}</span></span>
              <span className="lib-stat">Скорость <span>{c.speed} фт</span></span>
              <span className="lib-stat">Бонус иниц. <span>{c.initiative_bonus}</span></span>
            </div>
            <div className="lib-actions">
              <input className="spawn-count" type="number" min="1" max="20" placeholder="1"
                value={spawnCounts[c.id] || ""} onChange={e => setSpawnCount(c.id, e.target.value)} />
              <button className="btn-spawn" onClick={() => spawn(c)}>На поле ▶</button>
              <button className="btn-remove-lib" onClick={() => removeCreature(c.id)} title="Удалить из библиотеки">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── COMBAT TAB ─────────────────────────────────────────────────────────────
function CombatTab() {
  const [instances, setInstances] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    api.fetchCombat()
      .then(setInstances)
      .catch(() => setError("Не удалось загрузить поле боя"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...instances].sort((a, b) => b.initiative - a.initiative);

  async function removeInstance(id) {
    await api.deleteCombatInstance(id);
    setInstances(prev => prev.filter(c => c.id !== id));
  }

  function updateInstance(updated) {
    setInstances(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  if (loading) return <div className="empty">Загрузка...</div>;

  return (
    <>
      {error && <div className="error-msg">{error}</div>}
      <div className="combat-list">
        {sorted.length === 0 && <div className="empty">Поле боя пусто — добавь существ из библиотеки</div>}
        {sorted.map(c => (
          <CombatCard key={c.id} creature={c} onRemove={removeInstance} onUpdate={updateInstance} />
        ))}
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("combat");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="tabs">
          <button className={`tab ${tab === "combat" ? "active" : ""}`} onClick={() => setTab("combat")}>⚔ Бой</button>
          <button className={`tab ${tab === "library" ? "active" : ""}`} onClick={() => setTab("library")}>📖 Библиотека</button>
        </div>
        {tab === "combat"  ? <CombatTab />  : <LibraryTab />}
      </div>
    </>
  );
}
