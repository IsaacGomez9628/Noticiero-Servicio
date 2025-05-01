import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLoginCheck = () => {
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Formulario de inicio de sesión
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Formulario de creación de administrador
  const [createData, setCreateData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Verificar si hay un token almacenado
        const token = localStorage.getItem('admin_token');
        
        if (token) {
          // Configurar el token para axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Intentar obtener información del admin actual
          try {
            const response = await axios.get('/admin/me');
            if (response.data.status === 'success') {
              // Si la solicitud es exitosa, redirigir al dashboard
              window.location.href = '/admin/dashboard';
              return;
            }
          } catch (err) {
            // Si hay un error, limpiar el token
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            localStorage.removeItem('admin_permissions');
            axios.defaults.headers.common['Authorization'] = '';
          }
        }
        
        // 2. Verificar si existen administradores en el sistema
        const response = await axios.get('/admin/check');
        setAdminExists(response.data.admin_exists);
        setLoading(false);
      } catch (err) {
        console.error('Error al verificar administradores:', err);
        setError('Error al verificar administradores');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateChange = (e) => {
    setCreateData({
      ...createData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post('/admin/login', loginData);
      
      if (response.data.status === 'success') {
        // Guardar token y datos en localStorage
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
        
        if (response.data.permissions) {
          localStorage.setItem('admin_permissions', JSON.stringify(response.data.permissions));
        }
        
        // Configurar el token para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Redireccionar al dashboard
        window.location.href = '/admin/dashboard';
      } else {
        throw new Error(response.data.message || 'Error de autenticación');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.response?.data?.message || 'Las credenciales proporcionadas son incorrectas.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Decidir qué endpoint usar dependiendo de si existe un admin
      const endpoint = !adminExists ? '/admin/create-first' : '/admin/create';
      
      const response = await axios.post(endpoint, createData);
      
      if (response.data.status === 'success') {
        if (!adminExists && response.data.token) {
          // Si es el primer admin, guardar token y redirigir
          localStorage.setItem('admin_token', response.data.token);
          localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
          
          // Configurar el token para futuras solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          alert('Administrador creado con éxito');
          window.location.href = '/admin/dashboard';
        } else {
          // Si es un admin adicional, mostrar mensaje y volver al login
          alert('Administrador creado con éxito');
          setShowCreateForm(false);
          
          // Limpiar el formulario
          setCreateData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: ''
          });
        }
      } else {
        throw new Error(response.data.message || 'Error al crear administrador');
      }
    } catch (err) {
      console.error('Error al crear administrador:', err);
      setError(err.response?.data?.message || 'Error al crear administrador');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Verificando sistema...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!adminExists ? (
        // Formulario de creación de primer administrador
        <div>
          <h1 className="text-2xl font-bold mb-4">Crear primer administrador</h1>
          <p className="mb-4">No existe ningún administrador en el sistema. Por favor, crea el primer administrador para gestionar la plataforma.</p>
          
          <form onSubmit={handleCreateSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre completo</label>
              <input 
                type="text" 
                name="name"
                value={createData.name}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={createData.email}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono (opcional)</label>
              <input 
                type="text" 
                name="phone"
                value={createData.phone}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                name="password"
                value={createData.password}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar contraseña</label>
              <input 
                type="password" 
                name="password_confirmation"
                value={createData.password_confirmation}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={submitting}
            >
              {submitting ? 'Creando...' : 'Crear administrador'}
            </button>
          </form>
        </div>
      ) : showCreateForm ? (
        // Formulario para crear nuevo administrador cuando ya existen administradores
        <div>
          <h1 className="text-2xl font-bold mb-4">Crear nuevo administrador</h1>
          <p className="mb-4">Completa el formulario para crear un nuevo administrador.</p>
          
          <form onSubmit={handleCreateSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre completo</label>
              <input 
                type="text" 
                name="name"
                value={createData.name}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={createData.email}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono (opcional)</label>
              <input 
                type="text" 
                name="phone"
                value={createData.phone}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                name="password"
                value={createData.password}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar contraseña</label>
              <input 
                type="password" 
                name="password_confirmation"
                value={createData.password_confirmation}
                onChange={handleCreateChange}
                className="border rounded p-2 w-full" 
                required
              />
            </div>
            <div className="flex space-x-2">
              <button 
                type="submit" 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear administrador'}
              </button>
              <button 
                type="button" 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Formulario de inicio de sesión
        <div>
          <h1 className="text-2xl font-bold mb-4">Página de acceso administrativo</h1>
          <p className="mb-4">Esta es la página de login para administradores</p>
          
          <form onSubmit={handleLoginSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={submitting}
            >
              {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Crear nuevo administrador
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginCheck;