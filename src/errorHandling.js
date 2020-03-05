function handleExpressError(error, req, res, next) {
  // in the future, the response format should be in the format
  // the requester wants (html/json/xml, etc)
  console.error(error)
  res.status(500).json({ error: error.stack });
}

module.exports = { handleExpressError };
