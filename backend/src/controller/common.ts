import { logger } from "../common/logger.js";
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ValidationChain, validationResult } from "express-validator";

/**
 * エラーログ出力
 */
// 第4引数までないとエラーハンドラとして認識されない
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorLog: ErrorRequestHandler = async (err, req, res, next) => {
  logger.error(`ERROR!(statusCode=${err.statusCode}) ${err.stack}`);
  throw err;
};

/**
 * アクセスログ出力
 */
export const accessLog: RequestHandler = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  logger.debug(` PARAMS:${JSON.stringify(req.params)}`);
  logger.debug(` BODY:${JSON.stringify(req.body)}`);
  next();
};

/**
 * 引数のバリデーションを全て実行し、異常の場合は400応答する
 * @param validations
 * @returns
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    logger.warn(`Validation Failed:${JSON.stringify(errors.array())}`);
    res.status(400).json({ errors: errors.array() });
  };
};
