module.exports = {
  index: (req, res) => {
    var ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    return res.status(200).json({ error: false, message: "Welcome to backend application 2.", ip: ip })
  }
}
