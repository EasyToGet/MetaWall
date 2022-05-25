const handle = {
  errorHandle(res, message) {
    res.status(400).send({
      "status": "false",
      "message": message
    })
    res.end();
  }
}

module.exports = handle;