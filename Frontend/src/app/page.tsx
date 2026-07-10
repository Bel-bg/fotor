import { gqlClient } from "@/lib/graphql-client";
import { GET_CATEGORIES } from "@/lib/queries";
import type { GetCategoriesResponse } from "@/types/graphql";
import { Catalogue } from "@/components/Catalogue";

// Rendu dynamique : on ne veut pas que Next.js essaie de pré-générer cette page
// au build (ce qui exigerait que le backend soit joignable à ce moment-là).
// Le catalogue doit toujours refléter les données à jour.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { categories } = await gqlClient.request<GetCategoriesResponse>(
    GET_CATEGORIES
  );

  return (
    <main className="flex-1">
      <Catalogue categories={categories} />
    </main>
  );
}
