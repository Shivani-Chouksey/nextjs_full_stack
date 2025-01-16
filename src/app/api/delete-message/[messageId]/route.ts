import dbConnect from "@/connection/db.connect";
import UserModel from "@/modal/userModal";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const messageID = params.messageId;

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { Messages: { _id: messageID } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message Not Found OR Already Deleted", success: false },
        { status: 404 }
      );
    }
    return Response.json(
      { message: "Message Deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
