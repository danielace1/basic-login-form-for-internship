import createHttpError from "http-errors";

export const requiresAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};
