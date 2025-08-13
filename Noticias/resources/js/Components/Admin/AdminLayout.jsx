import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

// El componente AdminLayout ahora acepta una prop 'adminEmail'
const AdminLayout = ({ children, adminEmail }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Obtener la ruta actual para resaltar el enlace activo
    setCurrentPath(window.location.pathname);
    
    const verifyAuth = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      // Intenta cargar adminData desde localStorage inmediatamente para una visualización más rápida
      const storedAdminData = localStorage.getItem('admin_data');
      if (storedAdminData) {
        setAdminData(JSON.parse(storedAdminData));
        setAuthenticated(true);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Configurar token para todas las solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Intentar obtener datos del admin actual para verificar que el token sigue siendo válido
        const response = await axios.get('/admin/me');
        setAdminData(response.data.admin);
        setAuthenticated(true);
        setLoading(false);
        
        // Actualizar localStorage con los datos frescos
        localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
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

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        const token = localStorage.getItem('admin_token');
        
        // Llamar al endpoint de logout en el backend
        await axios.post('/admin/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
          }
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        // Limpiar el almacenamiento local y redirigir independientemente del resultado
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_permissions');
        window.location.href = '/admin/login';
      }
    }
  };

  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Panel Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{adminData?.name || 'Administrador'}</p>
        </div>
        
        <nav className="flex-1 mt-4">
          <a 
            href="/admin/dashboard" 
            className={`block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 transition-colors ${
              isActiveLink('/admin/dashboard') 
                ? 'border-blue-500 bg-gray-700' 
                : 'border-transparent'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          
          <a 
            href="/admin/users" 
            className={`block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 transition-colors ${
              isActiveLink('/admin/users') 
                ? 'border-blue-500 bg-gray-700' 
                : 'border-transparent'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Usuarios
          </a>
          
          <a 
            href="/admin/events" 
            className={`block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 transition-colors ${
              isActiveLink('/admin/events') 
                ? 'border-blue-500 bg-gray-700' 
                : 'border-transparent'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Eventos
          </a>
          
          <a 
            href="/admin/settings" 
            className={`block py-2 px-4 text-sm hover:bg-gray-700 border-l-4 transition-colors ${
              isActiveLink('/admin/settings') 
                ? 'border-blue-500 bg-gray-700' 
                : 'border-transparent'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </a>
        </nav>
        
        {/* Botón de cerrar sesión al final del sidebar */}
        <div className="border-t border-gray-700 p-4">
          <button 
            onClick={handleLogout}
            className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-700 rounded transition-colors text-red-400 hover:text-red-300"
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{adminData?.name || 'Administrador'}</p>
                <p className="text-xs text-gray-500">
                  {adminEmail || adminData?.email || 'admin@example.com'}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {(adminData?.name || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;