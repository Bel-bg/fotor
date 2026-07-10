const prisma = require("../lib/prisma");
const { GraphQLError } = require("graphql");

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

function notFound(message) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function badRequest(message) {
  return new GraphQLError(message, { extensions: { code: "BAD_REQUEST" } });
}

const resolvers = {
  Query: {
    async images(_parent, { limit, cursor, category, type }) {
      const take = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
      const where = {};

      if (category) where.category = { slug: category };
      if (type) where.type = type;

      const images = await prisma.image.findMany({
        where,
        take: take + 1, // +1 pour savoir s'il reste une page suivante
        ...(cursor && {
          skip: 1,
          cursor: { id: Number(cursor) },
        }),
        orderBy: { id: "desc" },
      });

      const hasNextPage = images.length > take;
      const data = hasNextPage ? images.slice(0, take) : images;
      const nextCursor = hasNextPage ? data[data.length - 1].id : null;

      return { data, nextCursor };
    },

    async images(_parent, { limit, cursor, category, type, search }) {
  const take = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
  const where = {};

  if (category) where.category = { slug: category };
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const images = await prisma.image.findMany({
    where,
    take: take + 1,
    ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
    orderBy: { id: "desc" },
  });

  const hasNextPage = images.length > take;
  const data = hasNextPage ? images.slice(0, take) : images;
  const nextCursor = hasNextPage ? data[data.length - 1].id : null;

  return { data, nextCursor };
},
    

    async categories() {
      return prisma.category.findMany({ orderBy: { name: "asc" } });
    },
  },

  Mutation: {
    async createImage(_parent, { input }) {
      const category = await prisma.category.findUnique({
        where: { id: Number(input.categoryId) },
      });
      if (!category) throw badRequest("categoryId invalide");

      return prisma.image.create({
        data: {
          title: input.title,
          description: input.description,
          url: input.url,
          width: input.width,
          height: input.height,
          type: input.type,
          categoryId: Number(input.categoryId),
        },
      });
    },

    async updateImage(_parent, { id, input }) {
      const existing = await prisma.image.findUnique({ where: { id: Number(id) } });
      if (!existing) throw notFound("Image non trouvée");

      return prisma.image.update({
        where: { id: Number(id) },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.url !== undefined && { url: input.url }),
          ...(input.width !== undefined && { width: input.width }),
          ...(input.height !== undefined && { height: input.height }),
          ...(input.type !== undefined && { type: input.type }),
          ...(input.categoryId !== undefined && { categoryId: Number(input.categoryId) }),
        },
      });
    },

    async deleteImage(_parent, { id }) {
      const existing = await prisma.image.findUnique({ where: { id: Number(id) } });
      if (!existing) throw notFound("Image non trouvée");

      await prisma.image.delete({ where: { id: Number(id) } });
      return true;
    },

    async createCategory(_parent, { name, slug }) {
      const existing = await prisma.category.findFirst({
        where: { OR: [{ name }, { slug }] },
      });
      if (existing) throw badRequest("Catégorie déjà existante (name ou slug pris)");

      return prisma.category.create({ data: { name, slug } });
    },
  },

  // Champs calculés / relations : GraphQL Yoga+Prisma exigent de résoudre
  // la relation "category" sur Image nous-mêmes (pas d'include automatique)
  Image: {
    async category(parent) {
      return prisma.category.findUnique({ where: { id: parent.categoryId } });
    },
    createdAt(parent) {
      return parent.createdAt.toISOString();
    },
    updatedAt(parent) {
      return parent.updatedAt.toISOString();
    },
  },

  Category: {
    createdAt(parent) {
      return parent.createdAt.toISOString();
    },
  },
};

module.exports = resolvers;
