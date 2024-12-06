import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const laporanPenggunaanBarang = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, groupBy, category } = req.body;

    // Validasi parameter tanggal
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: false,
        message: "Tanggal mulai dan tanggal selesai harus diisi.",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ambil data peminjaman berdasarkan rentang tanggal
    const requests = await prisma.request.findMany({
      where: {
        borrowDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        item: true, // Mendapatkan detail barang
        user: true, // Mendapatkan detail peminjam
      },
    });

    let laporan = requests;

    // Filter berdasarkan kategori (jika ada)
    if (category) {
      laporan = laporan.filter((request) => request.item.category === category);

      if (laporan.length === 0) {
        return res.status(404).json({
          status: true,
          message: `Tidak ada data yang sesuai dengan kategori '${category}' yang diminta.`,
          data: [],
        });
      }
    }

    // Filter berdasarkan lokasi (jika ada groupBy)
    if (groupBy) {
      laporan = laporan.filter((request) =>
        request.item.location.toLowerCase() === groupBy.toLowerCase()
      );

      if (laporan.length === 0) {
        return res.status(404).json({
          status: true,
          message: `Tidak ada data yang sesuai dengan lokasi '${groupBy}' yang diminta.`,
          data: [],
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: "Laporan penggunaan barang berhasil.",
      data: laporan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: `Error: ${error instanceof Error ? error.message : error}`,
    });
  }
};
