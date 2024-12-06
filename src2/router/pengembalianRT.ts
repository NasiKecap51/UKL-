import express from "express";
import { updateRequest} from "../controller/peminjaman"
const router = express.Router();

// POST route to handle returning an item
router.post('/updateRequest/', updateRequest);

export default router;