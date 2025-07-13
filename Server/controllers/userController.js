import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `userController error: ${error.message}`,
    });
  }
};
