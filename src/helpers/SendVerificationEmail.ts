import { Resend } from "resend";
import VerificationEmail from "../../emails/VerifictionEmail";
const resend = new Resend(process.env.NEXT_PUBLIC_RESENT_API_KEY);
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry Message | Verification Code",
      react: VerificationEmail({ username: userName, otp: verifyCode }),
    });
    return { success: true, message: " Verification email send Successfully" };
  } catch (error) {
    console.error("Error Sending Verification email", error);
    return { success: false, message: "Failed to send Verification email" };
  }
}
