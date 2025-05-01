import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import AdminLayout from '@/Components/Admin/AdminLayout';

const AdminDashboard = ({ adminData: layoutAdminData, tabFromLayout }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(true);
  
  // Estado para manejar pestañas
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estado para la gestión de usuarios
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Usar datos de admin proporcionados por el layout si están disponibles
  useEffect(() => {
    if (layoutAdminData) {
      setAdminData(layoutAdminData);
      setLoading(false);
    } else {
      fetchAdminData();
    }
  }, [layoutAdminData]);

  // Sincronizar con la pestaña seleccionada en el layout
  useEffect(() => {
    if (tabFromLayout && tabFromLayout !== activeTab) {
      setActiveTab(tabFromLayout);
    }
  }, [tabFromLayout]);

  // Cargar usuarios cuando se active la pestaña
  useEffect(() => {
    if (activeTab === 'users' && !usersLoading && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Configurar el token para la solicitud
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Usar la ruta correcta según tu AdminAuthController
      const response = await axios.get('/admin/me');
      
      if (response.data.status === 'success') {
        setAdminData(response.data.admin);
        
        // Actualizar datos en localStorage
        localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
        
        if (response.data.permissions) {
          localStorage.setItem('admin_permissions', JSON.stringify(response.data.permissions));
        }
        
        setLoading(false);
      } else {
        throw new Error('Error al obtener datos del administrador');
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos del administrador');
      setLoading(false);
      setAuthorized(false);
      
      // Si hay un error de autenticación, limpiar tokens y redirigir
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_permissions');
        
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    }
  };
  
  // Función para cargar usuarios cuando se active la pestaña de usuarios
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Configurar el token para la solicitud
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Hacer la solicitud a la API usando tu ruta actual
      const response = await axios.get('/admin/users/list');
      
      if (response.data.status === 'success') {
        // Ordenar los usuarios por ID de forma ascendente
        const sortedUsers = (response.data.users || []).sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
      } else {
        throw new Error(response.data.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error al cargar los usuarios:', err);
      setUsersError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
      
      // Si es un error de autenticación, redirigir al login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_permissions');
        
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post('/admin/logout');
      }
      
      // Limpiar datos de sesión
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      localStorage.removeItem('admin_permissions');
      
      // Redirigir al login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // En caso de error, intentar redirigir al login de todos modos
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      localStorage.removeItem('admin_permissions');
      window.location.href = '/admin/login';
    }
  };
  
  // Función para eliminar un usuario
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
        window.location.href = '/admin/login';
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Usar la ruta correcta según tu configuración
      const response = await axios.delete(`/admin/users/${userId}`);
      
      if (response.data.status === 'success') {
        alert('Usuario eliminado con éxito');
        // Actualizar la lista de usuarios
        fetchUsers();
      } else {
        throw new Error(response.data.message || 'Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
      // Si hay un mensaje específico en la respuesta, mostrarlo
      if (err.response?.data?.message) {
        alert('Error al eliminar el usuario: ' + err.response.data.message);
      } else {
        alert('Error al eliminar el usuario: ' + err.message);
      }
    }
  };
  
  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(
    user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.person?.full_name && 
       user.person.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="flex justify-center p-8">Cargando panel de administración...</div>;
  }

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'No tienes autorización para acceder a esta página'}
          </div>
          <p className="mb-4 text-center">Serás redirigido al login en unos segundos...</p>
          <button 
            onClick={() => window.location.href = '/admin/login'} 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
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
      
      {activeTab === 'dashboard' && (
        <>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">
              Bienvenido, {adminData?.name || 'Administrador'}
            </h2>
            <p className="mb-4">Desde aquí puedes gestionar todos los aspectos de tu aplicación.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-lg mb-2">Gestión de Usuarios</h3>
                <p className="text-sm mb-3">Administra los usuarios registrados en la plataforma.</p>
                <button
                  onClick={() => setActiveTab('users')}
                  className="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Ir a Usuarios
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-bold text-lg mb-2">Gestión de Eventos</h3>
                <p className="text-sm mb-3">Administra los eventos y sus asistencias.</p>
                <button
                  onClick={() => setActiveTab('events')}
                  className="block w-full text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Ir a Eventos
                </button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-bold text-lg mb-2">Gestión de Roles</h3>
                <p className="text-sm mb-3">Configura los roles y permisos del sistema.</p>
                <button
                  onClick={() => setActiveTab('roles')}
                  className="block w-full text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Ir a Roles
                </button>
              </div>
            </div>
          </div>

          {/* Panel de estadísticas rápidas */}
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Usuarios</h3>
                <p className="text-3xl font-bold text-blue-700">{users.length || '--'}</p>
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
        </>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
            <button
              onClick={() => {
                window.location.href = '/admin/users/create';
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Nuevo Usuario
            </button>
          </div>
          
          {usersLoading ? (
            <div className="flex justify-center p-8">Cargando usuarios...</div>
          ) : usersError ? (
            <div>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {usersError}
              </div>
              <button 
                onClick={fetchUsers} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">ID</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Nombre</th>
                      <th className="py-3 px-6 text-left">Roles</th>
                      <th className="py-3 px-6 text-left">Estado</th>
                      <th className="py-3 px-6 text-left">Fecha Reg.</th>
                      <th className="py-3 px-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {currentUsers.length > 0 ? (
                      currentUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
                          <td className="py-3 px-6 text-left">{user.email}</td>
                          <td className="py-3 px-6 text-left">
                            {user.person ? (user.person.full_name || `${user.person.name || ''} ${user.person.last_name || ''}`) : 'Sin nombre'}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map(role => (
                                <span key={role.id} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                  {role.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">Sin roles</span>
                            )}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {user.status ? (
                              <span className={`${
                                user.status.slug === 'blocked' || user.blocked ? 
                                'bg-red-100 text-red-800' : 
                                'bg-green-100 text-green-800'
                              } text-xs font-semibold px-2.5 py-0.5 rounded`}>
                                {user.status.nombre || (user.blocked ? 'Bloqueado' : 'Activo')}
                              </span>
                            ) : (
                              <span className={`${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-xs font-semibold px-2.5 py-0.5 rounded`}>
                                {user.blocked ? 'Bloqueado' : 'Activo'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex item-center justify-center">
                              <button
                                onClick={() => {
                                  // Ver usuario
                                  window.location.href = `/admin/users/${user.id}`;
                                }}
                                className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110 cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  // Editar usuario
                                  window.location.href = `/admin/users/${user.id}/edit`;
                                }}
                                className="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110 cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                                    deleteUser(user.id);
                                  }
                                }}
                                className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-6 text-center">
                          No se encontraron usuarios
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`${
                        currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                      } px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-l-md`}
                    >
                      Anterior
                    </button>
                    {[...Array(totalPages).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`${
                          currentPage === number + 1
                            ? 'bg-blue-50 text-blue-600 z-10'
                            : 'bg-white hover:bg-gray-50'
                        } border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`${
                        currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                      } px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md`}
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {activeTab === 'events' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Gestión de Eventos</h2>
          <p>Contenido de la sección de eventos...</p>
        </div>
      )}
      
      {activeTab === 'roles' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Gestión de Roles</h2>
          <p>Contenido de la sección de roles...</p>
        </div>
      )}
      
      {activeTab === 'config' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Configuración del Sistema</h2>
          <p>Aquí podrás configurar los parámetros generales del sistema.</p>
        </div>
      )}
    </div>
  );
};

// Exponer la pestaña activa y la función para cambiarla como props
AdminDashboard.layout = page => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;