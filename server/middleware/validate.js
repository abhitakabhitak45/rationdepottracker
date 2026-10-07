// Validates req.body against a Joi schema before the route runs.
module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) return next(error);
  req.body = value;
  next();
};
