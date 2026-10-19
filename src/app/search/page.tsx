import Link from "next/link";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { ROLES, roleLabel } from "@/lib/roles";
export const metadata: Metadata = { title: "Search healthcare candidates" };
type SP = Record<string, string | undefined>;
export default async function Search({ searchParams }: { searchParams: Promise<SP> }) {
  const p = await searchParams, sb = await supabaseServer();
  const { data } = await sb.rpc("search_candidates", { q: p.q || null, loc: p.loc || null, role: p.role || null, qual: p.qual || null, min_exp: Number(p.exp ?? 0), max_salary: p.salary ? Number(p.salary) : null });
  return (<main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[260px_1fr]">
    <form className="space-y-3 self-start rounded-xl bg-white p-4">
      <select name="role" defaultValue={p.role ?? ""} className="field" aria-label="Role"><option value="">All roles</option>{ROLES.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select>
      <input name="q" defaultValue={p.q} placeholder="Skill or keyword" className="field" />
      <input name="loc" defaultValue={p.loc} placeholder="Location" className="field" />
      <input name="qual" defaultValue={p.qual} placeholder="Qualification" className="field" />
      <input name="exp" type="number" min="0" defaultValue={p.exp} placeholder="Min. years experience" className="field" />
      <input name="salary" type="number" min="0" defaultValue={p.salary} placeholder="Max. monthly salary (₹)" className="field" />
      <button className="btn w-full">Apply filters</button></form>
    <section><h1 className="font-display text-2xl font-bold">{data?.length ?? 0} candidates found</h1>
      {!data?.length && <p className="mt-4">No matches. Remove a filter or try a nearby city.</p>}
      <ul className="mt-4 space-y-3">{data?.map((c: any)=>(<li key={c.id}><Link href={`/candidates/${c.id}`} className="block rounded-lg border border-ink/15 bg-white p-4 hover:border-care">
        <p className="font-display text-lg font-bold">{c.full_name}</p>
        <p className="text-sm">{roleLabel(c.role_category)} · {c.qualification} · {c.experience_years} yrs · {c.city}</p>
        <p className="mt-1 text-sm">{c.skills?.slice(0,5).join(", ")}</p></Link></li>))}</ul></section></main>);
}
