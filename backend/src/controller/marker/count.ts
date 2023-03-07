import { RequestHandler } from "express";
import { prisma } from "../../db/client.js";

export const handler: RequestHandler = async (req, res) => {
  const count = await prisma.marker.count();
  res.json({ count });
};
