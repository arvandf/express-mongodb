import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Connection } from "./connection";
import ItemDAO from "../dao/itemDao";
import { Request, Response } from "express";
import Item from "../model/item";
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const format = require("util").format;

export interface IItemService {
  uploadData(request: Request, response: Response, next: any);
  findByTicker(request: Request, response: Response);
}

@injectable()
export class ItemService implements IItemService {
  @inject("connection")
  private connection: Connection;

  public uploadData = (req, res) => {
    console.log("uploadData Service Called");
    try {
      const form = new formidable.IncomingForm();

      form.parse(req, function (err, fields, files) {
        const items = [];
        const lines = fs
          .readFileSync(files.upload.path, "utf8")
          .toString()
          .split("\n");
        lines.forEach((line, index) => {
          if (index < 1) return; // skip headers
          const values = line.split(",");
          const item = new Item({
            quarter: values[0],
            stock: values[1],
            date: new Date(values[2]),
            open: values[3].substring(1),
            high: values[4].substring(1),
            low: values[5].substring(1),
            close: values[6].substring(1),
            volume: values[7],
          });
          items.push(item);

          let itemDAO = new ItemDAO();
          itemDAO.model
            .insertMany(items, { ordered: false })
            .then(function () {
              console.log("Data inserted");
              res.status(200).json();
            })
            .catch(function (error) {
              throw error;
            });
        });
      });
    } catch (error) {
      res.sendStatus(400);
      return console.error(error);
    }
  };

  public findByTicker = (request, response) => {
    console.log("findByTicker Service Called");

    let itemDAO = new ItemDAO();

    //build query object
    let criteria = {
      $and: [{ stock: request.query.ticker }],
    };

    if (request.query.findByTicker == "all") {
      criteria.$and.pop();
    }

    itemDAO.model.find(criteria, (error: Error, obj) => {
      if (error) {
        return console.error(error);
      }
      response.json(obj);
    });
  };
}
