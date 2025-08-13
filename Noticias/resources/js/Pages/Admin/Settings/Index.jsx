import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { User, Mail, Phone, Lock, LogOut, Save, Eye, EyeOff, Shield } from 'lucide-react';

export default function Settings({ admin }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Estados para el formulario de perfil
    const [profileData, setProfileData] = useState({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || ''
    });
    
    // Estados para el formulario de contraseña
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejar actualización de perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await fetch('/admin/api/settings/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Perfil actualizado correctamente');
                setIsEditing(false);
                // Actualizar los datos del admin
                setProfileData({
                    name: data.admin.name,
                    email: data.admin.email,
                    phone: data.admin.phone || ''
                });
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ general: data.message || 'Error al actualizar el perfil' });
                }
            }
        } catch (error) {
            setErrors({ general: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio de contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await fetch('/admin/api/settings/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Contraseña actualizada correctamente');
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ general: data.message || 'Error al cambiar la contraseña' });
                }
            }
        } catch (error) {
            setErrors({ general: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    // Manejar cierre de sesión
    const handleLogout = async () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            try {
                const response = await fetch('/admin/logout', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });

                if (response.ok) {
                    window.location.href = '/admin/login';
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
    };

    return (
        <AdminLayout>
            <Head title="Configuración" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración de la Cuenta</h1>
                    
                    {/* Mensajes de éxito/error */}
                    {successMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {successMessage}
                        </div>
                    )}
                    
                    {errors.general && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {errors.general}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white shadow-sm rounded-lg mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <User className="inline-block w-4 h-4 mr-2" />
                                    Información Personal
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'security'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Lock className="inline-block w-4 h-4 mr-2" />
                                    Seguridad
                                </button>
                                <button
                                    onClick={() => setActiveTab('session')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'session'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <LogOut className="inline-block w-4 h-4 mr-2" />
                                    Sesión
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Contenido de las tabs */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        {/* Tab de Información Personal */}
                        {activeTab === 'profile' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Editar Información
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleUpdateProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="inline-block w-4 h-4 mr-1" />
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isEditing 
                                                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' 
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="inline-block w-4 h-4 mr-1" />
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isEditing 
                                                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' 
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="inline-block w-4 h-4 mr-1" />
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isEditing 
                                                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' 
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Shield className="inline-block w-4 h-4 mr-1" />
                                                Rol
                                            </label>
                                            <input
                                                type="text"
                                                value={admin.rol?.name || 'Sin rol asignado'}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t pt-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Cuenta creada:</span>{' '}
                                                {new Date(admin.created_at).toLocaleDateString('es-ES')}
                                            </div>
                                            <div>
                                                <span className="font-medium">Última actualización:</span>{' '}
                                                {new Date(admin.updated_at).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setProfileData({
                                                        name: admin.name,
                                                        email: admin.email,
                                                        phone: admin.phone || ''
                                                    });
                                                    setErrors({});
                                                }}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Tab de Seguridad */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cambiar Contraseña</h2>
                                
                                <form onSubmit={handleChangePassword} className="max-w-md">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña Actual
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {errors.current_password && (
                                                <p className="text-red-500 text-xs mt-1">{errors.current_password[0]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nueva Contraseña
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                    minLength="8"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {errors.new_password && (
                                                <p className="text-red-500 text-xs mt-1">{errors.new_password[0]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nueva Contraseña
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={passwordData.new_password_confirmation}
                                                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Tab de Sesión */}
                        {activeTab === 'session' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Sesión</h2>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Información importante:</strong> Al cerrar sesión, serás redirigido a la página de inicio de sesión 
                                        y deberás volver a ingresar tus credenciales para acceder al panel de administración.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">Sesión Actual</h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Usuario:</strong> {admin.name}</p>
                                            <p><strong>Email:</strong> {admin.email}</p>
                                            <p><strong>Rol:</strong> {admin.rol?.name || 'Sin rol asignado'}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center font-medium"
                                    >
                                        <LogOut className="w-5 h-5 mr-2" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}