const handleSuccess = (res, message, data) => {
  res.send({
    "status": "success",
    "message": message,
    "data": data
  });
  res.end();
}

module.exports = handleSuccess;