const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createYoga, createSchema } = require("graphql-yoga");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/graphql",
  // Interface graphiql accessible directement sur /graphql dans le navigateur
  // En dev, on désactive le masking pour voir le vrai message d'erreur dans GraphiQL.
  // À NE PAS faire en production (ça fuite les détails internes).
  maskedErrors: process.env.NODE_ENV === "production",
});

app.use(yoga.graphqlEndpoint, yoga);

module.exports = app;
