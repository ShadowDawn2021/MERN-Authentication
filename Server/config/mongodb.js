import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/mern-authentication`
    );
    console.log("Database connection Successful");
  } catch (error) {
    console.log(`Connection to the database failed. Error Code: ${error}`);
  }
};

export default connectDB;
