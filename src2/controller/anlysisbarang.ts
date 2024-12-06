import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analisisBarang = async (request: Request, response: Response) => {
    try {
        const { start_date, end_date } = request.body;

        // Validasi format tanggal
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Validasi tanggal
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return response.status(400).json({
                status: "failed",
                message: "Tanggal yang dimasukkan tidak valid.",
            });
        }

        if (startDate > endDate) {
            return response.status(400).json({
                status: "failed",
                message: "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
            });
        }

        // Mendapatkan barang yang paling sering dipinjam
        const frequentlyBorrowedItems = await prisma.request.groupBy({
            by: ['itemId'],
            where: {
                borrowDate: {
                    gte: startDate,
                },
                returnDate: {
                    lte: endDate,
                },
            },
            _count: {
                itemId: true,
            },
            orderBy: {
                _count: {
                    itemId: 'desc',
                },
            },
        });

        const frequentlyBorrowedItemDetails = await Promise.all(
            frequentlyBorrowedItems.map(async (item) => {
                const barang = await prisma.items.findUnique({
                    where: { id_item: item.itemId },
                    select: { id_item: true, item_name: true, category: true },
                });

                return barang ? {
                    idBarang: item.itemId,
                    name: barang.item_name,
                    category: barang.category,
                    total_borrowed: item._count.itemId,
                } : null;
            })
        ).then(results => results.filter(item => item !== null));

        // Mendapatkan barang yang telat pengembalian
        const inefficientItems = await prisma.request.groupBy({
            by: ['itemId'],
            where: {
                borrowDate: {
                    gte: startDate,
                },
                actualReturnDate: {
                    gt: endDate, // Pengembalian lebih dari tanggal akhir
                },
            },
            _count: {
                itemId: true,
            },
        });

        // Menghitung total late returns
        const inefficientItemDetails = await Promise.all(
            inefficientItems.map(async (item) => {
                const lateCount = await prisma.request.count({
                    where: {
                        itemId: item.itemId,
                        actualReturnDate: {
                            gt: endDate, // Pengembalian telat
                        },
                    },
                });

                const barang = await prisma.items.findUnique({
                    where: { id_item: item.itemId },
                    select: { id_item: true, item_name: true, category: true },
                });

                return barang ? {
                    idBarang: item.itemId,
                    name: barang.item_name,
                    category: barang.category,
                    total_borrowed: item._count.itemId,
                    total_late_returns: lateCount, // Jumlah keterlambatan
                } : null;
            })
        ).then(results => results.filter(item => item !== null));

        // Mengembalikan respons sukses
        return response.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date: start_date,
                    end_date: end_date,
                },
                frequently_borrowed_items: frequentlyBorrowedItemDetails,
                inefficient_items: inefficientItemDetails,
            },
            message: "Analisis barang berhasil dihasilkan.",
        });

    } catch (error) {
        // Menangani kesalahan
        return response.status(500).json({
            status: "failed",
            message: `Terdapat sebuah kesalahan: ${error}`,
        });
    }
};
