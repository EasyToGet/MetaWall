const handle = {
  successHandle(res, message, data) {
    res.send({
      "status": "success",
      "message": message,
      "data": data
    });
    res.end();
  },
  errorHandle(res, message) {
    res.status(400).send({
      "status": "false",
      "message": message
    })
    res.end();
  }
}

module.exports = handle;