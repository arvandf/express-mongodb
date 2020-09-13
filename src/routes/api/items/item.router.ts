import { inject, injectable } from "inversify";
import ItemDAO from "../../../dao/itemDao";
import { IItemService } from "../../../services/item.service";
import { Router, Request, Response } from "express";

export interface IItemRouter {
  getRouter(): Router;
}

@injectable()
export class ItemRouter implements IItemRouter {
  @inject("itemService")
  private itemService: IItemService;

  public getRouter(): Router {
    let router = Router();
    let itemDAO = new ItemDAO();

    // Dao Routes
    router.route("/").get(itemDAO.getAll);
    router.route("/count").get(itemDAO.count);
    router.route("/item").post(itemDAO.insert);
    router.route("/item/:id").get(itemDAO.get);
    router.route("/item/:id").put(itemDAO.update);

    //Service Routes

    router.route("/uploadData").post(this.itemService.uploadData);
    router.route("/findByTicker").get(this.itemService.findByTicker);

    router.delete("/item/:id", (request: Request, response: Response) => {
      itemDAO.delete(request, response);
    });
    return router;
  }
}
