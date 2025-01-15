import dbConnect from "@/connection/db.connect";
import UserModel from "@/modal/userModal";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zods
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log("result", result);
    if (!result.success) {
      const userNameErrors = result.error?.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      userName: username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "UserName Is Already Taken" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "UserName Is Available " },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error Checking Username", error);

    return Response.json(
      { success: false, message: "Error checking userName" },
      { status: 500 }
    );
  }
}
