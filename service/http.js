const http = {
  notFound(req, res) {
    res.status(404).send({
      "status": false,
      "message": "無此網路路由"
    });
    res.end();
  }
}

module.exports = http;