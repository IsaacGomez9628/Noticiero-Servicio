import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  
  // Estado para manejar la pestaña activa en el layout
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      try {
        // Configurar token para todas las solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Usar la ruta correcta para verificar autenticación
        const checkAuthResponse = await axios.get('/admin/check-auth');
        
        if (checkAuthResponse.data.authenticated) {
          // Si estamos autenticados, obtener los datos del administrador
          const response = await axios.get('/admin/me');
          setAdminData(response.data.admin);
          setAuthenticated(true);
          setLoading(false);
        } else {
          throw new Error('No autenticado');
        }
      } catch (error) {
        console.error('Error de autenticación:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_permissions');
        window.location.href = '/admin/login';
      }
    };

    verifyAuth();
  }, []);

  // Esta función manejará el cambio de pestaña desde el sidebar
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Verificando autenticación...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Panel Admin</h1>
          <p className="text-sm text-gray-400">{adminData?.name || 'Administrador'}</p>
        </div>
        <nav className="mt-4">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 ${activeTab === 'dashboard' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleTabChange('users')}
            className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 ${activeTab === 'users' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            Usuarios
          </button>
          <button 
            onClick={() => handleTabChange('events')}
            className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 ${activeTab === 'events' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            Eventos
          </button>
          <button 
            onClick={() => handleTabChange('roles')}
            className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 ${activeTab === 'roles' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            Roles y Permisos
          </button>
          <button 
            onClick={() => handleTabChange('config')}
            className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 ${activeTab === 'config' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            Configuración
          </button>
          <button 
            onClick={handleLogout}
            className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-transparent text-red-400 hover:text-red-300 mt-8"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">
                {adminData?.email || 'admin@example.com'}
              </span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {/* Clonar el elemento hijo y pasarle la pestaña activa y la función para cambiarla como props */}
          {React.cloneElement(children, { 
            tabFromLayout: activeTab,
            adminData: adminData
          })}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;