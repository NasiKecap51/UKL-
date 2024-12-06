import express from "express";
import {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  authentication,
} from "../controller/user";
import { verifyRole, verifyToken } from "../middleware/authorization";
import { verifyAuthentication } from "../middleware/userVal";

const router = express.Router();

router.get("/",verifyToken,verifyRole(["Admin","Peminjam"]),getAllUser);  // Access allowed to authenticated users
router.post("/",verifyToken,verifyRole(["Admin","Peminjam"]) ,createUser);  // Only Admin can create users
router.put("/:id",verifyToken,verifyRole(["Admin","Peminjam"]), updateUser);  // Only Admin can edit users
router.delete("/:id",verifyToken,verifyRole(["Admin","Peminjam"]), deleteUser);  // Only Admin can delete users
router.post(`/login`,verifyAuthentication,authentication )

export default router;
