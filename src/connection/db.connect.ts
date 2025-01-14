import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }
  try {
    console.log(
      "process.env.NEXT_PUBLIC_MONGO_CONNECT_URI ",
      process.env.NEXT_PUBLIC_MONGO_CONNECT_URI
    );

    const db = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGO_CONNECT_URI || "",
      {}
    );

    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DataBAse Connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
