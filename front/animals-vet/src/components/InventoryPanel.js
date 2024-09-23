import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InventoryPanel.css';
import Swal from 'sweetalert2';


const InventoryPanel = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  // Función para obtener todos los items
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:4000/inventory/items/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setItems(result.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  // Función para crear o actualizar un item
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingItemId
      ? `http://localhost:4000/inventory/items/${editingItemId}`
      : 'http://localhost:4000/inventory/items';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Error saving item');
      }

      await response.json();
      setForm({ name: '', quantity: '' });
      setEditingItemId(null);
      fetchItems(); // Refrescar la lista de items

      // SweetAlert2: Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: editingItemId ? 'Item actualizado correctamente' : 'Item creado correctamente',
        text: `El item "${form.name}" ha sido ${editingItemId ? 'actualizado' : 'creado'} con éxito.`,
        confirmButtonText: 'OK'
      });

    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar el item.',
        confirmButtonText: 'OK'
      });
    }
  };

  // Función para eliminar un item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/inventory/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting item');
      }

      fetchItems(); // Refrescar la lista de items

      // SweetAlert2: Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Item eliminado',
        text: 'El item ha sido eliminado con éxito.',
        confirmButtonText: 'OK'
      });

    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al eliminar el item.',
        confirmButtonText: 'OK'
      });
    }
  };

  // Función para cargar datos de un item en el formulario para editar
  const handleEdit = (item) => {
    setForm({ name: item.name, quantity: item.quantity });
    setEditingItemId(item.id);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="inventory-container">
      <h1>Panel de Control de Inventario</h1>

      <form onSubmit={handleSubmit}>
        <h2>{editingItemId ? 'Actualizar Item' : 'Crear Nuevo Item'}</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Nombre del Item</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </div>
        <button type="submit">{editingItemId ? 'Actualizar' : 'Crear'}</button>
        {editingItemId && (
          <button onClick={() => { setForm({ name: '', quantity: '' }); setEditingItemId(null); }}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista de Items</h2>
      {items.length === 0 ? (
        <p>No hay items en el inventario.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name} - Cantidad: {item.quantity}</span>
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Eliminar</button>

              
            </li>
          ))}
        </ul>
        
      )}
      <button onClick={() => navigate('/main-menu')}>Volver al Menú Principal</button>
    </div>
  );
};

export default InventoryPanel;
