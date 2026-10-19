import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams, page = Math.max(1, Number(p.get("page") ?? 1)), lim = 20;
  const sb = await supabaseServer();
  const { data, error } = await sb.rpc("search_candidates", {
    q: p.get("q") || null, loc: p.get("loc") || null, role: p.get("role") || null, qual: p.get("qual") || null,
    min_exp: Number(p.get("exp") ?? 0), max_salary: p.get("salary") ? Number(p.get("salary")) : null, lim, off: (page - 1) * lim });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, page });
}
