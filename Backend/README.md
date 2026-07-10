# Fotor Backend (GraphQL)

Backend GraphQL (GraphQL Yoga) + PostgreSQL via **Neon** (Prisma comme ORM) pour Fotor,
un catalogue infini d'images façon Pinterest. Les images ne sont pas hébergées : seule
leur **URL** est stockée en base.

## 1. Créer la base sur Neon

1. Va sur https://console.neon.tech et crée un projet (ex: `fotor`)
2. Dans **Connection Details**, choisis la **Pooled connection** et copie l'URL
   (elle contient `-pooler` dans le hostname et se termine par `?sslmode=require`)

## 2. Installation

```bash
npm install
cp .env.example .env
# colle ta DATABASE_URL Neon dans .env
```

## 3. Base de données

```bash
npx prisma migrate dev --name init
npm run seed   # peuple la base avec 6 catégories + 120 images de démo
```

## 4. Lancer le serveur

```bash
npm run dev     # avec nodemon
# ou
npm start
```

Le serveur démarre sur `http://localhost:4000`. L'interface GraphiQL (pour tester tes
requêtes directement dans le navigateur) est dispo sur :

```
http://localhost:4000/graphql
```

## Exemples de requêtes

### Récupérer une page du catalogue (infinite scroll)

```graphql
query GetImages($cursor: ID) {
  images(limit: 20, cursor: $cursor, category: "nature", type: "photo") {
    data {
      id
      title
      url
      width
      height
      category {
        name
        slug
      }
    }
    nextCursor
  }
}
```

Côté front, tu relances la même query en passant `cursor: nextCursor` pour charger la
page suivante. Quand `nextCursor` vaut `null`, il n'y a plus rien à charger.

### Récupérer les catégories

```graphql
query {
  categories {
    id
    name
    slug
  }
}
```

### Créer une image

```graphql
mutation {
  createImage(input: {
    title: "Coucher de soleil"
    url: "https://exemple.com/image.jpg"
    width: 800
    height: 1200
    type: "photo"
    categoryId: "1"
  }) {
    id
    title
    url
  }
}
```

### Créer une catégorie

```graphql
mutation {
  createCategory(name: "Nature", slug: "nature") {
    id
    name
  }
}
```

### Modifier / supprimer une image

```graphql
mutation {
  updateImage(id: "1", input: { title: "Nouveau titre" }) {
    id
    title
  }
}

mutation {
  deleteImage(id: "1")
}
```

## Structure du projet

```
fotor-backend/
├── prisma/schema.prisma       # modèles Category & Image
├── src/
│   ├── lib/prisma.js          # client Prisma singleton
│   ├── graphql/
│   │   ├── typeDefs.js        # schéma GraphQL (types, queries, mutations)
│   │   └── resolvers.js       # logique métier (via Prisma)
│   └── app.js                 # Express + GraphQL Yoga monté sur /graphql
├── seed.js                    # données de démo
└── server.js                  # point d'entrée
```

## Prochaines étapes suggérées
- Authentification (JWT) pour associer des images/tableaux à des utilisateurs
- Système de "boards" (tableaux) façon Pinterest
- Likes / sauvegardes
- Recherche full-text sur `title`/`description`
- DataLoader pour éviter le N+1 sur `Image.category` si tu charges beaucoup d'images
