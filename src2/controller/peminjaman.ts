import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { date } from "joi";

const prisma = new PrismaClient();

// Create a new borrow request
export const createBorrowRequest = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, borrowDate, returnDate } = req.body;

    console.log(`Checking if item with id ${itemId} exists...`);

    // Check if the item exists in the database
    const itemExists = await prisma.items.findUnique({
      where: { id_item: Number(itemId) },
    });

    console.log(itemExists);  // Log the result of the item query

    if (!itemExists) {
      return res.status(400).json({
        success: false,
        message: `Item with id ${itemId} does not exist.`,
      });
    }

    // Convert borrowDate and returnDate to Date objects
    const borrowDateObj = new Date(borrowDate);
    const returnDateObj = new Date(returnDate);

    // Validate that returnDate is not earlier than borrowDate
    if (returnDateObj < borrowDateObj) {
      return res.status(400).json({
        success: false,
        message: "Return date cannot be earlier than borrow date.",
      });
    }

    const newRequest = await prisma.request.create({
      data: {
        userId: Number(userId),
        itemId: Number(itemId),
        borrowDate: borrowDateObj,
        returnDate: returnDateObj,
      },
    });

    res.status(201).json({
      success: true,
      message: "Request successfully created",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create request",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

  

// Get all borrow requests
export const getAllBorrowRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.request.findMany({
      include: {
        user: true,
        item: true,
      },
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  const { borrowId, returnDate, actualReturnDate, status } = req.body; // borrowId diambil dari body

  try {
      // Ensure that the borrowId is provided in the body
      if (!borrowId) {
          return res.status(400).json({
              success: false,
              message: 'borrowId is required in the body',
          });
      }

      // Check if the record with the provided borrowId exists
      const existingRequest = await prisma.request.findUnique({
          where: { borrowId: Number(borrowId) },  // Assuming 'borrowId' is the field in the database
      });

      // If the record doesn't exist, return an error message
      if (!existingRequest) {
          return res.status(404).json({
              success: false,
              message: 'Record not found',
          });
      }

      // Check if the item has already been returned
      if (existingRequest.status === "Kembali") {
          return res.status(400).json({
              success: false,
              message: `Barang sudah dikembalikan dan tidak bisa diperbarui lagi.${Error}`,
          });
      }

      // Proceed with the update if the record exists and the item is not yet returned
      const updatedRequest = await prisma.request.update({
          where: { borrowId: Number(borrowId) },  // Correct field name, assumed 'borrowId'
          data: {
              returnDate: returnDate || existingRequest.returnDate,  // Optional: fallback to existing value if not provided
              actualReturnDate: actualReturnDate || new Date(),  // Always update with provided value
              status: status || existingRequest.status,  // Optional: fallback to existing value if not provided
          },
          include: {
              user: true,  // Include related user data
              item: true,  // Include related item data
          },
      });

      return res.status(200).json({
          success: true,
          message: 'Request updated successfully',
          data: updatedRequest,
      });
  } catch (error) {
      console.error(error);  // Log the error for debugging
      return res.status(500).json({
          success: false,
          message: 'Failed to update request',
          error: error instanceof Error ? error.message : 'Unknown error occurred', // Show error message if available
      });
  }
};




// Delete a borrow request
export const deleteBorrowRequest = async (req: Request, res: Response) => {
  try {
    const { borrowId } = req.params;

    await prisma.request.delete({
      where: {
        borrowId: Number(borrowId),
      },
    });

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get all borrow requests by user
export const getRequestsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userRequests = await prisma.request.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        item: true,
      },
    });

    res.status(200).json({
      success: true,
      data: userRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user's requests",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
