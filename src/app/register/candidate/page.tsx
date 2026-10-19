"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ROLES } from "@/lib/roles";
export default function RegisterCandidate() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget), sb = supabaseBrowser(), g = (k: string) => String(f.get(k) ?? "");
    const { data, error } = await sb.auth.signUp({ email: g("email"), password: g("password") });
    if (error || !data.user) return setMsg(error?.message ?? "Sign-up failed. Try again.");
    const id = data.user.id; let resume_path: string | null = null; const file = f.get("resume") as File;
    if (file?.size) { resume_path = `${id}/${file.name}`; await sb.storage.from("resumes").upload(resume_path, file); }
    await sb.from("profiles").insert({ id, role: "candidate", full_name: g("name") });
    const { error: e2 } = await sb.from("candidates").insert({ id, role_category: g("role"), mobile: g("mobile"), email: g("email"), city: g("city"), qualification: g("qualification"),
      experience_years: Number(g("exp") || 0), skills: g("skills").split(",").map(s => s.trim().toLowerCase()).filter(Boolean), summary: g("summary"),
      preferred_locations: g("pref").split(",").map(s => s.trim()).filter(Boolean), expected_salary: g("salary") ? Number(g("salary")) : null, resume_path });
    setMsg(e2 ? e2.message : "Profile created. Hospitals can now find you.");
  }
  const I = (n: string, l: string, t = "text", r = true) => <label className="block text-sm font-semibold">{l}<input name={n} type={t} required={r} className="field mt-1 font-normal" /></label>;
  return (<main className="mx-auto max-w-xl px-4 py-10"><h1 className="font-display text-3xl font-extrabold">Create your profile</h1>
    <form onSubmit={submit} className="mt-6 space-y-4">{I("name","Full name")}{I("mobile","Mobile number","tel")}{I("email","Email","email")}{I("password","Password","password")}
      <label className="block text-sm font-semibold">Your role<select name="role" className="field mt-1 font-normal">{ROLES.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>
      {I("city","Current city")}{I("qualification","Qualification (e.g. B.Sc Nursing)")}{I("exp","Years of experience","number")}{I("skills","Skills (comma separated)")}
      {I("pref","Preferred job locations (comma separated)","text",false)}{I("salary","Expected monthly salary (₹)","number",false)}
      <label className="block text-sm font-semibold">Profile summary<textarea name="summary" rows={4} className="field mt-1 font-normal" /></label>
      <label className="block text-sm font-semibold">Resume (PDF)<input name="resume" type="file" accept=".pdf" className="mt-1 block" /></label>
      <button className="btn w-full">Create profile</button>{msg && <p role="status">{msg}</p>}</form></main>);
}
