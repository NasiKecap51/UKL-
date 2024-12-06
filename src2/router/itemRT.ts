import express from "express";
import {
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
} from "../controller/items";
import { verifyToken, verifyRole } from "../middleware/authorization";

const app = express.Router();


app.post("/", createItem); 
app.get("/:id", getItemById);
app.put("/:id",updateItem); 
app.delete("/:id",deleteItem); 
app.get("/", getAllItems)

export default app;
