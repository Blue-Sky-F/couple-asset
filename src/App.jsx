import { useState } from "react";

// ─── Initial Data ──────────────────────────────────────────────────────────
const initialAssets = [
  { id: 1, name: "ESOP", type: "stock", owner: "male", amount: 863500, note: "长期持有" },
  { id: 2, name: "ESOP", type: "stock", owner: "female", amount: 863500, note: "" },
  { id: 3, name: "ESOP1", type: "stock", owner: "female", amount: 314000, note: "" },
  { id: 4, name: "招商银行存款", type: "deposit", owner: "female", amount: 307000, note: "工资卡" },
  { id: 5, name: "工商银行存款", type: "deposit", owner: "male", amount: 100000, note: "工资卡" },
  { id: 6, name: "嫁妆", type: "dowry", owner: "male", amount: 400000, note: "小王婚前财产" },
  { id: 7, name: "投资借款", type: "receivable", owner: "male", amount: 500000, note: "" },
  { id: 8, name: "工资收入", type: "salary", owner: "male", amount: 44300, note: "月薪" },
  { id: 9, name: "工资收入", type: "salary", owner: "female", amount: 38500, note: "月薪" },
];

const initialTransactions = [
  { id: 1, type: "income", category: "other", owner: "joint", amount: 7000, note: "春节红包", date: "2026-02-10" },
  { id: 2, type: "expense", category: "other", owner: "female", amount: 9700, note: "春节红包", date: "2026-02-10" },
  { id: 3, type: "expense", category: "other", owner: "male", amount: 7700, note: "春节红包", date: "2026-02-15" },
];

// ─── Config ────────────────────────────────────────────────────────────────
const assetTypeConfig = {
  stock:      { label: "股票",     icon: "📈", color: "#34C759" },
  deposit:    { label: "存款",     icon: "🏦", color: "#007AFF" },
  dowry:      { label: "嫁妆",     icon: "💍", color: "#FF2D55" },
  receivable: { label: "应收借款", icon: "📋", color: "#FF9500" },
  salary:     { label: "工资收入", icon: "💰", color: "#5AC8FA" },
  other:      { label: "其他",     icon: "📦", color: "#8E8E93" },
};

