import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import fs from "fs";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mendapatkan semua pengguna
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const allUsers = await prisma.user.findMany({
      where: {
        nama: { contains: search?.toString() || "" },
      },
    });

    return res.status(200).json({
      status: true,
      data: allUsers,
      message: "Users have been retrieved successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};
import crypto from 'crypto'; // Import crypto untuk hashing MD5

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, nama, role, nomorTLP } = req.body;

    let errors: string[] = []; // Array untuk menyimpan pesan kesalahan

    // Validasi email
    if (email && !isValidEmail(email)) {
      errors.push("Invalid email format. It must contain '@' and '.'");
    }

    // Validasi role
    const validRoles = ["Admin", "Peminjam"]; // Daftar role yang valid
    if (role && !validRoles.includes(role)) {
      errors.push(`Role must be one of the following: ${validRoles.join(', ')}`);
    }

    // Jika ada kesalahan, tampilkan semua kesalahan
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '), // Gabungkan pesan kesalahan
      });
    }

    // Cek apakah user dengan email sudah ada
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password menggunakan MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    // Membuat user baru
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Simpan password yang sudah di-hash
        nama,
        role,
        nomorTLP,
      },
    });

    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Fungsi untuk validasi email
function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
export const updateUser = async (request: Request, response: Response) => {
  try {
      const { id } = request.params
      const { nama, password, role, email, nomorTLP } = request.body

      const findUser = await prisma.user.findFirst({ where: { id_user: Number(id) } })
      if (!findUser) return response
          .status(200)
          .json({
              status: false,
              massage: 'User Tidak Terdaftar'
          })
      
          const existingUser = await prisma.user.findFirst({
              where: { nama },
          });
  
          if (existingUser) {
              return response.status(400).json({
                  status: false,
                  message: "Username sudah digunakan, silakan gunakan username lain",
           });
  }
      
          
      const updateUser = await prisma.user.update({
          data: {
              nama: nama || findUser.nama, //or untuk perubahan (kalau ada yang kiri dijalankan, misal tidak ada dijalankan yang kanan), //operasi tenary (sebelah kiri ? = kondisi (price) jika kondisinya true (:) false )
              password: password || findUser.password,
              role: role || findUser.role,
              email: email || findUser.email,
              nomorTLP: nomorTLP || findUser.nomorTLP
          },
          where: { id_user: Number(id) }
      })

      return response.json({
          status: true,
          data: updateUser,
          massage: 'Tidak Bisa Update'
      })

  } catch (error) {
      return response
          .json({
              status: false,
              massage: `Error ${error}`
          })
          .status(400)
  }
}

// Menghapus pengguna
export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    // Ensure id_user is a valid number
    const userId = Number(id);
    if (isNaN(userId)) {
      return response
        .status(400)
        .json({ status: false, message: "Invalid user ID." });
    }

    // Check if the user exists
    const findUser = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!findUser) {
      return response
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    // Delete the user from the database
    const deleteUser = await prisma.user.delete({
      where: { id_user: userId },
    });

    return response
      .status(200)
      .json({
        status: true,
        data: deleteUser,
        message: "User has been deleted successfully.",
      });
  } catch (error) {
    return response
      .status(500)
      .json({
        status: false,
        message: `There was an error: ${error}`,
      });
  }
};


// Autentikasi pengguna
export const authentication = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findFirst({
      where: { email, password: md5(password) },
    });

    if (!findUser) {
      return res.status(200).json({
        status: false,
        logged: false,
        message: "Email or password is invalid",
      });
    }

    const data = {
      id_user: findUser.id_user,
      nama: findUser.nama,
      email: findUser.email,
      role: findUser.role,
    };

    const token = sign(data, SECRET || "token");

    return res.status(200).json({
      status: true,
      logged: true,
      data,
      message: "Login Success",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};
