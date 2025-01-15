import dbConnect from "@/connection/db.connect";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";
import UserModel from "@/modal/userModal";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();
    console.log("userName, email, password", userName, email, password);

    const existingVerifiedUsername = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existingVerifiedUsername) {
      return Response.json(
        { success: false, message: "UserName is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existingUserByEmail) {
      if (existingUserByEmail?.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        userName,
        userEmail: email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        Message: [],
      });

      await newUser.save();
    }

    //send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error While Registering User ", error);

    return Response.json(
      { success: false, message: "Error Registering User" },
      { status: 400 }
    );
  }
}
