const models = require('../db/models');

class InventoryService {

  // Crear un nuevo artículo en el inventario
  async createItem(req) {
    const { name, quantity } = req.body;

    try {
      const newItem = await models.medical_supply.create({ name, quantity });
      return {
        status: 201,
        message: "Item created successfully",
        data: newItem,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error creating item",
        error: error.message,
      };
    }
  }

  // Obtener todos los artículos del inventario
  async getAllItems(req) {
    try {
        let items
      if (req?.params?.id !== 'all') {
        items = [await models.medical_supply.findByPk(req.params.id)];
      }else{
          items = await models.medical_supply.findAll();  
      }
      return {
        status: 200,
        data: items,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error fetching items",
        error: error.message,
      };
    }
  }

  // Actualizar un artículo del inventario
  async updateItem(req) {
    const { id } = req.params;
    const { name, quantity } = req.body;

    try {
      const item = await models.medical_supply.findByPk(id);
      if (!item) {
        return {
          status: 404,
          message: "Item not found",
        };
      }

      item.name = name;
      item.quantity = quantity;
      await item.save();

      return {
        status: 200,
        message: "Item updated successfully",
        data: item,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error updating item",
        error: error.message,
      };
    }
  }

  // Eliminar un artículo del inventario
  async deleteItem(req) {
    const { id } = req.params;

    try {
      const item = await models.medical_supply.findByPk(id);
      if (!item) {
        return {
          status: 404,
          message: "Item not found",
        };
      }

      await item.destroy();
      return {
        status: 200,
        message: "Item deleted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error deleting item",
        error: error.message,
      };
    }
  }
}

module.exports = InventoryService;