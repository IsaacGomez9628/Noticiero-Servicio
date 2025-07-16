import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

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
        
        // Intentar obtener datos del admin actual para verificar que el token sigue siendo válido
        const response = await axios.get('/admin/me');
        setAdminData(response.data.admin);
        setAuthenticated(true);
        setLoading(false);
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
          <a 
            href="/admin/dashboard" 
            className="block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-blue-500"
          >
            Dashboard
          </a>
          <a 
            href="/admin/users" 
            className="block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-transparent"
          >
            Usuarios
          </a>
          <a 
            href="/admin/events" 
            className="block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-transparent"
          >
            Eventos
          </a>
          <a 
            href="/admin/roles" 
            className="block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-transparent"
          >
            Roles y Permisos
          </a>
          <a 
            href="/admin/settings" 
            className="block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 border-transparent"
          >
            Configuración
          </a>
          <button 
            onClick={() => {
              axios.post('/admin/logout').then(() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                localStorage.removeItem('admin_permissions');
                window.location.href = '/admin/login';
              });
            }}
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;