import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminUserService from '../../../Services/adminUserService';

const EditUser = ({ user, roles, genders }) => {
    const [formData, setFormData] = useState({
        // Datos de cuenta
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role_id: user?.roles?.[0]?.id?.toString() || '5',
        
        // Datos personales
        name: user?.person?.name || '',
        last_name: user?.person?.last_name || '',
        second_last_name: user?.person?.second_last_name || '',
        gender_id: user?.person?.gender_id?.toString() || '',
        birth_date: user?.person?.birth_date || '',
        
        // Datos de empresa (para usuarios institucionales)
        company_name: user?.companies?.[0]?.name || '',
        company_rfc: user?.companies?.[0]?.rfc || '',
        company_phone: user?.companies?.[0]?.phone || '',
        company_address: user?.companies?.[0]?.address || ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        // Validaciones básicas
        if (!formData.email) newErrors.email = 'El email es requerido';
        
        // Solo validar contraseña si se está intentando cambiar
        if (formData.password && formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }
        
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';
        if (!formData.gender_id) newErrors.gender_id = 'El género es requerido';
        if (!formData.birth_date) newErrors.birth_date = 'La fecha de nacimiento es requerida';
        
        // Validaciones para usuario institucional
        if (formData.role_id === '6') {
            if (!formData.company_name) newErrors.company_name = 'El nombre de la empresa es requerido';
            if (!formData.company_rfc) newErrors.company_rfc = 'El RFC es requerido';
        }
        
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);
        
        try {
            // Preparar datos para enviar
            const dataToSend = { ...formData };
            
            // Si no se ingresó contraseña, no enviarla
            if (!dataToSend.password) {
                delete dataToSend.password;
                delete dataToSend.password_confirmation;
            }
            
            const response = await adminUserService.updateUser(user.id, dataToSend);
            
            if (response.status === 'success') {
                alert('Usuario actualizado exitosamente');
                router.visit('/admin/users');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || 'Error al actualizar el usuario');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const isInstitutional = formData.role_id === '6';
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Editar Usuario</h1>
                <Link
                    href="/admin/users"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    ← Volver
                </Link>
            </div>
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-blue-50 rounded">
                    <h3 className="font-semibold text-gray-700 mb-2">Información del Usuario</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="font-medium">ID:</span> {user.id}
                        </div>
                        <div>
                            <span className="font-medium">Creado:</span> {user.created_at}
                        </div>
                        <div>
                            <span className="font-medium">Estado:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {user.blocked ? 'Bloqueado' : 'Activo'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Email verificado:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                user.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {user.email_verified ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {/* Información de la Cuenta */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Información de la Cuenta</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Tipo de Cuenta <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    {roles?.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nueva Contraseña
                                    <span className="text-gray-500 text-xs ml-2">(dejar vacío para mantener la actual)</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.password ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.password_confirmation ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Datos Personales */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Datos Personales</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.name ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Apellido Paterno <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.last_name ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.last_name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Apellido Materno
                                </label>
                                <input
                                    type="text"
                                    name="second_last_name"
                                    value={formData.second_last_name}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Género <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender_id"
                                    value={formData.gender_id}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.gender_id ? 'border-red-500' : ''
                                    }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {genders?.map(gender => (
                                        <option key={gender.id} value={gender.id}>
                                            {gender.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.gender_id && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.gender_id}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de Nacimiento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.birth_date ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.birth_date && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.birth_date}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Datos de Empresa (solo para usuarios institucionales) */}
                    {isInstitutional && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Datos de la Empresa</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Nombre de la Empresa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            errors.company_name ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.company_name && (
                                        <p className="text-red-500 text-xs italic mt-1">{errors.company_name}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        RFC <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="company_rfc"
                                        value={formData.company_rfc}
                                        onChange={handleChange}
                                        maxLength="13"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            errors.company_rfc ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.company_rfc && (
                                        <p className="text-red-500 text-xs italic mt-1">{errors.company_rfc}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Teléfono de la Empresa
                                    </label>
                                    <input
                                        type="text"
                                        name="company_phone"
                                        value={formData.company_phone}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        name="company_address"
                                        value={formData.company_address}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Botones de acción */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin/users"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditUser.layout = page => <AdminLayout>{page}</AdminLayout>;

export default EditUser;