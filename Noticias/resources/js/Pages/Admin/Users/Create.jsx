import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import axios from 'axios';
import AdminLayout from '@/Components/Admin/AdminLayout';

const Create = () => {
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [createdUserId, setCreatedUserId] = useState(null);

  const { data, setData, errors, setErrors } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
    status_id: '',
    roles: [],
    person: {
      name: '',
      last_name: '',
      second_last_name: ''
    }
  });

  useEffect(() => {
    const fetchRolesAndStatuses = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) return;

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Obtener roles
        const rolesResponse = await axios.get('/admin/roles');
        if (rolesResponse.data.status === 'success') {
          setRoles(rolesResponse.data.roles || []);
        }
        
        // Obtener estados
        const statusesResponse = await axios.get('/admin/statuses/user');
        if (statusesResponse.data.status === 'success') {
          setStatuses(statusesResponse.data.statuses || []);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('No se pudieron cargar los roles y estados');
      }
    };

    fetchRolesAndStatuses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('person.')) {
      const personField = name.split('.')[1];
      setData('person', {
        ...data.person,
        [personField]: value
      });
    } else if (type === 'checkbox') {
      setData(name, checked);
    } else {
      setData(name, value);
    }
  };

  const handleRolesChange = (e) => {
    const options = e.target.options;
    const selectedRoles = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedRoles.push(parseInt(options[i].value));
      }
    }
    
    setData('roles', selectedRoles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    setErrors({});
    
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.post('/admin/users', data);
      
      if (response.data.status === 'success') {
        setSuccess(true);
        if (response.data.user && response.data.user.id) {
          setCreatedUserId(response.data.user.id);
        }
        
        // Si no se proporcionó un ID, redirigir a la lista de usuarios después de un breve retraso
        if (!response.data.user || !response.data.user.id) {
          setTimeout(() => {
            window.location.href = '/admin/users';
          }, 1500);
        }
      } else {
        throw new Error(response.data.message || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || err.message || 'Error al crear usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Crear Usuario" />
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
          <Link
            href={route('admin.users.index')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Volver
          </Link>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Usuario creado con éxito.</p>
            <div className="mt-2 flex space-x-3">
              {createdUserId && (
                <Link
                  href={route('admin.users.show', createdUserId)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Ver Usuario
                </Link>
              )}
              <Link
                href={route('admin.users.create')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Crear Otro Usuario
              </Link>
              <Link
                href={route('admin.users.index')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Volver a la Lista
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información de Usuario</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna 1: Información de cuenta */}
              <div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status_id" className="block text-sm font-medium text-gray-700">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status_id"
                    name="status_id"
                    value={data.status_id}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.status_id ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Selecciona un estado</option>
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.status_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.status_id}</p>
                  )}
                </div>
              </div>
              
              {/* Columna 2: Información personal */}
              <div>
                <div className="mb-4">
                  <label htmlFor="person.name" className="block text-sm font-medium text-gray-700">
                    Nombre(s)
                  </label>
                  <input
                    type="text"
                    id="person.name"
                    name="person.name"
                    value={data.person.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors['person.name'] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors['person.name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['person.name']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="person.last_name" className="block text-sm font-medium text-gray-700">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    id="person.last_name"
                    name="person.last_name"
                    value={data.person.last_name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors['person.last_name'] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors['person.last_name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['person.last_name']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="person.second_last_name" className="block text-sm font-medium text-gray-700">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    id="person.second_last_name"
                    name="person.second_last_name"
                    value={data.person.second_last_name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors['person.second_last_name'] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors['person.second_last_name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['person.second_last_name']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                    Roles <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="roles"
                    name="roles"
                    multiple
                    value={data.roles}
                    onChange={handleRolesChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.roles ? 'border-red-500' : ''
                    }`}
                    size="5"
                    required
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples roles
                  </p>
                  {errors.roles && (
                    <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href={route('admin.users.index')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

Create.layout = page => <AdminLayout children={page} />;

export default Create;