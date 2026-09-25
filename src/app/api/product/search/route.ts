import { NextRequest, NextResponse } from "next/server";
import { fieldIds } from "@/lib/clickup";

type ClickUpField = { id: string; value?: string | number | null };
type ClickUpTask = { id: string; name: string; custom_fields?: ClickUpField[] };

const valueOf = (fields: ClickUpField[] | undefined, id: string) =>
  fields?.find((field) => field.id === id)?.value;

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku")?.trim();
  const token = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_MASTER_LIST_ID;

  if (!sku) return NextResponse.json({ error: "SKU is required." }, { status: 400 });
  if (!token || !listId) return NextResponse.json({ error: "ClickUp is not configured." }, { status: 500 });

  const ids = await fieldIds(token, listId, ["SKU / Barcode", "Stok", "Rak", "Brand"]);
  if (!ids) return NextResponse.json({ error: "Could not reach ClickUp." }, { status: 502 });
  const { "SKU / Barcode": skuField, Stok: stockField, Rak: rackField, Brand: brandField } = ids;
  if (!skuField || !stockField || !rackField || !brandField) {
    return NextResponse.json({ error: "Required product fields are missing in ClickUp." }, { status: 500 });
  }

  let product: ClickUpTask | undefined;
  for (let page = 0; !product; page += 1) {
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task?include_closed=true&page=${page}`, {
      headers: { Authorization: token }, cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "Could not reach ClickUp." }, { status: 502 });
    const result = (await response.json()) as { tasks?: ClickUpTask[]; last_page?: boolean };
    product = result.tasks?.find((task) => String(valueOf(task.custom_fields, skuField) ?? "") === sku);
    if (result.last_page || !result.tasks?.length) break;
  }
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  const fields = product.custom_fields;
  return NextResponse.json({
    id: product.id,
    name: product.name,
    sku,
    currentStock: Number(valueOf(fields, stockField) ?? 0),
    rak: String(valueOf(fields, rackField) ?? "-"),
    brand: String(valueOf(fields, brandField) ?? "-"),
  });
}
