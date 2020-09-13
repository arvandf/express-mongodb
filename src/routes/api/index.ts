import { Router } from "express";
import { IItemRouter } from "./items/item.router";
import { inject, injectable } from "inversify";
import "reflect-metadata";

export interface IApi {
  getRouter(): Router;
}

@injectable()
export class Api implements IApi {
  @inject("itemRouter")
  private itemRouter: IItemRouter;

  public getRouter(): Router {
    let router = Router();

    // split up route handling
    router.use("/items", this.itemRouter.getRouter());

    router.use("/", (msg: any, res: any, next) => {
      res.send({
        message: "I am a server route and can also be hot reloaded!",
      });
      next();
    });

    // error handlers
    // Catch unauthorised errors
    router.use((err: any, req, res: any, next) => {
      if (err.name === "UnauthorizedError") {
        res.status(401);
        res.json({ message: err.name + ": " + err.message });
      }
      next();
    });

    return router;
  }
}
