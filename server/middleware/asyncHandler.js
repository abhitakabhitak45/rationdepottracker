// Lets route handlers use async/await without try/catch in every route.
// Any thrown error is passed to the global error handler.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
