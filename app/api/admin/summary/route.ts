import { bangkokDate, db, ensureSchema, requireAdmin, serverError } from "@/lib/server";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const today = bangkokDate();
    const month = today.slice(0, 7);
    const [todaySummary, monthSummary, statusCounts, dailyRows, topMenus] = await Promise.all([
      db().prepare(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(total), 0) AS sales
         FROM orders WHERE queue_date = ? AND status != 'cancelled'`,
      ).bind(today).first(),
      db().prepare(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(total), 0) AS sales
         FROM orders WHERE substr(queue_date, 1, 7) = ? AND status != 'cancelled'`,
      ).bind(month).first(),
      db().prepare(
        `SELECT status, COUNT(*) AS count FROM orders
         WHERE queue_date = ? GROUP BY status`,
      ).bind(today).all(),
      db().prepare(
        `SELECT queue_date AS date, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS sales
         FROM orders WHERE queue_date >= date(?, '-6 days') AND status != 'cancelled'
         GROUP BY queue_date ORDER BY queue_date`,
      ).bind(today).all(),
      db().prepare(
        `SELECT oi.menu_name AS name, SUM(oi.quantity) AS quantity, SUM(oi.line_total) AS sales
         FROM order_items oi JOIN orders o ON o.id = oi.order_id
         WHERE substr(o.queue_date, 1, 7) = ? AND o.status != 'cancelled'
         GROUP BY oi.menu_name ORDER BY quantity DESC LIMIT 5`,
      ).bind(month).all(),
    ]);

    return Response.json({
      today: todaySummary ?? { orders: 0, sales: 0 },
      month: monthSummary ?? { orders: 0, sales: 0 },
      statuses: statusCounts.results,
      daily: dailyRows.results,
      topMenus: topMenus.results,
    });
  } catch (error) {
    return serverError(error);
  }
}
