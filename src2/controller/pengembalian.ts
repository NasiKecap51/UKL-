import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const returnItem = async (req: Request, res: Response) => {
    try {
      // Destructure borrowId, returnDate from the request body
      const { borrowId, returnDate } = req.body;
  
      // Validate that borrowId and returnDate are provided
      if (!borrowId || !returnDate) {
        return res.status(400).json({
          status: false,
          message: "Both borrowId and returnDate are required.",
        });
      }
  
      // Find the borrowing record using the borrowId
      const peminjaman = await prisma.request.findUnique({
        where: { borrowId: Number(borrowId) },
        select: { status: true, itemId: true, borrowDate: true },
      });
  
      // If the borrowing record does not exist
      if (!peminjaman) {
        return res.status(404).json({
          status: false,
          message: `Peminjaman dengan ID ${borrowId} tidak ditemukan.`,
        });
      }
  
      // Check if the item has already been returned with the same borrowDate
      const existingReturn = await prisma.request.findFirst({
        where: {
          borrowId: Number(borrowId),
          status: "KEMBALI", // Ensure the item is already returned
        },
      });
  
      if (existingReturn) {
        return res.status(400).json({
          status: false,
          message: "Barang ini sudah dikembalikan sebelumnya dan tidak bisa dikembalikan lagi.",
        });
      }
  
      // If the item is already returned
      if (peminjaman.status === "Barang Sudah Dikembalikan!!!") {
        return res.status(400).json({
          status: false,
          message: "Barang sudah dikembalikan dan tidak bisa dikembalikan lagi.",
        });
      }
  
      // Update the request with the returnDate and mark the status as "KEMBALI"
      const updatedPeminjaman = await prisma.request.update({
        where: { borrowId: Number(borrowId) },
        data: {
          returnDate: new Date(returnDate),
          status: "KEMBALI", // Mark as returned
        },
        include: {
          user: true,
          item: true,
        },
      });
  
      // Update the item quantity when it is returned (increment by 1)
      await prisma.items.update({
        where: { id_item: Number(peminjaman.itemId) },
        data: {
          quantity: {
            increment: 1, // Item quantity increased by 1
          },
        },
      });
  
      return res.status(200).json({
        status: true,
        data: updatedPeminjaman,
        message: "Pengembalian item berhasil dicatat.",
      });
    } catch (error) {
      console.error("Error while processing return: ", error);
      return res.status(400).json({
        status: false,
        message: `Terjadi kesalahan: ${error}`,
      });
    }
  };
  