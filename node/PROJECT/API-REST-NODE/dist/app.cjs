"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"), 1);

// src/routes/transaction.ts
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
prisma.transactions.create;

// src/routes/transaction.ts
var import_crypto = require("crypto");

// src/middlewares/checkSessionIdExist.ts
function checkSessionIdExist(request, reply, next) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized"
    });
  }
  next();
}

// src/routes/transaction.ts
async function transactionRoutes(app2) {
  app2.get("/", { preHandler: [checkSessionIdExist] }, async (request, reply) => {
    const { sessionId } = request.cookies;
    const transactions = await prisma.transactions.findMany({
      where: {
        sessionId
      }
    });
    return reply.send({
      transactions
    });
  });
  app2.post("/", async (request, reply) => {
    const createTransactionsBodySchema = import_zod.z.object({
      title: import_zod.z.string(),
      amount: import_zod.z.number(),
      type: import_zod.z.enum(["credit", "debit"])
    });
    const { title, amount, type } = createTransactionsBodySchema.parse(request.body);
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_crypto.randomUUID)();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    const transaction = await prisma.transactions.create({
      data: {
        title,
        amount,
        type,
        sessionId
      }
    });
    return reply.status(201).send(transaction);
  });
  app2.get("/:id", { preHandler: [checkSessionIdExist] }, async (request, reply) => {
    const { sessionId } = request.cookies;
    const getTransactionsParamsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const { id } = getTransactionsParamsSchema.parse(request.params);
    const transaction = await prisma.transactions.findUnique({
      where: { id, sessionId }
    });
    return {
      transaction
    };
  });
  app2.get("/summary", { preHandler: [checkSessionIdExist] }, async (request, reply) => {
    const { sessionId } = request.cookies;
    const summary = await prisma.transactions.aggregate({
      _sum: {
        amount: true
      },
      where: { sessionId }
    });
    return {
      summary: summary._sum
    };
  });
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"), 1);
var app = (0, import_fastify.default)({ logger: true });
app.register(import_cookie.default);
app.register(transactionRoutes, {
  prefix: "transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
