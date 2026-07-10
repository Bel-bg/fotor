const { PrismaClient } = require("@prisma/client");

// On évite de recréer plusieurs instances de PrismaClient
// (utile surtout en dev avec nodemon qui reload le process)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
