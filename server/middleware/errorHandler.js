// One place that turns every error into a consistent JSON response.
module.exports = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({ error: err.details.map((d) => d.message).join(', ') });
  }
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ error: `Already exists: ${fields}` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
};
