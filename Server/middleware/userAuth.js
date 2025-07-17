import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User not authorized, please log in",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.id) {
      return res.json({
        success: false,
        message: "User not authorized, please log in",
      });
    }

    req.userId = decodedToken.id;
    return next();
  } catch (error) {
    return res.json({
      success: false,
      message: `userAuth Error: ${error.message}`,
    });
  }
};

export default userAuth;
