import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminUserService from '../../../Services/adminUserService';

const CreateUser = ({ roles, genders }) => {
    const [formData, setFormData] = useState({
        // Datos de cuenta
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '5', // Por defecto usuario personal
        
        // Datos personales
        name: '',
        last_name: '',
        second_last_name: '',
        gender_id: '',
        birth_date: '',
        
        // Datos de empresa (para usuarios institucionales)
        company_name: '',
        company_rfc: '',
        company_phone: '',
        company_address: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    // Log para debugging
    useEffect(() => {
        console.log('Roles disponibles:', roles);
        console.log('Géneros disponibles:', genders);
    }, [roles, genders]);
    
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
        if (!formData.password) newErrors.password = 'La contraseña es requerida';
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';
        if (!formData.gender_id) newErrors.gender_id = 'El género es requerido';
        if (!formData.birth_date) newErrors.birth_date = 'La fecha de nacimiento es requerida';
        
        // Validar que la fecha de nacimiento no sea futura
        if (formData.birth_date) {
            const birthDate = new Date(formData.birth_date);
            const today = new Date();
            if (birthDate >= today) {
                newErrors.birth_date = 'La fecha de nacimiento debe ser anterior a hoy';
            }
            
            // Validar edad mínima (por ejemplo, 18 años)
            const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 13) {
                newErrors.birth_date = 'El usuario debe tener al menos 13 años';
            }
        }
        
        // Validaciones para usuario institucional
        if (formData.role_id === '6') {
            if (!formData.company_name) newErrors.company_name = 'El nombre de la empresa es requerido';
            if (!formData.company_rfc) newErrors.company_rfc = 'El RFC es requerido';
            if (formData.company_rfc && formData.company_rfc.length !== 13) {
                newErrors.company_rfc = 'El RFC debe tener 13 caracteres';
            }
        }
        
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('Por favor corrige los errores en el formulario');
            return;
        }
        
        setLoading(true);
        
        try {
            // Preparar los datos para enviar
            let dataToSend = {
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role_id: parseInt(formData.role_id),
                name: formData.name,
                last_name: formData.last_name,
                second_last_name: formData.second_last_name || null,
                gender_id: parseInt(formData.gender_id),
                birth_date: formData.birth_date
            };
            
            // Solo agregar datos de empresa si es usuario institucional
            if (formData.role_id === '6') {
                dataToSend.company_name = formData.company_name;
                dataToSend.company_rfc = formData.company_rfc;
                dataToSend.company_phone = formData.company_phone || null;
                dataToSend.company_address = formData.company_address || null;
            }
            
            // Log para debugging
            console.log('Datos a enviar:', dataToSend);
            
            const response = await adminUserService.createUser(dataToSend);
            
            console.log('Respuesta exitosa:', response);
            
            if (response.status === 'success') {
                alert('Usuario creado exitosamente');
                router.visit('/admin/users');
            }
        } catch (error) {
            console.error('Error completo:', error);
            
            // El servicio ya lanza error.response.data cuando es 422
            if (error.errors) {
                // Es un error de validación de Laravel
                console.log('Errores de validación:', error.errors);
                
                // Convertir los errores al formato esperado
                const formattedErrors = {};
                Object.keys(error.errors).forEach(key => {
                    formattedErrors[key] = Array.isArray(error.errors[key]) 
                        ? error.errors[key][0] 
                        : error.errors[key];
                });
                
                setErrors(formattedErrors);
                
                // Mostrar todos los errores
                const errorMessages = Object.entries(error.errors)
                    .map(([field, messages]) => {
                        const message = Array.isArray(messages) ? messages[0] : messages;
                        return `${field}: ${message}`;
                    })
                    .join('\n');
                
                alert(`Errores de validación:\n${errorMessages}`);
            } else if (error.message) {
                alert(`Error: ${error.message}`);
            } else if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error al crear el usuario. Por favor, revisa los datos e intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const isInstitutional = formData.role_id === '6';
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
                <Link
                    href="/admin/users"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    ← Volver
                </Link>
            </div>
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Mostrar errores generales si existen */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong className="font-bold">¡Hay errores en el formulario!</strong>
                        <ul className="mt-2 list-disc list-inside">
                            {Object.entries(errors).map(([field, message]) => (
                                <li key={field}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
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
                                    {roles && roles.length > 0 ? (
                                        roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="5">Usuario</option>
                                            <option value="6">Usuario Institucional</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Contraseña <span className="text-red-500">*</span>
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
                                    Confirmar Contraseña <span className="text-red-500">*</span>
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
                                    {genders && genders.length > 0 ? (
                                        genders.map(gender => (
                                            <option key={gender.id} value={gender.id}>
                                                {gender.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="1">Masculino</option>
                                    )}
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
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateUser.layout = page => <AdminLayout>{page}</AdminLayout>;

export default CreateUser;