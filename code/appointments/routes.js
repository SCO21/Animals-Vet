const express = require('express');
const router = express.Router();
const AppointmentController =  require('./appointment.controller')
const validateRequest = require("../_middleware/validate-request");

router.post('/register', AppointmentController.register);
router.put('/update', AppointmentController.update);
router.get('/getAll', AppointmentController.getAll);
router.delete('/delete', AppointmentController.delete);
router.get('/getOne', AppointmentController.getOne);

// como veterinario o secretaria

router.get('/getHorary', AppointmentController.getHorary);
router.post('/addHorary', validateRequest(["Vet","Secretary"]), AppointmentController.addHorary);

module.exports = router;