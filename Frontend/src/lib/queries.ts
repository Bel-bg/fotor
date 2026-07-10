export const GET_IMAGES = /* GraphQL */ `
  query GetImages($limit: Int, $cursor: ID, $category: String, $type: String) {
    images(limit: $limit, cursor: $cursor, category: $category, type: $type) {
      data {
        id
        title
        description
        url
        width
        height
        type
        category {
          id
          name
          slug
        }
      }
      nextCursor
    }
  }
`;

export const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;
