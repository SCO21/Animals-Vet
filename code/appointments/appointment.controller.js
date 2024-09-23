const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const AppointmentService = require("./appointment.service");

class AppointmentController {
    static register(req, res, next){
        new AppointmentService()
        .createAppointment(req)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static update(req, res, next){
        new AppointmentService()
        .updateAppointment(req)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static getAll(req, res, next){
        new AppointmentService()
        .getAppointmentsByUser(req.auth.email)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static delete(req, res, next){
        new AppointmentService()
        .deleteAppointment(req.query.id)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static getOne(req, res, next){
        new AppointmentService()
        .getAppointmentById(req.query.id)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static getHorary(req, res, next){
        new AppointmentService()
        .getHorary(req)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
    static addHorary(req, res, next){
        new AppointmentService()
        .addHorary(req)
        .then((data) => {
          res.json(data);
        })
        .catch(next);
    }
}

module.exports = AppointmentController