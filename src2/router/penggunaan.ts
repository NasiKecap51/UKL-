import express from "express";
import {
  laporanPenggunaanBarang,
} from "../controller/penggunaanbrg"; 

const router = express.Router();

// Route untuk laporan penggunaan barang
router.post("/", laporanPenggunaanBarang);


export default router;
