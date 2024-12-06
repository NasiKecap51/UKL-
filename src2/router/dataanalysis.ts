import express from 'express';
import { analisisBarang } from '../controller/anlysisbarang';

const router = express.Router();

// Route untuk analisis barang berdasarkan tanggal
router.post('/', analisisBarang);

export default router;
