import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import AdminLayout from '@/Components/Admin/AdminLayout';

const Show = ({ user }) => {
  return (
    <>
      <Head title={`Usuario: ${user.email}`} />
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Usuario</h1>
          <div className="flex space-x-2">
            <Link
              href={route('admin.users.edit', user.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              Editar
            </Link>
            <Link
              href={route('admin.users.index')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Volver
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información básica</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">ID</h3>
                  <p className="mt-1 text-sm text-gray-900">{user.id}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.blocked || (user.status && user.status.slug === 'blocked')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.status ? user.status.nombre : (user.blocked ? 'Bloqueado' : 'Activo')}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Registro</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {user.email_verified && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Email Verificado</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.email_verified_at ? new Date(user.email_verified_at).toLocaleDateString() : 'Sí'}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Nombre Completo</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.person ? (
                      user.person.full_name || `${user.person.name || ''} ${user.person.last_name || ''} ${user.person.second_last_name || ''}`.trim()
                    ) : (
                      'Sin información personal'
                    )}
                  </p>
                </div>
                
                {user.person && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Nombre(s)</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.person.name || 'No especificado'}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Apellido Paterno</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.person.last_name || 'No especificado'}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Apellido Materno</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.person.second_last_name || 'No especificado'}</p>
                    </div>
                    
                    {user.person.birth_date && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Fecha de Nacimiento</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(user.person.birth_date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Roles y Permisos</h2>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Roles asignados</h3>
            <div className="flex flex-wrap">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map(role => (
                  <span 
                    key={role.id}
                    className="mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Este usuario no tiene roles asignados</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href={route('admin.users.index')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Volver a la Lista
          </Link>
          <Link
            href={route('admin.users.edit', user.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Editar Usuario
          </Link>
        </div>
      </div>
    </>
  );
};

Show.layout = page => <AdminLayout children={page} />;

export default Show;