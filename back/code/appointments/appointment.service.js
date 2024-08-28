const models = require('../db/models');
const { Op } = require('sequelize');
const moment = require('moment');

class AppointmentService {

    // Crear un nuevo appointment
    async createAppointment(req) {
        const { date, startTime } = req.body
        const { email } = req.auth
        const endTime = this.calculateEndTime(startTime);

        const validDate = moment(date, 'YYYY-MM-DD', true);
        if (!validDate.isValid()) {
            return {
                status: 400,
                message: "Invalid date format. Please use YYYY-MM-DD.",
            };
        }

        // Verificar si ya existe un appointment en la misma fecha y hora
        const existingAppointment = await models.tbl_appointments.findOne({
            where: {
                email,
                date: validDate.format('YYYY-MM-DD'),
                start_time: startTime,
                end_time: endTime,
            },
        });

        if (existingAppointment) {
            return {
                status: 400,
                message: "An appointment is already scheduled at this time.",
            };
        }

        const appointment = await models.tbl_appointments.create({
            email,
            date,
            start_time: startTime,
            end_time: endTime,
        });

        return {
            status: 201,
            message: "Appointment created successfully",
            data: appointment,
        };
    }

    // Obtener un appointment por ID
    async getAppointmentById(id) {
        const appointment = await models.tbl_appointments.findByPk(id);

        if (!appointment) {
            return {
                status: 404,
                message: "Appointment not found",
            };
        }

        return {
            status: 200,
            data: appointment,
        };
    }

    // Obtener todos los appointments de un usuario
    async getAppointmentsByUser(email) {
        const appointments = await models.tbl_appointments.findAll({
            where: { email },
        });

        return {
            status: 200,
            data: appointments,
        };
    }

    // Actualizar un appointment
    async updateAppointment(req) {
        const {id} = req.query
        const { date, startTime } = req.body
        const appointment = await models.tbl_appointments.findByPk(id);

        if (!appointment) {
            return {
                status: 404,
                message: "Appointment not found",
            };
        }

        const endTime = this.calculateEndTime(startTime);

        // Verificar si ya existe un appointment en la misma fecha y hora
        const existingAppointment = await models.tbl_appointments.findOne({
            where: {
                email: appointment.email,
                date,
                start_time: startTime,
                end_time: endTime,
                id: { [Op.ne]: id }, // Excluir el appointment actual
            },
        });

        if (existingAppointment) {
            return {
                status: 400,
                message: "An appointment is already scheduled at this time.",
            };
        }

        appointment.date = date || appointment.date;
        appointment.start_time = startTime || appointment.start_time;
        appointment.end_time = endTime;

        await appointment.save();

        return {
            status: 200,
            message: "Appointment updated successfully",
            data: appointment,
        };
    }

    // Eliminar un appointment
    async deleteAppointment(id) {
        const appointment = await models.tbl_appointments.findByPk(id);

        if (!appointment) {
            return {
                status: 404,
                message: "Appointment not found",
            };
        }

        await appointment.destroy();

        return {
            status: 200,
            message: "Appointment deleted successfully",
        };
    }

    // Método para calcular la hora de fin (una hora después de startTime)
    calculateEndTime(startTime) {
        const [hours, minutes, seconds] = startTime.split(':').map(Number);
        const endHours = (hours + 1) % 24; // Asegurarse de que no exceda 24 horas
        return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
    }
}

module.exports = AppointmentService;
