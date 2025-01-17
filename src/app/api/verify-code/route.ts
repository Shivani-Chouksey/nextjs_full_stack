import dbConnect from "@/connection/db.connect";
import UserModel from "@/modal/userModal";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, verifyCode } = await request.json();
    const decodedUserName = decodeURIComponent(userName);

    const user = await UserModel.findOne({ userName: decodedUserName });
    if (!user) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 400 }
      );
    }

    const isCodeVerfied = user.verifyCode === verifyCode;
    const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpiry && isCodeVerfied) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account Verify SuccessFully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpiry) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code Has Expired please singup again to get a code",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect Verification code" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error Verifying User", error);

    return Response.json(
      { success: false, message: "Error Verify User" },
      { status: 500 }
    );
  }
}
