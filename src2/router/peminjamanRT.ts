import { Router } from "express";
import { 
    createBorrowRequest,
    getAllBorrowRequests,
    updateRequest,
    deleteBorrowRequest,
    getRequestsByUser,
    // analyzeUsage,
    // analyzeItemEfficiency
} from "../controller/peminjaman"; // Pastikan controller sudah sesuai
import { verifyToken, verifyRole } from "../middleware/authorization";

const router = Router();

router.post("/",verifyToken,verifyRole(["Admin","Peminjam"]), createBorrowRequest);
router.get("/",verifyToken,verifyRole(["Admin"]), getAllBorrowRequests);
router.put("/update",verifyToken,verifyRole(["Admin"]), updateRequest);
router.delete("/:id",verifyToken,verifyRole(["Admin"]), deleteBorrowRequest);
router.get("/user/:userId",verifyToken,verifyRole(["Admin","Peminjam"]), getRequestsByUser);
// router.post("/usage-report", [verifyToken, verifyRole(["ADMIN"])], analyzeUsage);
// router.post("/borrow-analysis", [verifyToken, verifyRole(["ADMIN"])], analyzeItemEfficiency);

export default router;
