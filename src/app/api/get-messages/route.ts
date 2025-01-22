import dbConnect from "@/connection/db.connect";
import UserModel from "@/modal/userModal";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const _user = session?.user;
  console.log("user", _user);

  // Check if the user is authenticated
  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userID = new mongoose.Types.ObjectId(_user._id);

  try {
    const userResponse = await UserModel.aggregate([
      { $match: { _id: userID } },
      { $unwind: "$Messages" },
      { $sort: { "Messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$Messages" } } },
    ]).exec();

    if (!userResponse || userResponse.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: userResponse[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
