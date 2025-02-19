const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const userSchema = require("../models/usersSchema");

const signUp = asyncHandler(async (req, res, next) => {
  const user = await userSchema.create({
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPITRE,
  });

  res.status(200).json({ status: "success", data: user, token: token });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await userSchema.findOne({ email: username });

  if (!user) {
    //|| !(await bcrypt.compare(password, user.password))
    return next(new ApiError(`Email or Password incorrect`, 404));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPITRE,
  });

  res.status(200).json({ data: user, token: token });
});

const protect = asyncHandler(async (req, res, next) => {
  // Check if token exist and get it if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route",
        401
      )
    );
  }

  // Decode token => //2 Verify token (no change happened, expired token)
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user exist based on the last step
  const currentUser = await userSchema.findById(decode.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        `The user that belong to this token does no longer exist`,
        401
      )
    );
  }

  // Check if user changed his password after generate token
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passChangedTimestamp > decode.iat) {
      return next(
        new ApiError(
          `This user changed his password recently, please login again..`,
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(`You cann't access this route`));
    }
    next();
  });

module.exports = {
  signUp,
  login,
  protect,
  allowedTo,
};
