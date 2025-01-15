import dbConnect from "@/connection/db.connect";
import UserModel from "@/modal/userModal";

export async function POST(request: Request) {
  await dbConnect();
  try {
  } catch (error) {}
}
