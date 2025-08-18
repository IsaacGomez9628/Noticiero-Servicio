import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../Components/Admin/AdminLayout';

const AdminDashboard = ({ dashboardStats = {}, recentActivity = [], additionalData = {} }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ MANTENER: Estados existentes que YA FUNCIONAN
  const [stats, setStats] = useState(dashboardStats);
  const [activity, setActivity] = useState(recentActivity);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // 🆕 NUEVO: Estados para nuevas funcionalidades
  const [isExporting, setIsExporting] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        const storedAdminData = localStorage.getItem('admin_data');
        if (storedAdminData) {
          setAdminData(JSON.parse(storedAdminData));
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
      } catch (err) {
        console.error('Error al cargar datos del admin:', err);
        setError('Error al cargar los datos del administrador');
      }
    };

    fetchAdminData();
  }, []);

  // ✅ MANTENER: Funciones existentes que YA FUNCIONAN
  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/api/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error al actualizar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshActivity = async () => {
    try {
      const response = await axios.get('/admin/api/dashboard/activity');
      if (response.data.success) {
        setActivity(response.data.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error al actualizar actividad:', err);
    }
  };

  const getTagColorClass = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colors[color] || colors.gray;
  };

  // 🆕 NUEVO: Función para exportar datos
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      // Llamar al endpoint de exportación
      const response = await axios.get('/admin/api/dashboard/export');
      
      // Crear y descargar el archivo
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error al exportar:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 🆕 NUEVO: Función para calcular porcentaje de crecimiento
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // 🆕 NUEVO: Obtener métricas adicionales
  const metrics = additionalData.additionalMetrics || {};
  const growth = metrics.growthMetrics || {};

  return (
    <AdminLayout>
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* ✅ MANTENER: Header original pero CON responsive mejorado y botón exportar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Datos generales</h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* 🆕 NUEVO: Botón exportar con animación */}
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 ${isExporting ? 'animate-pulse' : ''}`}
            >
              {isExporting ? '📤 Exportando...' : '📤 Exportar'}
            </button>
            
            {/* ✅ MANTENER: Botón actualizar con animación mejorada */}
            <button
              onClick={refreshStats}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? '🔄 Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* ✅ MANTENER: Botones de navegación originales pero CON responsive mejorado y animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="bg-blue-50 p-4 lg:p-6 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="font-bold text-lg mb-2">Gestión de Usuarios</h3>
            <p className="text-sm mb-3">Administra los usuarios registrados en la plataforma.</p>
            <Link
              href="/admin/users"
              className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
            >
              Ir a Usuarios
            </Link>
          </div>

          <div className="bg-green-50 p-4 lg:p-6 rounded-lg border border-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="font-bold text-lg mb-2">Gestión de Eventos</h3>
            <p className="text-sm mb-3">Administra los eventos y sus asistencias.</p>
            <Link
              href="/admin/events"
              className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
            >
              Ir a Eventos
            </Link>
          </div>

          <div className="bg-purple-50 p-4 lg:p-6 rounded-lg border border-purple-100 transition-all duration-300 hover:shadow-lg hover:scale-105 md:col-span-2 xl:col-span-1">
            <h3 className="font-bold text-lg mb-2">Gestión de organizadores</h3>
            <p className="text-sm mb-3">Administra a los organizadores de los eventos.</p>
            <Link
              href="/admin/organizers"
              className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
            >
              Ir a Organizadores
            </Link>
          </div>
        </div>

        {/* ✅ MANTENER: Resumen del Sistema original pero CON animaciones, responsive y métricas de crecimiento */}
        <div className="bg-white shadow-md rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-blue-100 p-4 lg:p-6 rounded-lg transition-all duration-300 hover:bg-blue-200 hover:scale-105">
              <h3 className="font-bold text-lg mb-2">Usuarios</h3>
              <p className="text-2xl lg:text-3xl font-bold text-blue-700 transition-all duration-500">
                {stats.users?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-blue-700">Total de usuarios registrados</p>
              {/* 🆕 NUEVO: Indicador de crecimiento */}
              {growth.usersThisMonth !== undefined && (
                <div className="mt-2 text-xs">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full transition-all duration-200 ${
                    calculateGrowth(growth.usersThisMonth, growth.usersLastMonth) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculateGrowth(growth.usersThisMonth, growth.usersLastMonth) >= 0 ? '↗️' : '↘️'}
                    {Math.abs(calculateGrowth(growth.usersThisMonth, growth.usersLastMonth))}% este mes
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-green-100 p-4 lg:p-6 rounded-lg transition-all duration-300 hover:bg-green-200 hover:scale-105">
              <h3 className="font-bold text-lg mb-2">Eventos</h3>
              <p className="text-2xl lg:text-3xl font-bold text-green-700 transition-all duration-500">
                {stats.activeEvents?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-700">Total de eventos activos</p>
              {growth.eventsThisMonth !== undefined && (
                <div className="mt-2 text-xs">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full transition-all duration-200 ${
                    calculateGrowth(growth.eventsThisMonth, growth.eventsLastMonth) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculateGrowth(growth.eventsThisMonth, growth.eventsLastMonth) >= 0 ? '↗️' : '↘️'}
                    {Math.abs(calculateGrowth(growth.eventsThisMonth, growth.eventsLastMonth))}% este mes
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-100 p-4 lg:p-6 rounded-lg transition-all duration-300 hover:bg-yellow-200 hover:scale-105">
              <h3 className="font-bold text-lg mb-2">Asistencias</h3>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-700 transition-all duration-500">
                {stats.attendances?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-yellow-700">Registros totales de asistencia</p>
            </div>
            
            <div className="bg-purple-100 p-4 lg:p-6 rounded-lg transition-all duration-300 hover:bg-purple-200 hover:scale-105">
              <h3 className="font-bold text-lg mb-2">Administradores</h3>
              <p className="text-2xl lg:text-3xl font-bold text-purple-700 transition-all duration-500">
                {stats.activeAdmins?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-purple-700">Administradores activos</p>
            </div>
          </div>
        </div>

        {/* 🆕 NUEVO: Métricas adicionales (eventos populares y usuarios por mes) */}
        {metrics.topEvents && metrics.topEvents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Eventos más populares */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                🏆 Eventos Más Populares
              </h3>
              <div className="space-y-3">
                {metrics.topEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                        <span className="font-medium text-gray-900 truncate">{event.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">Fecha: {event.start_date}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-lg font-bold text-green-600">{event.attendances_count}</span>
                      <p className="text-xs text-gray-500">asistencias</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usuarios por mes */}
            {metrics.usersPerMonth && metrics.usersPerMonth.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📈 Usuarios por Mes
                </h3>
                <div className="space-y-2">
                  {metrics.usersPerMonth.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-all duration-200">
                      <span className="text-sm font-medium text-gray-700">{month.period}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((month.count / Math.max(...metrics.usersPerMonth.map(m => m.count))) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-blue-600 min-w-max">{month.count} usuarios</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ MANTENER: Actividad Reciente original pero CON responsive mejorado */}
        <div className="bg-white shadow-md rounded-lg px-4 sm:px-8 pt-6 pb-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-semibold">Actividad Reciente</h2>
            <button
              onClick={refreshActivity}
              className="text-blue-500 hover:text-blue-700 text-sm transition-all duration-200 self-start sm:self-auto"
            >
              Actualizar
            </button>
          </div>
          
          {activity && activity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acción
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Fecha
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activity.map((act) => (
                    <tr key={act.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${getTagColorClass(act.tagColor)}`}>
                          {act.tag}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {act.user}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {act.date}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                        <div className="max-w-xs truncate" title={act.details}>
                          {act.details}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-500">No hay actividad reciente registrada.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;