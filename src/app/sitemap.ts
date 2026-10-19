import type { MetadataRoute } from "next";
import { ROLES } from "@/lib/roles";
export default function sitemap(): MetadataRoute.Sitemap {
  const u = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [u, `${u}/search`, ...ROLES.map(([k]) => `${u}/search?role=${k}`)].map((url) => ({ url }));
}
