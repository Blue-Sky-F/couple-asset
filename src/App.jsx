import { useEffect, useState } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
const assetTypeConfig = {
  CASH:  { label: "现金", icon: "💵", color: "#34C759" },
  BANK:  { label: "存款", icon: "🏦", color: "#007AFF" },
  STOCK: { label: "股票", icon: "📈", color: "#34C759" },
  ESOP:  { label: "ESOP", icon: "📊", color: "#5AC8FA" },
  OTHER: { label: "其他", icon: "📦", color: "#8E8E93" },
};

const txCategoryConfig = {
  // Income
  salary:     { label: "工资", icon: "💼" },
  bonus:      { label: "奖金", icon: "🏆" },
  dividend:   { label: "分红", icon: "💰" },
  investment: { label: "投资收益", icon: "📈" },
  income_other: { label: "其他(收入)", icon: "📌" },
  // Expense
  rent:       { label: "房租", icon: "🏠" },
  water:      { label: "水电", icon: "💧" },
  car:        { label: "车贷", icon: "🚗" },
  food:       { label: "伙食", icon: "🍚" },
  dining:     { label: "请客吃饭", icon: "🍽️" },
  shopping:   { label: "购物", icon: "🛍️" },
  redpacket:  { label: "春节红包", icon: "🧧" },
  other:      { label: "其他", icon: "📌" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) => "¥" + Number(n).toLocaleString("zh-CN");
const fmtShort = (n) => {
  if (n >= 10000) return "¥" + (n / 10000).toFixed(1) + "万";
  return "¥" + n.toLocaleString("zh-CN");
};
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const ownerLabel = (owner, members) => {
  if (owner === "joint") return "共同";
  const m = members.find((x) => String(x.userId) === String(owner));
  return m?.displayName || owner;
};
const ownerBadgeStyle = (owner, members) => {
  if (owner === "joint") return { background: "#8E8E9322", color: "#8E8E93" };
  const idx = members.findIndex((x) => String(x.userId) === String(owner));
  const palette = [
    { background: "#007AFF22", color: "#007AFF" },
    { background: "#FF2D5522", color: "#FF2D55" },
    { background: "#34C75922", color: "#34C759" },
    { background: "#FF950022", color: "#FF9500" },
  ];
  return palette[(idx >= 0 ? idx : 0) % palette.length];
};

// ─── Donut Chart ───────────────────────────────────────────────────────────
function DonutChart({ data, size = 120 }) {
  const r = 40, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = sum(data.map((d) => d.value));
  if (total === 0) return null;
  let offset = 0;
  const segments = data.map((d) => {
    const dash = (d.value / total) * circumference;
    const seg = { ...d, dash, offset };
    offset += dash;
    return seg;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={14}
          strokeDasharray={`${s.dash} ${circumference - s.dash}`}
          strokeDashoffset={-s.offset} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={28} fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "-apple-system, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', sans-serif",
    background: "#F2F2F7",
    minHeight: "100dvh",
    color: "#1C1C1E",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
  },
  nav: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
    justifyContent: "center",
  },
  navTitle: { fontSize: 17, fontWeight: 600, letterSpacing: -0.3 },
  page: { padding: "16px 16px 100px" },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  heroCard: (c1, c2) => ({
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 8px 24px ${c1}55`,
  }),
  heroLabel: { fontSize: 13, opacity: 0.8, fontWeight: 500, marginBottom: 4 },
  heroAmount: { fontSize: 40, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1, marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 },
  miniCard: { background: "#fff", borderRadius: 14, padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  miniLabel: { fontSize: 11, color: "#8E8E93", fontWeight: 500, marginBottom: 4 },
  miniNum: { fontSize: 22, fontWeight: 700, letterSpacing: -0.5 },
  listItem: { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #F2F2F7" },
  iconBubble: (color) => ({
    width: 38, height: 38, borderRadius: 10,
    background: color + "22",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, marginRight: 12, flexShrink: 0,
  }),
  segControl: {
    display: "flex", background: "rgba(118,118,128,0.12)",
    borderRadius: 10, padding: 2, marginBottom: 16,
  },
  seg: (active) => ({
    flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
    background: active ? "#fff" : "transparent",
    color: active ? "#1C1C1E" : "#8E8E93",
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
    transition: "all 0.2s",
  }),
  bottomNav: {
    position: "fixed", bottom: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "100%", maxWidth: 430,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    display: "flex", justifyContent: "space-around",
    paddingBottom: "env(safe-area-inset-bottom, 8px)",
    paddingTop: 8,
    zIndex: 100,
  },
  navItem: (active) => ({
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 2, cursor: "pointer",
    color: active ? "#007AFF" : "#8E8E93",
    fontSize: 10, fontWeight: 500,
    padding: "2px 20px", border: "none", background: "none",
    transition: "color 0.2s",
  }),
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E5E5EA", fontSize: 15,
    background: "#F9F9F9", color: "#1C1C1E", outline: "none",
    boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit",
  },
  select: {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E5E5EA", fontSize: 15,
    background: "#F9F9F9", color: "#1C1C1E", outline: "none",
    boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit",
  },
  btn: (color = "#007AFF") => ({
    width: "100%", padding: 14, borderRadius: 12, border: "none",
    background: color, color: "#fff", fontSize: 16,
    fontWeight: 600, cursor: "pointer", letterSpacing: -0.3,
    fontFamily: "inherit",
  }),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ assets, transactions, perspective, setPerspective, members }) {
  const filter = (arr) =>
    perspective === "total" ? arr : arr.filter((a) => a.owner === perspective || a.owner === "joint");

  const filteredAssets = filter(assets);
  const total = sum(filteredAssets.map((a) => a.amount));
  const byMember = members.map((m) => ({
    userId: m.userId,
    displayName: m.displayName,
    total: sum(assets.filter((a) => String(a.owner) === String(m.userId)).map((a) => a.amount)),
  }));

  const byType = Object.entries(assetTypeConfig).map(([key, cfg]) => ({
    label: cfg.label, color: cfg.color,
    value: sum(filteredAssets.filter((a) => a.type === key).map((a) => a.amount)),
  })).filter((d) => d.value > 0);

  const heroColors = {
    total: ["#1C1C1E", "#3A3A3C"],
  };
  members.forEach((m, idx) => {
    const palette = [
      ["#007AFF", "#0A5ADB"],
      ["#FF2D55", "#C2002E"],
      ["#34C759", "#1E9E43"],
      ["#FF9500", "#C76A00"],
    ];
    heroColors[String(m.userId)] = palette[idx % palette.length];
  });
  const heroLabels = {
    total: "💑 总资产",
    ...Object.fromEntries(members.map((m) => [String(m.userId), `${m.displayName}资产`])),
  };

  const now = new Date().toISOString().slice(0, 7);
  const monthIncome = sum(transactions.filter((t) => t.type === "income" && t.date.startsWith(now)).map((t) => t.amount));
  const monthExpense = sum(transactions.filter((t) => t.type === "expense" && t.date.startsWith(now)).map((t) => t.amount));
  const recentTx = filter(transactions).slice().reverse().slice(0, 6);

  return (
    <div style={S.page}>
      <div style={S.segControl}>
        {[
          ["total", "总资产"],
          ...members.map((m) => [String(m.userId), m.displayName]),
        ].map(([v, l]) => (
          <button key={v} style={S.seg(perspective === v)} onClick={() => setPerspective(v)}>{l}</button>
        ))}
      </div>

      <div style={S.heroCard(...heroColors[perspective])}>
        <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.07, fontSize: 110, lineHeight: 1 }}>
          {perspective === "total" ? "💑" : "👤"}
        </div>
        <div style={S.heroLabel}>{heroLabels[perspective]}</div>
        <div style={S.heroAmount}>{fmtShort(total)}</div>
        {perspective === "total" && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {byMember.map((m) => (
              <div key={m.userId}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{m.displayName}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{fmtShort(m.total)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={S.grid2}>
        <div style={S.miniCard}>
          <div style={S.miniLabel}>本月收入</div>
          <div style={{ ...S.miniNum, color: "#34C759" }}>+{fmtShort(monthIncome || 0)}</div>
        </div>
        <div style={S.miniCard}>
          <div style={S.miniLabel}>本月支出</div>
          <div style={{ ...S.miniNum, color: "#FF3B30" }}>-{fmtShort(monthExpense || 0)}</div>
        </div>
      </div>

      {byType.length > 0 && (
        <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }}>
          <DonutChart data={byType} size={108} />
          <div style={{ flex: 1 }}>
            {byType.map((d) => (
              <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#3C3C43" }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{fmtShort(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...S.card, padding: 0 }}>
        <div style={{ padding: "14px 16px 6px", fontSize: 13, fontWeight: 600, color: "#8E8E93", letterSpacing: 0.3 }}>
          最近流水
        </div>
        {recentTx.length === 0 && (
          <div style={{ padding: "20px 16px", color: "#8E8E93", fontSize: 14, textAlign: "center" }}>暂无记录</div>
        )}
        {recentTx.map((t, i) => {
          const cat = txCategoryConfig[t.category] || txCategoryConfig.other;
          return (
            <div key={t.id} style={{ ...S.listItem, borderTop: i === 0 ? "1px solid #F2F2F7" : "none", borderBottom: "none" }}>
              <div style={S.iconBubble(t.type === "income" ? "#34C759" : "#FF3B30")}>{cat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.note || cat.label}
                </div>
                <div style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
                  {t.date} · {ownerLabel(t.owner, members)}
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.type === "income" ? "#34C759" : "#FF3B30", marginLeft: 8, flexShrink: 0 }}>
                {t.type === "income" ? "+" : "-"}{fmtShort(t.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Assets Page ───────────────────────────────────────────────────────────
function AssetsPage({ assets, members, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "BANK", owner: "joint", amount: "", note: "" });

  const toggleForm = () => {
    if (showForm) {
      setEditingId(null);
      setForm({ name: "", type: "BANK", owner: "joint", amount: "", note: "" });
    }
    setShowForm(!showForm);
  };

  const handleSubmit = () => {
    if (!form.name || !form.amount) return;
    if (editingId) {
      onEdit({ ...form, amount: parseFloat(form.amount), id: editingId });
    } else {
      onAdd({ ...form, amount: parseFloat(form.amount), id: Date.now() });
    }
    setEditingId(null);
    setForm({ name: "", type: "BANK", owner: "joint", amount: "", note: "" });
    setShowForm(false);
  };

  const handleEdit = (asset) => {
    setForm(asset);
    setEditingId(asset.id);
    setShowForm(true);
  };

  const grouped = Object.entries(assetTypeConfig)
    .map(([key, cfg]) => ({ key, cfg, items: assets.filter((a) => a.type === key) }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>资产明细</span>
        <button onClick={toggleForm} style={{ ...S.btn("#007AFF"), width: "auto", padding: "8px 18px", fontSize: 14, borderRadius: 20 }}>
          {showForm ? "取消" : "+ 添加"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{editingId ? "编辑资产" : "新增资产"}</div>
          <input style={S.input} placeholder="资产名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select style={S.select} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {Object.entries(assetTypeConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <select style={S.select} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
            <option value="joint">👫 共同</option>
            {members.map((m) => (
              <option key={m.userId} value={String(m.userId)}>{m.displayName}</option>
            ))}
          </select>
          <input style={S.input} type="number" placeholder="金额（元）" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input style={S.input} placeholder="备注（选填）" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button style={S.btn()} onClick={handleSubmit}>{editingId ? "确认修改" : "确认添加"}</button>
        </div>
      )}

      {grouped.map(({ key, cfg, items }) => (
        <div key={key} style={{ ...S.card, padding: 0 }}>
          <div style={{ padding: "12px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{cfg.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#8E8E93" }}>
              合计 {fmtShort(sum(items.map((a) => a.amount)))}
            </span>
          </div>
          {items.map((a) => (
            <div key={a.id} style={{ ...S.listItem, borderTop: "1px solid #F2F2F7", borderBottom: "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{a.name}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 600,
                    ...ownerBadgeStyle(a.owner, members),
                  }}>
                    {ownerLabel(a.owner, members)}
                  </span>
                </div>
                {a.note && <div style={{ fontSize: 12, color: "#8E8E93" }}>{a.note}</div>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{fmt(a.amount)}</div>
                <div style={{ marginTop: 2 }}>
                  <button onClick={() => handleEdit(a)} style={{ fontSize: 11, color: "#007AFF", background: "none", border: "none", cursor: "pointer", padding: "0 8px 0 0", fontFamily: "inherit" }}>
                    编辑
                  </button>
                  <button onClick={() => onDelete(a.id)} style={{ fontSize: 11, color: "#FF3B30", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Transactions Page ─────────────────────────────────────────────────────
function TransactionsPage({ transactions, members, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [txType, setTxType] = useState("income");
  const [form, setForm] = useState({
    category: "salary", owner: "joint", amount: "", note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const toggleForm = () => {
    if (showForm) {
      setEditingId(null);
      setForm({ category: "salary", owner: "joint", amount: "", note: "", date: new Date().toISOString().slice(0, 10) });
    }
    setShowForm(!showForm);
  };

  const handleSubmit = () => {
    if (!form.amount) return;
    if (editingId) {
      onEdit({ ...form, type: txType, amount: parseFloat(form.amount), id: editingId });
    } else {
      onAdd({ ...form, type: txType, amount: parseFloat(form.amount), id: Date.now() });
    }
    setEditingId(null);
    setForm({ category: "salary", owner: "male", amount: "", note: "", date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  const handleEdit = (tx) => {
    setTxType(tx.type);
    setForm({ ...tx, amount: tx.amount });
    setEditingId(tx.id);
    setShowForm(true);
  };

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>收支记录</span>
        <button onClick={toggleForm} style={{ ...S.btn("#007AFF"), width: "auto", padding: "8px 18px", fontSize: 14, borderRadius: 20 }}>
          {showForm ? "取消" : "+ 记一笔"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{editingId ? "编辑收支" : "新增收支"}</div>
          <div style={S.segControl}>
            <button style={S.seg(txType === "income")} onClick={() => setTxType("income")}>💰 收入</button>
            <button style={S.seg(txType === "expense")} onClick={() => setTxType("expense")}>💸 支出</button>
          </div>
          <select style={S.select} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {Object.entries(txCategoryConfig)
              .filter(([k]) => {
                if (txType === "income") {
                  return ["salary", "bonus", "dividend", "investment", "income_other"].includes(k);
                } else {
                  return ["rent", "water", "car", "food", "dining", "shopping", "redpacket", "other"].includes(k);
                }
              })
              .map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <select style={S.select} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
            <option value="joint">👫 共同</option>
            {members.map((m) => (
              <option key={m.userId} value={String(m.userId)}>{m.displayName}</option>
            ))}
          </select>
          <input style={S.input} type="number" placeholder="金额（元）" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input style={S.input} placeholder="备注" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <input style={S.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <button style={S.btn(txType === "income" ? "#34C759" : "#FF3B30")} onClick={handleSubmit}>{editingId ? "确认修改" : "确认添加"}</button>
        </div>
      )}

      <div style={{ ...S.card, padding: 0 }}>
        {transactions.slice().reverse().map((t, i) => {
          const cat = txCategoryConfig[t.category] || txCategoryConfig.other;
          return (
            <div key={t.id} style={{ ...S.listItem, borderTop: i === 0 ? "none" : "1px solid #F2F2F7", borderBottom: "none" }}>
              <div style={S.iconBubble(t.type === "income" ? "#34C759" : "#FF3B30")}>{cat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.note || cat.label}
                </div>
                <div style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
                  {t.date} · {ownerLabel(t.owner, members)} · {cat.label}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.type === "income" ? "#34C759" : "#FF3B30" }}>
                  {t.type === "income" ? "+" : "-"}{fmtShort(t.amount)}
                </div>
                <div style={{ marginTop: 2 }}>
                  <button onClick={() => handleEdit(t)} style={{ fontSize: 11, color: "#007AFF", background: "none", border: "none", cursor: "pointer", padding: "0 8px 0 0", fontFamily: "inherit" }}>
                    编辑
                  </button>
                  <button onClick={() => onDelete(t.id)} style={{ fontSize: 11, color: "#FF3B30", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                    删除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {transactions.length === 0 && (
          <div style={{ padding: "30px 16px", color: "#8E8E93", fontSize: 14, textAlign: "center" }}>暂无记录，点击「记一笔」开始</div>
        )}
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [perspective, setPerspective] = useState("total");
  const [token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [me, setMe] = useState(null);
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    identifier: "",
    password: "",
    email: "",
    phone: "",
    displayName: "",
    householdName: "",
  });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const api = async (path, { method = "GET", body, timeoutMs = 10000 } = {}) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let res;
      try {
        res = await fetch(path, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
      } catch (e) {
        if (e?.name === "AbortError") throw new Error("请求超时，请稍后重试");
        throw new Error("网络异常，请检查网络后重试");
      }

      if (res.status === 204) return null;
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        const msg =
          json?.message ||
          (res.status === 401 ? "未登录或登录已过期" : "") ||
          (res.status === 403 ? "无权限访问" : "") ||
          (res.status === 404 ? "资源不存在" : "") ||
          (res.status >= 500 ? "服务异常，请稍后重试" : "") ||
          res.statusText ||
          "请求失败";
        throw new Error(msg);
      }
      return json;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const nowMonth = new Date().toISOString().slice(0, 7);

  const mapAssetFromApi = (a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    owner: a.scope === "JOINT" ? "joint" : String(a.ownerUserId),
    amount: Number(a.amount),
    note: a.note || "",
  });

  const mapTxFromApi = (t) => ({
    id: t.id,
    type: t.direction === "INCOME" ? "income" : "expense",
    category: t.category,
    owner: t.scope === "JOINT" ? "joint" : String(t.ownerUserId),
    amount: Number(t.amount),
    note: t.note || "",
    date: String(t.occurredAt).slice(0, 10),
  });

  const refreshAssets = async () => {
    const list = await api("/api/assets");
    setAssets(list.map(mapAssetFromApi));
  };

  const refreshTransactions = async (month = nowMonth) => {
    const list = await api(`/api/transactions?month=${month}`);
    setTransactions(list.map(mapTxFromApi));
  };

  const bootstrap = async () => {
    const user = await api("/api/users/me");
    const hm = await api("/api/households/me");
    setMe(user);
    setHousehold(hm.household);
    setMembers(hm.members || []);
    await refreshAssets();
    await refreshTransactions(nowMonth);
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    bootstrap()
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("accessToken");
        setToken("");
        setMe(null);
        setHousehold(null);
        setMembers([]);
        setAssets([]);
        setTransactions([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken("");
    setMe(null);
    setHousehold(null);
    setMembers([]);
    setAssets([]);
    setTransactions([]);
    setPage("dashboard");
    setPerspective("total");
  };

  const submitAuth = async () => {
    setAuthError("");
    setLoading(true);
    try {
      const payload =
        authMode === "login"
          ? { identifier: authForm.identifier, password: authForm.password }
          : {
              email: authForm.email,
              phone: authForm.phone,
              password: authForm.password,
              displayName: authForm.displayName,
              householdName: authForm.householdName,
            };
      const res = await api(`/api/auth/${authMode === "login" ? "login" : "register"}`, {
        method: "POST",
        body: payload,
      });
      localStorage.setItem("accessToken", res.accessToken);
      setToken(res.accessToken);
      setMe(res.user);
      setHousehold(res.household);
      setMembers(res.members || []);
      setPerspective("total");
    } catch (e) {
      setAuthError(e.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const buildAssetBody = (a) => {
    const scope = a.owner === "joint" ? "JOINT" : "PERSONAL";
    const type = (a.type || "").trim();
    const name = (a.name || "").trim();
    const amount = Number(a.amount);

    if (!type) throw new Error("请选择资产类型");
    if (!assetTypeConfig[type]) throw new Error("资产类型无效");
    if (!name) throw new Error("请输入资产名称");
    if (!Number.isFinite(amount)) throw new Error("请输入正确的金额");

    const body = {
      scope,
      ownerUserId: null,
      type,
      name,
      amount,
      note: a.note ? String(a.note).trim() : null,
    };

    if (scope === "PERSONAL") {
      const ownerUserId = Number(a.owner);
      if (!Number.isFinite(ownerUserId)) throw new Error("请选择资产归属人");
      body.ownerUserId = ownerUserId;
    }
    return body;
  };

  const addAsset = async (a) => {
    const body = buildAssetBody(a);
    await api("/api/assets", { method: "POST", body });
    await refreshAssets();
  };

  const editAsset = async (a) => {
    const body = buildAssetBody(a);
    await api(`/api/assets/${a.id}`, { method: "PUT", body });
    await refreshAssets();
  };

  const deleteAsset = async (id) => {
    await api(`/api/assets/${id}`, { method: "DELETE" });
    await refreshAssets();
  };

  const addTransaction = async (t) => {
    const body = {
      scope: t.owner === "joint" ? "JOINT" : "PERSONAL",
      ownerUserId: t.owner === "joint" ? null : Number(t.owner),
      direction: t.type === "income" ? "INCOME" : "EXPENSE",
      category: t.category,
      amount: t.amount,
      occurredAt: `${t.date}T00:00:00`,
      note: t.note,
    };
    await api("/api/transactions", { method: "POST", body });
    await refreshTransactions(nowMonth);
  };

  const editTransaction = async (t) => {
    const body = {
      scope: t.owner === "joint" ? "JOINT" : "PERSONAL",
      ownerUserId: t.owner === "joint" ? null : Number(t.owner),
      direction: t.type === "income" ? "INCOME" : "EXPENSE",
      category: t.category,
      amount: t.amount,
      occurredAt: `${t.date}T00:00:00`,
      note: t.note,
    };
    await api(`/api/transactions/${t.id}`, { method: "PUT", body });
    await refreshTransactions(nowMonth);
  };

  const deleteTransaction = async (id) => {
    await api(`/api/transactions/${id}`, { method: "DELETE" });
    await refreshTransactions(nowMonth);
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "总览" },
    { id: "assets",    icon: "💎", label: "资产" },
    { id: "transactions", icon: "📝", label: "收支" },
  ];

  return (
    <div style={S.app}>
      <div style={S.nav}>
        <span style={S.navTitle}>{household?.name ? `💑 ${household.name}` : "💑 共同资产"}</span>
        {token && (
          <button
            onClick={logout}
            style={{
              position: "absolute",
              right: 16,
              border: "none",
              background: "none",
              color: "#007AFF",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            退出
          </button>
        )}
      </div>

      {!token ? (
        <div style={S.page}>
          <div style={{ ...S.card, marginTop: 10 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button style={S.seg(authMode === "login")} onClick={() => setAuthMode("login")}>登录</button>
              <button style={S.seg(authMode === "register")} onClick={() => setAuthMode("register")}>注册</button>
            </div>
            {authMode === "login" ? (
              <>
                <input
                  style={S.input}
                  placeholder="邮箱或手机号"
                  value={authForm.identifier}
                  onChange={(e) => setAuthForm({ ...authForm, identifier: e.target.value })}
                />
                <input
                  style={S.input}
                  type="password"
                  placeholder="密码"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
                {authError && <div style={{ color: "#FF3B30", fontSize: 13, marginBottom: 10 }}>{authError}</div>}
                <button style={S.btn()} onClick={submitAuth} disabled={loading}>登录</button>
              </>
            ) : (
              <>
                <input
                  style={S.input}
                  placeholder="昵称"
                  value={authForm.displayName}
                  onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })}
                />
                <input
                  style={S.input}
                  placeholder="邮箱（选填）"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
                <input
                  style={S.input}
                  placeholder="手机号（选填）"
                  value={authForm.phone}
                  onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                />
                <input
                  style={S.input}
                  type="password"
                  placeholder="密码"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
                <input
                  style={S.input}
                  placeholder="家庭名称（选填）"
                  value={authForm.householdName}
                  onChange={(e) => setAuthForm({ ...authForm, householdName: e.target.value })}
                />
                {authError && <div style={{ color: "#FF3B30", fontSize: 13, marginBottom: 10 }}>{authError}</div>}
                <button style={S.btn("#34C759")} onClick={submitAuth} disabled={loading}>注册</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {page === "dashboard" && (
            <Dashboard
              assets={assets}
              transactions={transactions}
              perspective={perspective}
              setPerspective={setPerspective}
              members={members}
            />
          )}
          {page === "assets" && (
            <AssetsPage
              assets={assets}
              members={members}
              onAdd={addAsset}
              onEdit={editAsset}
              onDelete={deleteAsset}
            />
          )}
          {page === "transactions" && (
            <TransactionsPage
              transactions={transactions}
              members={members}
              onAdd={addTransaction}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}
        </>
      )}

      {token && (
        <div style={S.bottomNav}>
          {navItems.map((n) => (
            <button key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
              <span style={{ fontSize: 24 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
