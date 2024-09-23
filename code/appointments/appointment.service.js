const { Op } = require('sequelize');
const moment = require('moment');
require('moment/locale/es'); // Importar la localización en español
const models = require('../db/models');

class AppointmentService {
    // Crear un nuevo appointment
    async createAppointment(req) {
        const { date, startTime } = req.body;
        const { email } = req.auth;
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
        const { id } = req.query;
        const { date, startTime } = req.body;
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

    async getHorary(req) {
        try {
            // Consultar todos los registros de la tabla Horary
            const horaries = await models.Horary.findAll();

            // Consultar las citas agendadas para la semana actual
            const today = moment().tz('America/Bogota').startOf('day').toDate();
            const nextWeek = moment().tz('America/Bogota').add(7, 'days').endOf('day').toDate();

            const appointments = await models.tbl_appointments.findAll({
                where: {
                    date: {
                        [Op.between]: [today, nextWeek],
                    },
                },
            });

            // Función para generar intervalos de una hora
            const generateIntervals = (startTime, endTime) => {
                const intervals = [];
                let [startHours, startMinutes] = startTime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);

                while (startHours < endHours || (startHours === endHours && startMinutes < endMinutes)) {
                    const nextHour = (startHours + 1) % 24;
                    intervals.push(`${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}:00`);
                    startHours = nextHour;
                }

                return intervals;
            };

            // Agrupar los intervalos por día de la semana
            const groupedIntervals = horaries.reduce((acc, horary) => {
                const { diaSemana, horaInicio, horaFin } = horary;
                const intervals = generateIntervals(horaInicio, horaFin);

                if (!acc[diaSemana]) {
                    acc[diaSemana] = {};
                }

                intervals.forEach(interval => {
                    acc[diaSemana][interval] = {
                        hora: interval,
                        disponible: true,
                        idCita: null
                    };
                });

                return acc;
            }, {});

            // Filtrar los intervalos ocupados por citas agendadas
            appointments.forEach(appointment => {
                const appointmentDateTime = moment.tz(`${appointment.date} ${appointment.start_time}`, 'YYYY-MM-DD HH:mm:ss', 'America/Bogota');
                let appointmentDay = appointmentDateTime.locale('es').format('dddd'); // Obtener el día de la semana en español
                appointmentDay = this.removeAccents(appointmentDay); // Eliminar tildes
                const startTime = appointmentDateTime.format('HH:mm:ss');

                if (groupedIntervals[appointmentDay] && groupedIntervals[appointmentDay][startTime]) {
                    groupedIntervals[appointmentDay][startTime].disponible = false;
                    groupedIntervals[appointmentDay][startTime].idCita = appointment.id;
                }
            });

            return {
                status: 200,
                data: groupedIntervals,
            };
        } catch (error) {
            return {
                status: 500,
                message: "Error al obtener los horarios disponibles",
                error: error.message,
            };
        }
    }
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    async addHorary(req) {
        const { diaSemana, horaInicio, horaFin } = req.body;

        try {
            // Buscar si ya existe un horario para el día de la semana dado
            let horary = await models.Horary.findOne({ where: { diaSemana } });

            if (horary) {
                // Si existe, actualizar el horario
                horary.horaInicio = horaInicio;
                horary.horaFin = horaFin;
                await horary.save();
                return {
                    status: 200,
                    message: "Horario actualizado exitosamente",
                    data: horary,
                };
            } else {
                // Si no existe, crear un nuevo horario
                horary = await models.Horary.create({ diaSemana, horaInicio, horaFin });
                return {
                    status: 201,
                    message: "Horario creado exitosamente",
                    data: horary,
                };
            }
        } catch (error) {
            return {
                status: 500,
                message: "Error al agregar o actualizar el horario",
                error: error.message,
            };
        }
    }
}

module.exports = AppointmentService;