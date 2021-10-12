const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
  //  const token = req.header("Authorization");
  //console.log(token);
    if (!token)
      return res
        .status(401)
        .json({ errorMessage: "No authentication token, authorization denied." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(verified);
      if (!verified)
        return res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied." });
          
    req.user = verified.id;
    next();
      } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "Unauthorized"});
    }

};

module.exports = auth;
