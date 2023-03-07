import { RequestHandler } from "express";
import { check, oneOf, matchedData, ValidationChain } from "express-validator";
import { Prisma } from "../../../prisma/generated/db/index.js";
import { prisma } from "../../db/client.js";
import { logger } from "../../common/logger.js";
import { MarkerSearch } from "types/data/marker.js";

/**
 * 1件取得用バリデーションルール
 */
export const validations = [
  // IDは必須
  check("id").isAlphanumeric().exists(),
] as ValidationChain[];

/**
 * 検索
 * @param req
 * @param res
 */
export const handler: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  // 検索
  const found = await prisma.marker.findUniqueOrThrow({
    where: { id },
  });

  // 後処理
  const resultJSON = JSON.stringify(found);
  logger.debug(`Marker found (${resultJSON})`);
  res.json(found);
};

/**
 * 検索用バリデーションルール
 */
export const searchChecks = [
  oneOf([
    check("id").isArray().exists(),
    check("comment").exists(),
    check("lat").exists(),
    check("lng").exists(),
  ]),
] as ValidationChain[];

/**
 * 検索
 * @param req
 * @param res
 */
export const searchMany: RequestHandler = async (req, res) => {
  const condition = matchedData(req) as MarkerSearch;

  // 検索AND条件
  const where = {} as Prisma.MarkerWhereInput;
  if (condition.id) {
    where.id = {
      in: condition.id,
    };
  }
  if (condition.comment) {
    where.comment = {
      comment: {
        contains: condition.comment,
      },
    };
  }
  if (condition.lat) {
    where.lat = {
      gte: condition.lat.from,
      lte: condition.lat.to,
    };
  }
  if (condition.lng) {
    where.lng = {
      gte: condition.lng.from,
      lte: condition.lng.to,
    };
  }

  // 条件に従って検索、commentを含む
  const found = await prisma.marker.findMany({
    where,
    include: {
      comment: true,
    },
  });

  // 後処理
  logger.debug(`Marker found (${JSON.stringify(found)})`);
  res.json(found);
};