const txCategoryConfig = {
  salary:     { label: "工资", icon: "💼" },
  investment: { label: "投资收益", icon: "📈" },
  living:     { label: "生活支出", icon: "🛒" },
  other:      { label: "其他", icon: "📌" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) => "¥" + Number(n).toLocaleString("zh-CN");
const fmtShort = (n) => {
  if (n >= 10000) return "¥" + (n / 10000).toFixed(1) + "万";
  return "¥" + n.toLocaleString("zh-CN");
};
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

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
function Dashboard({ assets, transactions, perspective, setPerspective }) {
  const filter = (arr) =>
    perspective === "total" ? arr : arr.filter((a) => a.owner === perspective || a.owner === "joint");

  const filteredAssets = filter(assets);
  const total = sum(filteredAssets.map((a) => a.amount));
  const maleTotal = sum(assets.filter((a) => a.owner === "male").map((a) => a.amount));
  const femaleTotal = sum(assets.filter((a) => a.owner === "female").map((a) => a.amount));

  const byType = Object.entries(assetTypeConfig).map(([key, cfg]) => ({
    label: cfg.label, color: cfg.color,
    value: sum(filteredAssets.filter((a) => a.type === key).map((a) => a.amount)),
  })).filter((d) => d.value > 0);

  const heroColors = {
    total: ["#1C1C1E", "#3A3A3C"],
    male: ["#007AFF", "#0A5ADB"],
    female: ["#FF2D55", "#C2002E"],
  };
  const heroLabels = { total: "💑 总资产", male: "👨 小王资产", female: "👩 小徐资产" };

  const now = new Date().toISOString().slice(0, 7);
  const monthIncome = sum(transactions.filter((t) => t.type === "income" && t.date.startsWith(now)).map((t) => t.amount));
  const monthExpense = sum(transactions.filter((t) => t.type === "expense" && t.date.startsWith(now)).map((t) => t.amount));
  const recentTx = filter(transactions).slice().reverse().slice(0, 6);

  return (
    <div style={S.page}>
      <div style={S.segControl}>
        {[["total","总资产"],["male","👨 小王"],["female","👩 小徐"]].map(([v, l]) => (
          <button key={v} style={S.seg(perspective === v)} onClick={() => setPerspective(v)}>{l}</button>
        ))}
      </div>

      <div style={S.heroCard(...heroColors[perspective])}>
        <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.07, fontSize: 110, lineHeight: 1 }}>
          {perspective === "male" ? "👨" : perspective === "female" ? "👩" : "💑"}
        </div>
        <div style={S.heroLabel}>{heroLabels[perspective]}</div>
        <div style={S.heroAmount}>{fmtShort(total)}</div>
        {perspective === "total" && (
          <div style={{ display: "flex", gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>小王</div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{fmtShort(maleTotal)}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>小徐</div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{fmtShort(femaleTotal)}</div>
            </div>
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
                  {t.date} · {t.owner === "joint" ? "共同" : t.owner === "male" ? "小王" : "小徐"}
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
function AssetsPage({ assets, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "deposit", owner: "male", amount: "", note: "" });

  const toggleForm = () => {
    if (showForm) {
      setEditingId(null);
      setForm({ name: "", type: "deposit", owner: "male", amount: "", note: "" });
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
    setForm({ name: "", type: "deposit", owner: "male", amount: "", note: "" });
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
            <option value="male">👨 小王</option>
            <option value="female">👩 小徐</option>
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
          {items.map((a, i) => (
            <div key={a.id} style={{ ...S.listItem, borderTop: "1px solid #F2F2F7", borderBottom: "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{a.name}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 600,
                    background: a.owner === "male" ? "#007AFF22" : "#FF2D5522",
                    color: a.owner === "male" ? "#007AFF" : "#FF2D55",
                  }}>
                    {a.owner === "male" ? "小王" : "小徐"}
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
function TransactionsPage({ transactions, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [txType, setTxType] = useState("income");
  const [form, setForm] = useState({
    category: "salary", owner: "male", amount: "", note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const toggleForm = () => {
    if (showForm) {
      setEditingId(null);
      setForm({ category: "salary", owner: "male", amount: "", note: "", date: new Date().toISOString().slice(0, 10) });
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
            {Object.entries(txCategoryConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <select style={S.select} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
            <option value="male">👨 小王</option>
            <option value="female">👩 小徐</option>
            <option value="joint">👫 共同</option>
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
                  {t.date} · {t.owner === "joint" ? "共同" : t.owner === "male" ? "小王" : "小徐"} · {cat.label}
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
  const [assets, setAssets] = useState(initialAssets);
  const [transactions, setTransactions] = useState(initialTransactions);

  const addAsset = (a) => setAssets((prev) => [...prev, a]);
  const editAsset = (updated) => setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  const deleteAsset = (id) => setAssets((prev) => prev.filter((a) => a.id !== id));
  const addTransaction = (t) => setTransactions((prev) => [...prev, t]);
  const editTransaction = (updated) => setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTransaction = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const navItems = [
    { id: "dashboard", icon: "📊", label: "总览" },
    { id: "assets",    icon: "💎", label: "资产" },
    { id: "transactions", icon: "📝", label: "收支" },
  ];

  return (
    <div style={S.app}>
      <div style={S.nav}>
        <span style={S.navTitle}>💑 共同资产</span>
      </div>

      {page === "dashboard" && (
        <Dashboard assets={assets} transactions={transactions} perspective={perspective} setPerspective={setPerspective} />
      )}
      {page === "assets" && (
        <AssetsPage assets={assets} onAdd={addAsset} onEdit={editAsset} onDelete={deleteAsset} />
      )}
      {page === "transactions" && (
        <TransactionsPage transactions={transactions} onAdd={addTransaction} onEdit={editTransaction} onDelete={deleteTransaction} />
      )}

      <div style={S.bottomNav}>
        {navItems.map((n) => (
          <button key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
            <span style={{ fontSize: 24 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
