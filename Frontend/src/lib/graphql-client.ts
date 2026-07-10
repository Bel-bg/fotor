import { GraphQLClient } from "graphql-request";

// NEXT_PUBLIC_ car utilisé à la fois côté serveur (Server Components)
// et côté client (TanStack Query dans les Client Components).
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!endpoint) {
  throw new Error(
    "NEXT_PUBLIC_GRAPHQL_URL manquant. Ajoute-le dans ton fichier .env.local"
  );
}

export const gqlClient = new GraphQLClient(endpoint);
