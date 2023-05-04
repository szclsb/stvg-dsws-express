import {Config} from "./config";
import {NextFunction, Request, RequestHandler, Response} from "express-serve-static-core";


export function checkApiKey(config: Config): RequestHandler {
  return (req, res, next) => {
      const token = req.get(config.apiKeyHeader);
      if (token === undefined) {
          res.status(401).send();
      } else if (config.apiKey === token) {
          next();
      } else {
          res.status(403).send();
      }
  };
}
