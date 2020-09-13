import { Double } from "mongodb";
import * as mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  quarter: Number,
  stock: String,
  date: Date,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
