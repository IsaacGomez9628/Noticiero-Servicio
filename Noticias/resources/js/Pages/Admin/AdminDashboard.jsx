import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../Components/Admin/AdminLayout';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/admin/me');
        setAdminData(response.data.admin);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del administrador');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      localStorage.removeItem('admin_permissions');
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando panel de administración...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Bienvenido, {adminData?.name || 'Administrador'}
        </h2>
        <p className="mb-4">Desde aquí puedes gestionar todos los aspectos de tu aplicación.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-lg mb-2">Gestión de Usuarios</h3>
            <p className="text-sm mb-3">Administra los usuarios registrados en la plataforma.</p>
            <Link
              href="/admin/users"
              className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ir a Usuarios
            </Link>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-bold text-lg mb-2">Gestión de Eventos</h3>
            <p className="text-sm mb-3">Administra los eventos y sus asistencias.</p>
            <Link
              href="/admin/events"
              className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Ir a Eventos
            </Link>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-bold text-lg mb-2">Gestión de Roles</h3>
            <p className="text-sm mb-3">Configura los roles y permisos del sistema.</p>
            <Link
              href="/admin/roles"
              className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Ir a Roles
            </Link>
          </div>
        </div>
      </div>

      {/* Panel de estadísticas rápidas */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Usuarios</h3>
            <p className="text-3xl font-bold text-blue-700">--</p>
            <p className="text-sm text-blue-700">Total de usuarios registrados</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Eventos</h3>
            <p className="text-3xl font-bold text-green-700">--</p>
            <p className="text-sm text-green-700">Total de eventos activos</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Asistencias</h3>
            <p className="text-3xl font-bold text-yellow-700">--</p>
            <p className="text-sm text-yellow-700">Registros de asistencia</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Administradores</h3>
            <p className="text-3xl font-bold text-purple-700">--</p>
            <p className="text-sm text-purple-700">Administradores activos</p>
          </div>
        </div>
      </div>

      {/* Panel de actividad reciente */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acción
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Registro
                </span>
              </td>
              <td className="py-2 px-4 border-b border-gray-200">Usuario Ejemplo</td>
              <td className="py-2 px-4 border-b border-gray-200">--/--/----</td>
              <td className="py-2 px-4 border-b border-gray-200">--</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Volvemos a habilitar el layout
AdminDashboard.layout = page => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;