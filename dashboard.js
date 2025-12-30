// dashboard.js
import { loadSnapshot, safeNum, setText, showBanner } from "./snapshot.js";

function moneyPHP(v) {
  const n = safeNum(v, 0);
  return "₱" + n.toLocaleString("en-PH", { maximumFractionDigits: 2 });
}

function renderRecentSales(items) {
  const tbody = document.getElementById("recentSalesBody");
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="padding:14px;text-align:center;opacity:.7;">No records</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .slice(0, 10)
    .map((r, i) => {
      const buyer = r.buyer ?? "N/A";
      const product = r.product ?? "N/A";
      const amount = moneyPHP(r.amount ?? 0);
      const source = r.source ?? "N/A";
      return `
        <tr>
          <td style="padding:10px;">${i + 1}</td>
          <td style="padding:10px;">${buyer}</td>
          <td style="padding:10px;">${product}</td>
          <td style="padding:10px;">${amount} <span style="opacity:.6;font-size:12px;">(${source})</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderLowStock(items) {
  const tbody = document.getElementById("lowStockBody");
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="padding:14px;text-align:center;opacity:.7;">No low stock</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .slice(0, 10)
    .map((r, i) => {
      const product = r.product ?? "N/A";
      const remaining = safeNum(r.remaining, 0);
      const threshold = safeNum(r.threshold, 0);
      return `
        <tr>
          <td style="padding:10px;">${i + 1}</td>
          <td style="padding:10px;">${product}</td>
          <td style="padding:10px;">${remaining} <span style="opacity:.6;font-size:12px;">(min ${threshold})</span></td>
        </tr>
      `;
    })
    .join("");
}

export async function refreshDashboard() {
  try {
    const snap = await loadSnapshot();

    const stats = snap.stats || {};
    setText("tgSalesValue", safeNum(stats.tg_sales, 0));
    setText("manualSalesValue", safeNum(stats.manual_sales, 0));
    setText("stocksValue", safeNum(stats.available_stocks, 0));
    setText("revenueValue", moneyPHP(stats.revenue ?? 0));

    renderRecentSales(snap.recent_sales || []);
    renderLowStock(snap.low_stock || []);

    // optional updated_at label
    if (snap.meta?.updated_at) setText("updatedAtValue", snap.meta.updated_at);
  } catch (e) {
    console.error(e);
    showBanner("Snapshot load failed. Check data.json (or path).");
    // fallback: clear loading states
    setText("tgSalesValue", "0");
    setText("manualSalesValue", "0");
    setText("stocksValue", "0");
    setText("revenueValue", "₱0");
    renderRecentSales([]);
    renderLowStock([]);
  }
}