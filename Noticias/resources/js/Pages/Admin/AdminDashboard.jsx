import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../Components/Admin/AdminLayout';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null); // Aquí guardaremos el objeto completo del admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos simulados para el resumen del sistema
  const [dashboardStats, setDashboardStats] = useState({
    users: 1250,
    activeEvents: 42,
    attendances: 8765,
    activeAdmins: 7,
  });

  // Datos simulados para la actividad reciente
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: 'Registro de Usuario',
      user: 'Juan Pérez',
      date: '15/07/2025 10:30',
      details: 'Nuevo usuario registrado en la plataforma.',
      tag: 'Registro',
      tagColor: 'green',
    },
    {
      id: 2,
      action: 'Creación de Evento',
      user: 'Admin 1',
      date: '14/07/2025 14:00',
      details: 'Evento "Conferencia de Innovación" creado.',
      tag: 'Evento',
      tagColor: 'blue',
    },
    {
      id: 3,
      action: 'Actualización de Rol',
      user: 'María García',
      date: '13/07/2025 09:15',
      details: 'Rol de "Editor" asignado a un usuario.',
      tag: 'Roles',
      tagColor: 'purple',
    },
    {
      id: 4,
      action: 'Asistencia Registrada',
      user: 'Sistema',
      date: '15/07/2025 11:45',
      details: 'Asistencia registrada para "Taller de React".',
      tag: 'Asistencia',
      tagColor: 'yellow',
    },
    {
      id: 5,
      action: 'Eliminación de Usuario',
      user: 'Admin 2',
      date: '12/07/2025 16:20',
      details: 'Usuario "Pedro López" eliminado.',
      tag: 'Borrado',
      tagColor: 'red',
    },
  ]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        // Intenta obtener los datos del admin desde localStorage
        const storedAdminData = localStorage.getItem('admin_data');
        if (storedAdminData) {
          setAdminData(JSON.parse(storedAdminData)); // Parseamos el string JSON de vuelta a objeto
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Opcional: Si quieres seguir haciendo la llamada a /admin/me
        // para asegurar que los datos estén actualizados o para verificación.
        // Si /admin/me devuelve el mismo objeto 'admin', puedes actualizar setAdminData con eso.
        // const response = await axios.get('/admin/me');
        // setAdminData(response.data.admin);

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del administrador');
        setLoading(false);
        // Si hay un error al obtener el token o los datos, o si la API falla,
        // nos aseguramos de que adminData sea null para mostrar "Administrador" por defecto
        setAdminData(null);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      // Si tienes un endpoint de logout en Laravel, descomenta la siguiente línea:
      // await axios.post('/admin/logout');

      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data'); // ¡Importante eliminar también los datos del admin!
      localStorage.removeItem('admin_permissions');
      // Redirige al usuario a la página de login de admin
      window.location.href = '/admin/login';
      // O si usas Inertia: Inertia.visit('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aunque haya un error en la llamada al backend, se procede a limpiar el almacenamiento local y redirigir
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      localStorage.removeItem('admin_permissions');
      window.location.href = '/admin/login';
      // O si usas Inertia: Inertia.visit('/admin/login');
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
        </h2> {/* Usa adminData?.name para mostrar el nombre */}
        <p className="mb-4">Desde aquí puedes gestionar todos los aspectos de tu aplicación.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* ... (el resto de tu código de gestión de usuarios, eventos, roles) ... */}
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
            <h3 className="font-bold text-lg mb-2">Configuracion</h3>
            <p className="text-sm mb-3">Configuracion de la cuenta</p>
            <Link
              href="/admin/settings"
              className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Ir a Configuracion
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
            <p className="text-3xl font-bold text-blue-700">{dashboardStats.users}</p>
            <p className="text-sm text-blue-700">Total de usuarios registrados</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Eventos</h3>
            <p className="text-3xl font-bold text-green-700">{dashboardStats.activeEvents}</p>
            <p className="text-sm text-green-700">Total de eventos activos</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Asistencias</h3>
            <p className="text-3xl font-bold text-yellow-700">{dashboardStats.attendances}</p>
            <p className="text-sm text-yellow-700">Registros de asistencia</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Administradores</h3>
            <p className="text-3xl font-bold text-purple-700">{dashboardStats.activeAdmins}</p>
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
            {recentActivity.map((activity) => (
              <tr key={activity.id}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <span
                    className={`
                      ${activity.tagColor === 'green' ? 'bg-green-100 text-green-800' : ''}
                      ${activity.tagColor === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                      ${activity.tagColor === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                      ${activity.tagColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${activity.tagColor === 'red' ? 'bg-red-100 text-red-800' : ''}
                      text-xs px-2 py-1 rounded-full
                    `}
                  >
                    {activity.tag}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">{activity.user}</td>
                <td className="py-2 px-4 border-b border-gray-200">{activity.date}</td>
                <td className="py-2 px-4 border-b border-gray-200">{activity.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Eliminamos la prop adminEmail de aquí, ya que AdminLayout la obtendrá por sí mismo.
AdminDashboard.layout = page => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;