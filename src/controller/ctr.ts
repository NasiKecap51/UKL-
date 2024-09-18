import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allMenus = await prisma.menu.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })

        return res.status(200).json({ //output
            status: true,
            data: allMenus,
            message: 'Menus have been retrieved'
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: `Error: ${error}`
        });
    }
}
