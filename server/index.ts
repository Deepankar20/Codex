import express from "express";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5000;
// const prisma = new PrismaClient();
const app = express();

app.listen(PORT, () => {
  console.log(`App running on port : ${PORT}`);
});
