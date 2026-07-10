// Script de seed : crée des catégories + des images de démo (URLs picsum.photos)
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Nature", slug: "nature" },
  { name: "Architecture", slug: "architecture" },
  { name: "Mode", slug: "mode" },
  { name: "Nourriture", slug: "nourriture" },
  { name: "Voyage", slug: "voyage" },
  { name: "Art", slug: "art" },
];

const TYPES = ["photo", "illustration", "gif"];

async function main() {
  console.log("🌱 Seed en cours...");

  const createdCategories = [];
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
  }

  // 120 images de démo réparties aléatoirement dans les catégories/types
  const imagesData = Array.from({ length: 120 }, (_, i) => {
    const category = createdCategories[i % createdCategories.length];
    const type = TYPES[i % TYPES.length];
    const width = 400 + (i % 5) * 50;
    const height = 500 + (i % 7) * 40;

    return {
      title: `${category.name} #${i + 1}`,
      description: `Image de démo pour la catégorie ${category.name}`,
      url: `https://picsum.photos/seed/fotor-${i}/${width}/${height}`,
      width,
      height,
      type,
      categoryId: category.id,
    };
  });

  await prisma.image.createMany({ data: imagesData });

  console.log(`✅ ${createdCategories.length} catégories et ${imagesData.length} images créées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
