const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const InventoryService = require("./inventory.service");

class InventoryController {
    static create(req, res, next) {
        new InventoryService()
            .createItem(req)
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    static update(req, res, next) {
        new InventoryService()
            .updateItem(req)
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    static getAll(req, res, next) {
        new InventoryService()
            .getAllItems(req)
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    static delete(req, res, next) {
        new InventoryService()
            .deleteItem(req)
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }
}

module.exports = InventoryController;