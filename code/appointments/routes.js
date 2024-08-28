const express = require('express');
const router = express.Router();
const AppointmentController =  require('./appointment.controller')

router.post('/register', AppointmentController.register);
router.put('/update', AppointmentController.update);
router.get('/getAll', AppointmentController.getAll);
router.delete('/delete', AppointmentController.delete);
router.get('/getOne', AppointmentController.getOne);


module.exports = router;