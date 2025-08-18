import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminEventService from '../../../Services/adminEventService';
import LocationModal from '../../../Components/Admin/LocationModal';
import locationService from '../../../Services/locationService';

const CreateEvent = ({ locations: initialLocations, statuses, organizers, estates, cities }) => {
    const [locations, setLocations] = useState(initialLocations || []);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [formData, setFormData] = useState({
        titule: '',
        description: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        its_free: true,
        price: 0,
        capacity: 1,
        location_id: '',
        event_statuses_id: '1',
        organizer_id: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        console.log('Ubicaciones disponibles:', locations);
        console.log('Estados disponibles:', statuses);
        console.log('Organizadores disponibles:', organizers);
    }, [locations, statuses, organizers]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'its_free') {
            setFormData(prev => ({
                ...prev,
                its_free: checked,
                price: checked ? 0 : prev.price
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.titule) newErrors.titule = 'El título es requerido';
        if (!formData.description) newErrors.description = 'La descripción es requerida';
        if (!formData.start_date) newErrors.start_date = 'La fecha de inicio es requerida';
        if (!formData.end_date) newErrors.end_date = 'La fecha de fin es requerida';
        if (!formData.start_time) newErrors.start_time = 'La hora de inicio es requerida';
        if (!formData.end_time) newErrors.end_time = 'La hora de fin es requerida';
        if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'La capacidad debe ser al menos 1';
        if (!formData.location_id) newErrors.location_id = 'La ubicación es requerida';
        if (!formData.event_statuses_id) newErrors.event_statuses_id = 'El estado es requerido';
        
        if (!formData.its_free && (!formData.price || formData.price <= 0)) {
            newErrors.price = 'El precio debe ser mayor a 0 para eventos de pago';
        }
        
        if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (endDate < startDate) {
                newErrors.end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio';
            }
        }
        
        return newErrors;
    };
    
    const handleLocationCreated = (newLocation) => {
        // Añadir la nueva ubicación a la lista
        setLocations(prevLocations => [...prevLocations, newLocation]);
        
        // Seleccionar automáticamente la nueva ubicación
        setFormData(prev => ({
            ...prev,
            location_id: newLocation.id.toString()
        }));
        
        // Cerrar el modal
        setShowLocationModal(false);
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
            const dataToSend = {
                ...formData,
                its_free: Boolean(formData.its_free),
                price: formData.its_free ? 0 : parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                location_id: parseInt(formData.location_id),
                event_statuses_id: parseInt(formData.event_statuses_id),
                organizer_id: formData.organizer_id ? parseInt(formData.organizer_id) : null
            };
            
            console.log('Datos a enviar:', dataToSend);
            
            const response = await adminEventService.createEvent(dataToSend);
            
            console.log('Respuesta exitosa:', response);
            
            if (response.status === 'success') {
                alert('Evento creado exitosamente');
                router.visit('/admin/events');
            }
        } catch (error) {
            console.error('Error completo:', error);
            
            if (error.errors) {
                const formattedErrors = {};
                Object.keys(error.errors).forEach(key => {
                    formattedErrors[key] = Array.isArray(error.errors[key]) 
                        ? error.errors[key][0] 
                        : error.errors[key];
                });
                
                setErrors(formattedErrors);
                
                const errorMessages = Object.entries(error.errors)
                    .map(([field, messages]) => {
                        const message = Array.isArray(messages) ? messages[0] : messages;
                        return `${field}: ${message}`;
                    })
                    .join('\n');
                
                alert(`Errores de validación:\n${errorMessages}`);
            } else if (error.message) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Error al crear el evento. Por favor, revisa los datos e intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Crear Nuevo Evento</h1>
                <Link
                    href="/admin/events"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    ← Volver
                </Link>
            </div>
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                    {/* Información Básica */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Información Básica</h2>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Título del Evento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="titule"
                                    value={formData.titule}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.titule ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Ej: Festival de la Vendimia Querétaro"
                                />
                                {errors.titule && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.titule}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Descripción <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.description ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Describe el evento detalladamente..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Fechas y Horarios */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Fechas y Horarios</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de Inicio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.start_date ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.start_date && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.start_date}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de Fin <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.end_date ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.end_date && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.end_date}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Hora de Inicio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.start_time ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.start_time && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.start_time}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Hora de Fin <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.end_time ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.end_time && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.end_time}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Precio y Capacidad */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Precio y Capacidad</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        name="its_free"
                                        checked={formData.its_free}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700 text-sm font-bold">Evento Gratuito</span>
                                </label>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Precio {!formData.its_free && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    disabled={formData.its_free}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.price ? 'border-red-500' : ''
                                    } ${formData.its_free ? 'bg-gray-100' : ''}`}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.price}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Capacidad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.capacity ? 'border-red-500' : ''
                                    }`}
                                    placeholder="100"
                                />
                                {errors.capacity && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.capacity}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Ubicación y Estado */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Ubicación y Estado</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ubicación <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="location_id"
                                        value={formData.location_id}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            errors.location_id ? 'border-red-500' : ''
                                        }`}
                                    >
                                        <option value="">Seleccionar ubicación...</option>
                                        {locations?.map(location => (
                                            <option key={location.id} value={location.id}>
                                                {location.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowLocationModal(true)}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Añadir nueva ubicación
                                    </button>
                                </div>
                                {errors.location_id && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.location_id}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Estado <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="event_statuses_id"
                                    value={formData.event_statuses_id}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.event_statuses_id ? 'border-red-500' : ''
                                    }`}
                                >
                                    {statuses?.map(status => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.event_statuses_id && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.event_statuses_id}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Organizador
                                </label>
                                <select
                                    name="organizer_id"
                                    value={formData.organizer_id}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Seleccionar organizador...</option>
                                    {organizers?.map(organizer => (
                                        <option key={organizer.id} value={organizer.id}>
                                            {organizer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin/events"
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
                            {loading ? 'Creando...' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Modal de Nueva Ubicación */}
            {showLocationModal && (
                <LocationModal
                    isOpen={showLocationModal}
                    onClose={() => setShowLocationModal(false)}
                    onLocationCreated={handleLocationCreated}
                    estates={estates}
                    cities={cities}
                />
            )}
        </div>
    );
};

CreateEvent.layout = page => <AdminLayout>{page}</AdminLayout>;

export default CreateEvent;