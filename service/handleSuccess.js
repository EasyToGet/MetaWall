const handleSuccess = (res, message, data) => {
  res.status(200).send({
    "status": "success",
    "message": message,
    "data": data
  });
  res.end();
}

module.exports = handleSuccess;