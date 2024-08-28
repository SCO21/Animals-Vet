const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const models = require('../db/models');
const { dbConfig } = require('../_config/config');

// Datos de conexion base de datos
const host = dbConfig.host;
const port = dbConfig.port;
const password = dbConfig.password;
const database = dbConfig.database;
const user = dbConfig.user;

module.exports = router.head('/sync', async function (_req, res) {
    await initialize();
    res.json()
})
// initialize();
async function initialize() {
    const connection = mysql.createPool({ host: host, port: port, user: user, password: password, database: database }); //Conexion para crear tablas
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`); //Creacion de base de datos si no existe
    //Conexion dinamica sequelize (Mejora para rendimiento con Lambda Functions)
    await models.sequelize.sync({ alter: true });
}
