const { User, Product } = require("../models");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
class userController {
  static Register(req, res, next) {
    User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      role: req.body.role
    })
      .then(user => {
        let token = jwt.sign(
          { email: user.email, id: user.id },
          process.env.JWT_SECRET
        );
        res.status(201).json({ token: token, id: user.id });
      })
      .catch(err => {
        if (err.message) {
          err.StatusCode = 400;
        }
        next(err);
      });
  }

  static Login(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
      where: {
        email: email
      }
    })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign(
              { email: user.email, id: user.id },
              process.env.JWT_SECRET
            );
            res
              .status(201)
              .json({ token: token, id: user.id, role: user.role });
          } else {
            let msg = {
              StatusCode: "404",
              message: "Username or password wrong"
            };
            res.status(401).json(msg);
          }
        } else {
          let msg = {
            StatusCode: "404",
            message: "command not found"
          };
          res.status(404).json(msg);
          // next(msg)
        }
      })
      .catch(err => {
        if (err.message) {
          err.StatusCode = 400;
        }
        next(err);
      });
  }

  static findUser(req, res, next) {
    console.log("masuk");
    console.log;
    User.findOne({
      where: { id: req.user.id },
      include: [Product]
    })
      .then(data => {
        if (data) {
          res.status(200).json(data);
        } else {
          let msg = {
            StatusCode: "404",
            message: "Username or password wrong"
          };
          res.status(401).json(msg);
        }
      })
      .catch(err => {
        if (err.message) {
          err.StatusCode = 400;
        }
        next(err);
      });
  }

  static googleLogin(req, res, next) {
    User.findOne({
      where: { email: req.payload.email }
    })
      .then(data => {
        if (!data) {
          return User.create({
            username: req.payload.given_name,
            name: req.payload.name,
            email: req.payload.email,
            password: "user"
          });
        } else {
          let token = jwt.sign(
            { email: data.email, id: data.id },
            process.env.secret_key
          );
          res.status(201).json({ token: token, id: data.id });
        }
      })
      .then(data => {
        // console.log(data)
        let token = jwt.sign(
          { email: data.email, id: data.id },
          process.env.secret_key
        );
        res.status(201).json({ token: token, id: data.id });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
}

module.exports = userController;
