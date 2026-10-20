import { MedicalHome } from "@/components/sites/medical/MedicalHome";
import { SearchPage } from "@/components/sites/medical/MedicalPages";

export default async function Home({ searchParams }: { searchParams: Promise<{ s?: string | string[] }> }) {
  const { s } = await searchParams;
  const query = Array.isArray(s) ? s[0] : s;
  if (query?.trim()) return <SearchPage query={query.trim()} />;
  return <MedicalHome />;
}
