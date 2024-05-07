const jwt = require('jsonwebtoken');

const secretCreator = require("../crypto/config");
const hashedSecret = secretCreator();

const createSession= ()=>{
    return{
      secret: hashedSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // (false) HTTP - true HTTPS
    }
}


function generateToken(user) {
    return jwt.sign({ user: user.id }, hashedSecret, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, hashedSecret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'Token inválido', error: err.message });
    }

    req.user = decoded.user;
    next();
  });
}


module.exports={createSession,generateToken,verifyToken};