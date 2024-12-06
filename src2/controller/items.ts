
import { Request, Response } from "express";
import { Jenis, PrismaClient } from "@prisma/client"; // Import Prisma Client instance
import { BASE_URL, SECRET } from "../global"; 
import fs from "fs"; 
import md5 from "md5";
import { sign } from "jsonwebtoken";
import { number } from "joi";
import { error } from "console";


const prisma = new PrismaClient({errorFormat: "pretty"});


export const getAllItems = async (req: Request, res: Response) => {
  try {
    // Fetch all items from the database
    const items = await prisma.items.findMany({
      orderBy: { id_item: 'asc' }, // Mengurutkan berdasarkan id_item secara default
    });

    // Jika tidak ada item, kembalikan pesan yang relevan
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found",
      });
    }

    // Kembalikan respons dengan data item
    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    return res.status(500).json({
      success: false,
      message: "Error fetching items",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};



// Create a new item (Add)
export const createItem = async (req: Request, res: Response) => {
  try {
    const { item_name, category, location, quantity } = req.body;

    // Validate that all required fields are provided
    if (!item_name || !category || !location || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields (item_name, category, location, quantity) are required.",
      });
    }

    // Validate category field (must match Jenis enum)
    const validCategories = ["Elektronik", "AlatTulis", "PeralatanOlahraga", "YangLain"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Valid categories are: ${validCategories.join(", ")}`,
      });
    }

    // Ensure quantity is a valid number
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number.",
      });
    }

    // Create new item
    const newItem = await prisma.items.create({
      data: {
        item_name,
        category,
        quantity: Number(quantity),
        location,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error creating item: ${error}`,
    });
  }
};



export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Ambil ID item dari parameter URL
    const { item_name, category, location, quantity } = req.body; // Ambil field untuk di-update dari body

    // Pastikan ID item ada dan valid
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        status: false,
        message: "ID item tidak valid.",
      });
    }

    // Periksa apakah item ada di database
    const existingItem = await prisma.items.findUnique({
      where: { id_item: Number(id) }, // Gunakan 'id_item' sebagai field untuk pengecekan
    });

    // Jika item tidak ditemukan, kembalikan pesan error
    if (!existingItem) {
      return res.status(404).json({
        status: false,
        message: "Item tidak ditemukan.", // Tampilkan pesan item tidak ditemukan
      });
    }

    // Validasi kategori jika diberikan
    const validCategories = ["Elektronik", "AlatTulis", "PeralatanOlahraga", "YangLain"];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        status: false,
        message: `Kategori tidak valid. Kategori yang diperbolehkan: ${validCategories.join(", ")}`,
      });
    }

    // Validasi kuantitas jika diberikan
    if (quantity && (isNaN(Number(quantity)) || Number(quantity) <= 0)) {
      return res.status(400).json({
        status: false,
        message: "Jumlah harus berupa angka positif.",
      });
    }

    // Update item di database
    const updatedItem = await prisma.items.update({
      where: { id_item: Number(id) }, // Pastikan referensi field benar
      data: {
        item_name: item_name || existingItem.item_name, // Update nama jika diberikan
        category: category || existingItem.category, // Update kategori jika diberikan
        location: location || existingItem.location, // Update lokasi jika diberikan
        quantity: quantity ? Number(quantity) : existingItem.quantity, // Update jumlah jika diberikan
      },
    });

    // Kembalikan data item yang telah diperbarui
    return res.status(200).json({
      status: true,
      message: "Item berhasil diperbarui.",
      data: updatedItem,
    });
  } catch (error) {
    // Tangani error yang tidak terduga
    return res.status(500).json({
      status: false,
      message: `Terjadi kesalahan saat memperbarui item: ${error instanceof Error ? error.message : error}`,
    });
  }
};


// Delete an item (Remove)
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Ambil ID item dari parameter URL

    // Validasi bahwa idItem adalah angka
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        status: false,
        message: "ID item tidak valid. Harus berupa angka.",
      });
    }

    // Periksa apakah item ada di database
    const item = await prisma.items.findUnique({
      where: { id_item: Number(id) },
    });

    // Jika item tidak ditemukan, kembalikan error 404
    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Item TIDAK ADA",
      });
    }

    // Hapus item dari database
    await prisma.items.delete({
      where: { id_item: Number(id) },
    });

    // Kembalikan pesan sukses setelah penghapusan
    return res.status(200).json({
      status: true,
      message: "Item berhasil dihapus. Data sudah dihapus :)",
    });
  } catch (error) {
    // Tangani kesalahan jika ada
    return res.status(400).json({
      status: false,
      message: `Error deleting item: ${error instanceof Error ? error.message : error}`,
    });
  }
};



// Get item by ID (Retrieve by ID)
export const getItemById = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      // Validasi ID harus angka
      const itemId = parseInt(id);
      if (isNaN(itemId)) {
          return res.status(400).json({
              status: false,
              message: "Invalid item ID",
          });
      }

      const item = await prisma.items.findUnique({
          where: { id_item: itemId },
      });

      if (!item) {
          return res.status(404).json({
              status: false,
              message: "Item TIDAK ADA",
          });
      }

      return res.status(200).json({
          status: true,
          data: item,
          message: "SUKSES MENGAMBIL",
      });
  } catch (error) {
      return res.status(400).json({
          status: false,
          message: `Error retrieving item: ${error}`,
});
  }
};