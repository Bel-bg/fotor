const typeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    name: String!
    slug: String!
    createdAt: String!
  }

  type Image {
    id: ID!
    title: String!
    description: String
    url: String!
    width: Int
    height: Int
    type: String!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  # Pagination simple (comme en REST) : une page de données + le curseur suivant
  type ImagePage {
    data: [Image!]!
    nextCursor: ID
  }

  type Query {
    """
    Catalogue paginé, pour le scroll infini.
    - limit: nombre d'images (défaut 20, max 50)
    - cursor: id de la dernière image reçue (page précédente)
    - category: slug de catégorie, ex "nature"
    - type: ex "photo", "illustration", "gif"
    """
    images(limit: Int, cursor: ID, category: String, type: String): ImagePage!
    image(id: ID!): Image
    categories: [Category!]!
  }

  input CreateImageInput {
    title: String!
    description: String
    url: String!
    width: Int
    height: Int
    type: String!
    categoryId: ID!
  }

  input UpdateImageInput {
    title: String
    description: String
    url: String
    width: Int
    height: Int
    type: String
    categoryId: ID
  }

  type Mutation {
    createImage(input: CreateImageInput!): Image!
    updateImage(id: ID!, input: UpdateImageInput!): Image!
    deleteImage(id: ID!): Boolean!
    createCategory(name: String!, slug: String!): Category!
  }
`;

module.exports = typeDefs;
