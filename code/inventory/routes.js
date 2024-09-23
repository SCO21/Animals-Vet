const express = require('express');
const router = express.Router();
const validateRequest = require("../_middleware/validate-request");
const InventoryController = require('./inventory.controller');

// Crear un nuevo artículo
router.post('/items', validateRequest(["Vet","Secretary"]), InventoryController.create);

// Obtener todos los artículos
router.get('/items/:id', validateRequest(["Vet","Secretary"]), InventoryController.getAll);

// Actualizar un artículo
router.put('/items/:id', validateRequest(["Vet","Secretary"]), InventoryController.update);

// Eliminar un artículo
router.delete('/items/:id', validateRequest(["Vet","Secretary"]), InventoryController.delete);

module.exports = router;