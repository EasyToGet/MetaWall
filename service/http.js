const http = {
  notFound(req, res, next) {
    res.status(404).send({
      "status": false,
      "message": "無此網路路由"
    });
    res.end();
    next();
  }
}

module.exports = http;