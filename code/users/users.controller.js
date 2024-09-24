const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const UsersService = require("./users.service");

class UsersController {
    static register(req, res, next){
        new UsersService()
        .register(req)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static auth(req, res, next){
        new UsersService()
        .authenticate(req)
        .then((data) => {
          res.status(data.status).json(data);
        })
        .catch(next);
    }

}

module.exports = UsersController