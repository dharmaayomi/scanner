import { NextRequest, NextResponse } from "next/server";
import { calculateStock, type TransactionType } from "@/lib/stock";

type Payload = {
  taskId?: string; sku?: string; type?: TransactionType; qty?: number;
  operator?: string; notes?: string; currentStock?: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Payload;
  const { taskId, sku, type, qty, operator, notes, currentStock } = body;
  const token = process.env.CLICKUP_API_TOKEN;
  const logListId = process.env.CLICKUP_LOG_LIST_ID;
  const stockField = process.env.FIELD_ID_STOK;

  if (!taskId || !sku || !operator || !type || typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || typeof currentStock !== "number" || !Number.isFinite(currentStock)) {
    return NextResponse.json({ error: "Invalid transaction data." }, { status: 400 });
  }
  if (!token || !logListId || !stockField || !process.env.FIELD_ID_TIPE || !process.env.FIELD_ID_QTY) {
    return NextResponse.json({ error: "ClickUp is not configured." }, { status: 500 });
  }

  const newStock = calculateStock(currentStock, type, qty);
  if (newStock < 0) return NextResponse.json({ error: "Stock cannot be negative." }, { status: 400 });
  const headers = { Authorization: token, "Content-Type": "application/json" };

  const [logResponse, stockResponse] = await Promise.all([
    fetch(`https://api.clickup.com/api/v2/list/${logListId}/task`, {
      method: "POST", headers,
      body: JSON.stringify({
        name: `${type} ${sku} × ${qty}`,
        description: `Operator: ${operator}${notes ? `\nNotes: ${notes}` : ""}`,
        custom_fields: [
          { id: process.env.FIELD_ID_TIPE, value: type },
          { id: process.env.FIELD_ID_QTY, value: qty },
        ],
      }),
    }),
    fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: "PUT", headers,
      body: JSON.stringify({ custom_fields: [{ id: stockField, value: newStock }] }),
    }),
  ]);

  if (!logResponse.ok || !stockResponse.ok) {
    return NextResponse.json({ error: "ClickUp could not save the transaction." }, { status: 502 });
  }
  return NextResponse.json({ success: true, newStock });
}
