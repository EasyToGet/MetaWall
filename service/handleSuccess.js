const handleSuccess = (res, statusCode, data) => {
  res.status(statusCode).send({
    "status": "success",
    "data": data
  });
  res.end();
}

module.exports = handleSuccess;