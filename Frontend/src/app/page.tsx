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
      <header className="border-b border-neutral-100 px-4 py-6">
        <h1 className="text-2xl font-bold text-neutral-900">Fotor</h1>
        <p className="text-sm text-neutral-500">
          Explore un catalogue infini d&apos;images
        </p>
      </header>

      <Catalogue categories={categories} />
    </main>
  );
}
