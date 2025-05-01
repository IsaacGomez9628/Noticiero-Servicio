import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import axios from 'axios';
import AdminLayout from '@/Components/Admin/AdminLayout';

const Index = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/admin/users/list');
      
      if (response.data.status === 'success') {
        const sortedUsers = (response.data.users || []).sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
      } else {
        throw new Error(response.data.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error al cargar los usuarios:', err);
      setError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
      
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_permissions');
        
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setDeleteError(null);
      setDeleteSuccess(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setDeleteError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.delete(`/admin/users/${userId}`);
      
      if (response.data.status === 'success') {
        setDeleteSuccess('Usuario eliminado con éxito');
        // Actualizar la lista de usuarios
        fetchUsers();
        
        // Limpiar el mensaje después de un tiempo
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
      setDeleteError('Error al eliminar el usuario: ' + (err.response?.data?.message || err.message));
      
      // Limpiar el mensaje de error después de un tiempo
      setTimeout(() => {
        setDeleteError(null);
      }, 3000);
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(
    user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.person?.full_name && 
       user.person.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.person?.name && 
       user.person.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.person?.last_name && 
       user.person.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head title="Gestión de Usuarios" />
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <Link
            href={route('admin.users.create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Nuevo Usuario
          </Link>
        </div>

        {deleteSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {deleteSuccess}
          </div>
        )}

        {deleteError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {deleteError}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchUsers} 
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="flex-1 shadow appearance-none border rounded p-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Cargando usuarios...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Nombre</th>
                    <th className="py-3 px-6 text-left">Roles</th>
                    <th className="py-3 px-6 text-left">Estado</th>
                    <th className="py-3 px-6 text-left">Fecha Reg.</th>
                    <th className="py-3 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentUsers.length > 0 ? (
                    currentUsers.map(user => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{user.id}</td>
                        <td className="py-3 px-6 text-left">{user.email}</td>
                        <td className="py-3 px-6 text-left">
                          {user.person ? (user.person.full_name || `${user.person.name || ''} ${user.person.last_name || ''}`.trim()) : 'Sin nombre'}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map(role => (
                              <span key={role.id} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2 py-0.5 rounded-full">
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">Sin roles</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {user.status ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status.slug === 'blocked' || user.blocked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.status.nombre || (user.blocked ? 'Bloqueado' : 'Activo')}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.blocked ? 'Bloqueado' : 'Activo'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <Link
                              href={route('admin.users.show', user.id)}
                              className="w-4 mr-3 transform hover:text-blue-500 hover:scale-110"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <Link
                              href={route('admin.users.edit', user.id)}
                              className="w-4 mr-3 transform hover:text-yellow-500 hover:scale-110"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.email}?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="w-4 mr-3 transform hover:text-red-500 hover:scale-110"
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
                        {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
              </div>
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border border-gray-300 ${
                    currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                  } text-sm font-medium text-gray-500`}
                >
                  Anterior
                </button>
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 border-t border-b border-gray-300 ${
                      currentPage === number + 1
                        ? 'bg-blue-50 text-blue-600 border-blue-500 z-10'
                        : 'bg-white hover:bg-gray-50 text-gray-500'
                    } text-sm font-medium`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border border-gray-300 ${
                    currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                  } text-sm font-medium text-gray-500`}
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Index.layout = page => <AdminLayout children={page} />;

export default Index;