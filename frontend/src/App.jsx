import { useState, useEffect } from "react";
import * as api from "./api/creatures.js";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c10;
    --surface: #111520;
    --border: #1e2535;
    --accent: #c8973a;
    --accent-dim: #7a5a1e;
    --hp-green: #2d6e3e;
    --hp-green-bright: #4ade80;
    --hp-red: #8b1a1a;
    --temp-blue: #1a4a6e;
    --temp-blue-bright: #60a5fa;
    --text: #d4cfc4;
    --text-dim: #5a5a6a;
    --danger: #e53e3e;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Crimson Pro', Georgia, serif; min-height: 100vh; }

  .app { max-width: 900px; margin: 0 auto; padding: 24px 16px; }

  .header { text-align: center; margin-bottom: 32px; }
  .header h1 {
    font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700;
    color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase;
    text-shadow: 0 0 30px rgba(200,151,58,0.3);
  }
  .header p { font-size: 14px; color: var(--text-dim); margin-top: 4px; font-style: italic; }

  .add-form {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; margin-bottom: 28px;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
    gap: 10px; align-items: end;
  }
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; font-family: 'Cinzel', serif; }
  .field input {
    background: #0a0c10; border: 1px solid var(--border); border-radius: 6px;
    color: var(--text); padding: 8px 10px; font-size: 15px; font-family: 'Crimson Pro', serif;
    outline: none; width: 100%; transition: border-color 0.2s;
  }
  .field input:focus { border-color: var(--accent-dim); }
  .field input::placeholder { color: var(--text-dim); }

  .btn-add {
    background: var(--accent); border: none; border-radius: 6px; color: #0a0c10;
    padding: 9px 18px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.06em; white-space: nowrap;
    transition: opacity 0.15s; align-self: end;
  }
  .btn-add:hover { opacity: 0.85; }
  .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

  .combat-list { display: flex; flex-direction: column; gap: 14px; }

  .creature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 20px;
    transition: border-color 0.2s;
    animation: slideIn 0.25s ease;
  }
  .creature-card:hover { border-color: #2a3550; }
  .creature-card.dead { opacity: 0.45; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

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
  .bar-fill::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%);
  }
  .bar-hp { background: linear-gradient(90deg, var(--hp-red), var(--hp-green)); }
  .bar-temp { background: linear-gradient(90deg, var(--temp-blue), var(--temp-blue-bright)); }

  .controls { display: flex; gap: 8px; flex-wrap: wrap; }
  .ctrl-group { display: flex; border-radius: 7px; overflow: hidden; border: 1px solid var(--border); }
  .ctrl-input {
    width: 52px; background: #0a0c10; border: none; border-right: 1px solid var(--border);
    color: var(--text); padding: 6px 8px; font-size: 14px; font-family: 'Crimson Pro', serif;
    text-align: center; outline: none;
  }
  .ctrl-btn {
    background: #131825; border: none; color: var(--text-dim);
    padding: 6px 12px; font-size: 12px; font-family: 'Cinzel', serif;
    cursor: pointer; letter-spacing: 0.04em; transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .ctrl-btn:hover { background: #1a2235; }
  .ctrl-btn.dmg:hover  { background: rgba(139,26,26,0.4); color: #fc8181; }
  .ctrl-btn.heal:hover { background: rgba(45,110,62,0.4); color: var(--hp-green-bright); }
  .ctrl-btn.temp:hover { background: rgba(26,74,110,0.4); color: var(--temp-blue-bright); }

  .empty {
    text-align: center; padding: 48px 20px; color: var(--text-dim);
    font-style: italic; font-size: 16px; border: 1px dashed var(--border); border-radius: 12px;
  }
  .error-msg { text-align: center; padding: 16px; color: var(--danger); font-size: 14px; }

  @media (max-width: 640px) {
    .add-form { grid-template-columns: 1fr 1fr; }
    .stats-row { gap: 12px; }
    .controls { gap: 6px; }
  }
`;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function CreatureCard({ creature, onRemove, onUpdate }) {
  const [dmgVal, setDmgVal]   = useState("");
  const [healVal, setHealVal] = useState("");
  const [tempVal, setTempVal] = useState("");
  const [initVal, setInitVal] = useState("");
  const [acVal, setAcVal]     = useState("");
  const [maxHpVal, setMaxHpVal] = useState("");
  const [busy, setBusy]       = useState(false);

  const hpPct  = clamp((creature.hp / creature.max_hp) * 100, 0, 100);
  const tempPct = creature.temp_hp > 0
    ? clamp((creature.temp_hp / creature.max_hp) * 100, 0, 100)
    : 0;
  const isDead = creature.hp <= 0;

  async function run(fn) {
    if (busy) return;
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  }

  function hk(fn) { return (e) => { if (e.key === "Enter") fn(); }; }

  async function applyDamage() {
    const amount = parseInt(dmgVal);
    if (!amount || amount <= 0) return;
    run(async () => {
      const updated = await api.applyDamage(creature.id, amount);
      onUpdate(updated);
      setDmgVal("");
    });
  }

  async function applyHeal() {
    const amount = parseInt(healVal);
    if (!amount || amount <= 0) return;
    run(async () => {
      const updated = await api.applyHeal(creature.id, amount);
      onUpdate(updated);
      setHealVal("");
    });
  }

  async function applyTemp() {
    const amount = parseInt(tempVal);
    if (!amount || amount <= 0) return;
    run(async () => {
      const updated = await api.patchCreature(creature.id, { temp_hp: amount });
      onUpdate(updated);
      setTempVal("");
    });
  }

  async function applyInitiative() {
    const val = parseInt(initVal);
    if (isNaN(val)) return;
    run(async () => {
      const updated = await api.patchCreature(creature.id, { initiative: val });
      onUpdate(updated);
      setInitVal("");
    });
  }

  async function applyAc() {
    const val = parseInt(acVal);
    if (isNaN(val)) return;
    run(async () => {
      // send delta, backend adds it to current ac
      const updated = await api.patchCreature(creature.id, { ac: val });
      onUpdate(updated);
      setAcVal("");
    });
  }

  async function applyMaxHp() {
    const val = parseInt(maxHpVal);
    if (!val || val <= 0) return;
    run(async () => {
      const updated = await api.patchCreature(creature.id, { max_hp: val });
      onUpdate(updated);
      setMaxHpVal("");
    });
  }

  return (
    <div className={`creature-card${isDead ? " dead" : ""}`}>
      <div className="card-top">
        <div className="init-badge">Инициатива {creature.initiative}</div>
        <button className="btn-remove" onClick={() => onRemove(creature.id)}>✕</button>
      </div>

      <div className="stats-row">
        <span className="creature-name">
          {creature.name}
          {isDead && <span className="dead-label">☠ Мёртв</span>}
        </span>
        <span className="stat-pill">КБ <span>{creature.ac}</span></span>
        <span className="stat-pill">Скорость <span>{creature.speed} фт</span></span>
      </div>

      <div className="bars-section">
        <div className="bar-wrap">
          <div className="bar-label">
            <span>HP</span>
            <span>{creature.hp} / {creature.max_hp}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill bar-hp" style={{ width: `${hpPct}%` }} />
          </div>
        </div>
        {creature.temp_hp > 0 && (
          <div className="bar-wrap">
            <div className="bar-label">
              <span>Временные HP</span>
              <span>{creature.temp_hp}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill bar-temp" style={{ width: `${tempPct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" min="0" placeholder="0"
            value={dmgVal} onChange={e => setDmgVal(e.target.value)} onKeyDown={hk(applyDamage)} />
          <button className="ctrl-btn dmg" onClick={applyDamage} disabled={busy}>Урон</button>
        </div>
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" min="0" placeholder="0"
            value={healVal} onChange={e => setHealVal(e.target.value)} onKeyDown={hk(applyHeal)} />
          <button className="ctrl-btn heal" onClick={applyHeal} disabled={busy}>Лечение</button>
        </div>
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" min="0" placeholder="0"
            value={tempVal} onChange={e => setTempVal(e.target.value)} onKeyDown={hk(applyTemp)} />
          <button className="ctrl-btn temp" onClick={applyTemp} disabled={busy}>Врем. HP</button>
        </div>
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" placeholder="14"
            value={initVal} onChange={e => setInitVal(e.target.value)} onKeyDown={hk(applyInitiative)} />
          <button className="ctrl-btn" onClick={applyInitiative} disabled={busy}>Иниц.</button>
        </div>
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" placeholder="±0"
            value={acVal} onChange={e => setAcVal(e.target.value)} onKeyDown={hk(applyAc)} />
          <button className="ctrl-btn" onClick={applyAc} disabled={busy}>КБ</button>
        </div>
        <div className="ctrl-group">
          <input className="ctrl-input" type="number" min="1" placeholder="20"
            value={maxHpVal} onChange={e => setMaxHpVal(e.target.value)} onKeyDown={hk(applyMaxHp)} />
          <button className="ctrl-btn" onClick={applyMaxHp} disabled={busy}>Макс HP</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [creatures, setCreatures] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({ name: "", hp: "", ac: "", speed: "", initiative: "" });

  // Load creatures from backend on mount
  useEffect(() => {
    api.fetchCreatures()
      .then(setCreatures)
      .catch(() => setError("Не удалось подключиться к серверу"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...creatures].sort((a, b) => b.initiative - a.initiative);

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function addCreature() {
    const hp  = parseInt(form.hp);
    const ac  = parseInt(form.ac);
    const spd = parseInt(form.speed);
    const ini = parseInt(form.initiative);
    if (!form.name.trim() || isNaN(hp) || hp <= 0) return;

    setSaving(true);
    try {
      const created = await api.createCreature({
        name: form.name.trim(),
        max_hp: hp,
        hp: hp,
        temp_hp: 0,
        ac: isNaN(ac)  ? 10 : ac,
        speed: isNaN(spd) ? 30 : spd,
        initiative: isNaN(ini) ? 0 : ini,
      });
      setCreatures(prev => [...prev, created]);
      setForm({ name: "", hp: "", ac: "", speed: "", initiative: "" });
    } catch {
      setError("Ошибка при создании существа");
    } finally {
      setSaving(false);
    }
  }

  async function removeCreature(id) {
    await api.deleteCreature(id);
    setCreatures(prev => prev.filter(c => c.id !== id));
  }

  function updateCreature(updated) {
    setCreatures(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function handleKey(e) { if (e.key === "Enter") addCreature(); }

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="empty">Загрузка...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <h1>⚔ Combat Tracker</h1>
          <p>Существа отсортированы по инициативе</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="add-form">
          <div className="field">
            <label>Имя</label>
            <input placeholder="Гоблин" value={form.name}
              onChange={e => setField("name", e.target.value)} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>HP</label>
            <input type="number" placeholder="20" value={form.hp}
              onChange={e => setField("hp", e.target.value)} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>КБ</label>
            <input type="number" placeholder="13" value={form.ac}
              onChange={e => setField("ac", e.target.value)} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>Скорость</label>
            <input type="number" placeholder="30" value={form.speed}
              onChange={e => setField("speed", e.target.value)} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>Инициатива</label>
            <input type="number" placeholder="14" value={form.initiative}
              onChange={e => setField("initiative", e.target.value)} onKeyDown={handleKey} />
          </div>
          <button className="btn-add" onClick={addCreature} disabled={saving}>
            {saving ? "..." : "+ Добавить"}
          </button>
        </div>

        <div className="combat-list">
          {sorted.length === 0 && (
            <div className="empty">Добавь существо чтобы начать бой</div>
          )}
          {sorted.map(c => (
            <CreatureCard key={c.id} creature={c}
              onRemove={removeCreature} onUpdate={updateCreature} />
          ))}
        </div>
      </div>
    </>
  );
}
