import Link from "next/link";
import { ROLES } from "@/lib/roles";
export default function Home() {
  return (<main>
    <section className="bg-mint"><div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h1 className="rise max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">Find Qualified Healthcare Professionals Faster</h1>
      <p className="mt-4 max-w-2xl text-lg">Connect with doctors, nurses, technicians, pharmacists, and healthcare staff across India.</p>
      <form action="/search" className="mt-8 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-5">
        <input name="q" placeholder="Keyword or skill" className="field" aria-label="Keyword" />
        <input name="loc" placeholder="Location" className="field" aria-label="Location" />
        <select name="exp" className="field" aria-label="Experience"><option value="0">Any experience</option>{[1,3,5,10].map(n=><option key={n} value={n}>{n}+ years</option>)}</select>
        <input name="qual" placeholder="Qualification" className="field" aria-label="Qualification" />
        <button className="btn">Search candidates</button>
      </form></div></section>
    <section className="mx-auto max-w-6xl px-4 py-14"><h2 className="font-display text-2xl font-bold">Search by role</h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">{ROLES.map(([k,l])=>(<li key={k}><Link href={`/search?role=${k}`} className="block rounded-lg border border-ink/15 bg-white p-4 font-semibold hover:border-care">{l}</Link></li>))}</ul></section>
    <section className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
      {[["For hospitals",["Register your organization","Search candidates by role, skill and city","Contact the people who fit"]],["For candidates",["Create your profile","Upload your resume","Get found by hospitals"]]].map(([t,s])=>(
        <div key={t as string}><h2 className="font-display text-2xl font-bold">{t as string}</h2><ol className="mt-4 list-decimal space-y-2 pl-5">{(s as string[]).map(x=><li key={x}>{x}</li>)}</ol></div>))}
    </section></main>);
}
