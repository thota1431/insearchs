# InSearch PRD (MVP)
**Product:** candidate search platform for healthcare employers (not a job board). Free at launch; premium hospital plans later.
## Users & flows
- Candidate: sign up -> profile + resume -> visible in search -> hospitals contact.
- Hospital: register org -> search/filter -> view profile -> unlock contact -> save candidate.
- Admin: verify organizations, hide/remove profiles, view counts.
## MVP features
Candidate profile + resume upload, public search with filters (role, skill, location, qualification, experience, salary), profile pages, hospital registration, contact unlock, saved candidates, admin moderation, sitemap/SEO.
## Roadmap
1. Week 1-2: Supabase schema, auth, candidate registration, search (this repo).
2. Week 3: hospital registration + dashboard, contact unlock, saved list.
3. Week 4: candidate dashboard, admin, SEO landing pages (/doctors-in-hyderabad).
4. Week 5+: email alerts, resume parsing, verified badges, premium plans.
## SEO
Programmatic pages `/[role]-in-[city]`, JSON-LD, sitemap, one H1 per page, indexable profiles without phone/email.
## Search logic
Filters in `search_candidates()` SQL function: role, ILIKE city/qualification, min experience, max salary, full-text on skills/summary (GIN indexed).
