import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { roleLabel } from "@/lib/roles";
const get = async (id: string) => (await (await supabaseServer()).from("candidates_public").select("*").eq("id", id).single()).data;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = await get((await params).id); return c ? { title: `${c.full_name} - ${roleLabel(c.role_category)} in ${c.city}` } : {};
}
export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const c = await get((await params).id); if (!c) notFound();
  return (<main className="mx-auto max-w-3xl px-4 py-10">
    <h1 className="font-display text-3xl font-extrabold">{c.full_name}</h1>
    <p className="mt-1">{roleLabel(c.role_category)} · {c.city}{c.state ? `, ${c.state}` : ""}</p>
    <dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="font-semibold">Qualification</dt><dd>{c.qualification}</dd></div><div><dt className="font-semibold">Experience</dt><dd>{c.experience_years} years</dd></div>
      <div><dt className="font-semibold">Skills</dt><dd>{c.skills?.join(", ")}</dd></div><div><dt className="font-semibold">Preferred locations</dt><dd>{c.preferred_locations?.join(", ") || "Open"}</dd></div></dl>
    <p className="mt-6">{c.summary}</p>
    <p className="mt-8 rounded-lg bg-mint p-4 text-sm">Phone and email are shown to registered hospitals. Register your organization to contact this candidate.</p></main>);
}
