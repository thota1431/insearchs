create extension if not exists pg_trgm;
create type user_role as enum ('candidate','employer','admin');
create type org_type as enum ('hospital','clinic','diagnostic_center','other');

create table profiles (id uuid primary key references auth.users on delete cascade, role user_role not null default 'candidate', full_name text, created_at timestamptz default now());
create table candidates (
  id uuid primary key references profiles(id) on delete cascade,
  role_category text not null check (role_category in ('doctor','nurse','pharmacist','lab_technician','receptionist','billing_executive','ot_technician','radiology_technician','ambulance_driver','housekeeping')),
  mobile text not null, email text not null, city text not null, state text,
  qualification text not null, experience_years numeric(4,1) not null default 0,
  skills text[] not null default '{}', summary text, resume_path text,
  preferred_locations text[] not null default '{}', expected_salary int,
  is_visible boolean not null default true, created_at timestamptz default now(), updated_at timestamptz default now(),
  fts tsvector generated always as (to_tsvector('simple', coalesce(qualification,'')||' '||coalesce(summary,'')||' '||array_to_string(skills,' '))) stored
);
create index on candidates using gin(fts);
create index on candidates using gin(skills);
create index on candidates using gin(city gin_trgm_ops);
create index on candidates(role_category, experience_years);

create table organizations (id uuid primary key default gen_random_uuid(), owner_id uuid references profiles(id) on delete cascade, name text not null, type org_type not null, city text not null, state text, phone text, website text, verified boolean default false, created_at timestamptz default now());
create table contact_unlocks (id uuid primary key default gen_random_uuid(), org_id uuid references organizations(id) on delete cascade, candidate_id uuid references candidates(id) on delete cascade, created_at timestamptz default now(), unique(org_id, candidate_id));
create table saved_candidates (org_id uuid references organizations(id) on delete cascade, candidate_id uuid references candidates(id) on delete cascade, primary key(org_id, candidate_id));

-- Public view: no phone/email. Contact details are released via contact_unlocks only.
create view candidates_public as select c.id, p.full_name, role_category, city, state, qualification, experience_years, skills, summary, preferred_locations, expected_salary from candidates c join profiles p on p.id=c.id where is_visible;

create function search_candidates(q text default null, loc text default null, role text default null, qual text default null, min_exp numeric default 0, max_salary int default null, lim int default 20, off int default 0)
returns setof candidates_public language sql stable as $$
  select cp.* from candidates_public cp join candidates c on c.id=cp.id
  where (role is null or cp.role_category=role)
    and (loc is null or cp.city ilike '%'||loc||'%' or loc ilike any(select '%'||unnest(cp.preferred_locations)||'%'))
    and (qual is null or cp.qualification ilike '%'||qual||'%')
    and cp.experience_years >= coalesce(min_exp,0)
    and (max_salary is null or cp.expected_salary is null or cp.expected_salary <= max_salary)
    and (q is null or c.fts @@ plainto_tsquery('simple', q) or cp.skills && string_to_array(lower(q),' '))
  order by cp.experience_years desc limit lim offset off $$;

alter table profiles enable row level security; alter table candidates enable row level security;
alter table organizations enable row level security; alter table contact_unlocks enable row level security; alter table saved_candidates enable row level security;
create policy "own profile" on profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "own candidate" on candidates for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "own org" on organizations for all using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
create policy "own unlocks" on contact_unlocks for all using (org_id in (select id from organizations where owner_id=auth.uid()));
create policy "own saves" on saved_candidates for all using (org_id in (select id from organizations where owner_id=auth.uid()));
grant select on candidates_public to anon, authenticated;
