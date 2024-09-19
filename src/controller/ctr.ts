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

export const createMenu = async ( request: Request, response: Response) => {
    try {
     const { name, price, category, description } = request.body
     const uuid = uuidv4()

     const newMenu = await prisma.menu.create({
        data: { uuid, name, price: Number(price), category, description}
     })

     return response.json({
        status: true,
        data:newMenu,
        message: `New menu has created`
    }).status(200)
} catch (error) {
    return response
        .json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}


