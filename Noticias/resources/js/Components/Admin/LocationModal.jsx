import React, { useState, useEffect } from 'react';
import locationService from '../../Services/locationService';

const LocationModal = ({ isOpen, onClose, onLocationCreated, estates: propsEstates, cities: propsCities }) => {
    const [formData, setFormData] = useState({
        name: '',
        direction: '',
        estate_id: '',
        city_id: '',
        country: 'México',
        zip_code: '',
        latitude: '',
        length: '',
        link_google_maps: '',
        active: true
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [estatesData, setEstatesData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    
    // Cargar datos iniciales
    useEffect(() => {
        if (isOpen) {
            // Si tenemos datos desde props, usarlos
            if (propsEstates && propsEstates.length > 0) {
                setEstatesData(propsEstates);
                setCitiesData(propsCities || []);
            } else {
                // Si no, cargarlos desde el backend
                loadFormData();
            }
        }
    }, [isOpen, propsEstates, propsCities]);
    
    // Cargar datos del formulario desde el backend
    const loadFormData = async () => {
        setLoadingData(true);
        try {
            const response = await locationService.getFormData();
            console.log('Datos del formulario cargados:', response);
            
            if (response.data) {
                setEstatesData(response.data.estates || []);
                setCitiesData(response.data.cities || []);
                
                console.log('Estados cargados:', response.data.estates?.length);
                console.log('Ciudades cargadas:', response.data.cities?.length);
            }
        } catch (error) {
            console.error('Error al cargar datos del formulario:', error);
            alert('Error al cargar los datos del formulario. Por favor, recarga la página.');
        } finally {
            setLoadingData(false);
        }
    };
    
    // Filtrar ciudades cuando cambia el estado seleccionado
    useEffect(() => {
        console.log('=== Filtrado de ciudades ===');
        console.log('Estado seleccionado ID:', formData.estate_id);
        console.log('Total de ciudades disponibles:', citiesData.length);
        
        if (formData.estate_id && citiesData && citiesData.length > 0) {
            // Convertir a string para comparación segura
            const estateIdStr = String(formData.estate_id);
            
            const filtered = citiesData.filter(city => {
                const cityEstateIdStr = String(city.estate_id);
                const match = cityEstateIdStr === estateIdStr;
                
                if (match) {
                    console.log(`Ciudad "${city.name}" (estate_id: ${city.estate_id}) coincide`);
                }
                
                return match;
            });
            
            console.log('Ciudades filtradas:', filtered.length);
            console.log('Ciudades:', filtered.map(c => c.name));
            
            setFilteredCities(filtered);
        } else {
            console.log('No hay estado seleccionado o no hay ciudades disponibles');
            setFilteredCities([]);
        }
    }, [formData.estate_id, citiesData]);
    
    // Cargar ciudades dinámicamente cuando se selecciona un estado (opcional, como respaldo)
    const loadCitiesByEstate = async (estateId) => {
        if (!estateId) return;
        
        try {
            console.log('Cargando ciudades para estado ID:', estateId);
            const response = await locationService.getCitiesByEstate(estateId);
            
            if (response.data) {
                console.log('Ciudades cargadas dinámicamente:', response.data.length);
                setFilteredCities(response.data);
            }
        } catch (error) {
            console.error('Error al cargar ciudades:', error);
            // Si falla la carga dinámica, usar el filtrado local
            const filtered = citiesData.filter(city => 
                String(city.estate_id) === String(estateId)
            );
            setFilteredCities(filtered);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Actualizar el valor del campo
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        // Si cambia el estado, limpiar la ciudad seleccionada
        if (name === 'estate_id') {
            setFormData(prev => ({
                ...prev,
                estate_id: value,
                city_id: ''
            }));
            
            // Opcionalmente, cargar ciudades dinámicamente
            // loadCitiesByEstate(value);
        }
        
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
        
        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        
        if (!formData.direction?.trim()) {
            newErrors.direction = 'La dirección es requerida';
        }
        
        if (!formData.estate_id) {
            newErrors.estate_id = 'El estado es requerido';
        }
        
        if (!formData.city_id) {
            newErrors.city_id = 'La ciudad es requerida';
        }
        
        if (!formData.zip_code?.trim()) {
            newErrors.zip_code = 'El código postal es requerido';
        } else if (!/^\d{5}$/.test(formData.zip_code)) {
            newErrors.zip_code = 'El código postal debe tener 5 dígitos';
        }
        
        // Validar coordenadas si se proporcionan
        if (formData.latitude) {
            const lat = parseFloat(formData.latitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                newErrors.latitude = 'La latitud debe estar entre -90 y 90';
            }
        }
        
        if (formData.length) {
            const lng = parseFloat(formData.length);
            if (isNaN(lng) || lng < -180 || lng > 180) {
                newErrors.length = 'La longitud debe estar entre -180 y 180';
            }
        }
        
        // Validar URL de Google Maps si se proporciona
        if (formData.link_google_maps && 
            !formData.link_google_maps.includes('maps.google.com') && 
            !formData.link_google_maps.includes('goo.gl/maps')) {
            newErrors.link_google_maps = 'Debe ser un enlace válido de Google Maps';
        }
        
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar formulario
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log('Errores de validación:', validationErrors);
            return;
        }
        
        setLoading(true);
        
        try {
            // Preparar datos para enviar
            const dataToSend = {
                ...formData,
                estate_id: parseInt(formData.estate_id),
                city_id: parseInt(formData.city_id),
                active: formData.active ? 1 : 0,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                length: formData.length ? parseFloat(formData.length) : null
            };
            
            console.log('Enviando datos:', dataToSend);
            
            // Crear ubicación
            const response = await locationService.createLocation(dataToSend);
            
            console.log('Respuesta del servidor:', response);
            
            if (response.status === 'success') {
                alert('Ubicación creada exitosamente');
                
                // Notificar al componente padre
                if (onLocationCreated) {
                    onLocationCreated(response.data);
                }
                
                // Cerrar modal
                handleClose();
            }
        } catch (error) {
            console.error('Error al crear ubicación:', error);
            
            if (error.errors) {
                // Mostrar errores de validación del servidor
                setErrors(error.errors);
                
                // Mostrar mensaje de error general
                const errorMessages = Object.values(error.errors).flat().join('\n');
                alert(`Error al crear la ubicación:\n${errorMessages}`);
            } else {
                alert(error.message || 'Error al crear la ubicación. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = () => {
        // Limpiar formulario
        setFormData({
            name: '',
            direction: '',
            estate_id: '',
            city_id: '',
            country: 'México',
            zip_code: '',
            latitude: '',
            length: '',
            link_google_maps: '',
            active: true
        });
        
        // Limpiar errores y ciudades filtradas
        setErrors({});
        setFilteredCities([]);
        
        // Cerrar modal
        onClose();
    };
    
    // No renderizar si el modal no está abierto
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            Añadir Nueva Ubicación
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre del Lugar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.name ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Ej: Auditorio Municipal"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            {/* Dirección */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Dirección <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.direction ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Ej: Av. Constituyentes 123, Col. Centro"
                                />
                                {errors.direction && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.direction}</p>
                                )}
                            </div>
                            
                            {/* Estado */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Estado <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="estate_id"
                                    value={formData.estate_id}
                                    onChange={handleChange}
                                    disabled={loadingData}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.estate_id ? 'border-red-500' : ''
                                    } ${loadingData ? 'bg-gray-100' : ''}`}
                                >
                                    <option value="">
                                        {loadingData ? 'Cargando estados...' : 'Seleccionar estado...'}
                                    </option>
                                    {estatesData?.map(estate => (
                                        <option key={estate.id} value={estate.id}>
                                            {estate.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.estate_id && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.estate_id}</p>
                                )}
                            </div>
                            
                            {/* Ciudad */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ciudad <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="city_id"
                                    value={formData.city_id}
                                    onChange={handleChange}
                                    disabled={!formData.estate_id || loadingData}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.city_id ? 'border-red-500' : ''
                                    } ${!formData.estate_id || loadingData ? 'bg-gray-100' : ''}`}
                                >
                                    <option value="">
                                        {!formData.estate_id 
                                            ? 'Primero selecciona un estado' 
                                            : filteredCities.length === 0 
                                                ? 'No hay ciudades disponibles' 
                                                : 'Seleccionar ciudad...'}
                                    </option>
                                    {filteredCities?.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city_id && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.city_id}</p>
                                )}
                                {formData.estate_id && filteredCities.length === 0 && !loadingData && (
                                    <p className="text-yellow-600 text-xs italic mt-1">
                                        No hay ciudades registradas para este estado
                                    </p>
                                )}
                            </div>
                            
                            {/* País */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    País
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    readOnly
                                />
                            </div>
                            
                            {/* Código Postal */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Código Postal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    maxLength="5"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.zip_code ? 'border-red-500' : ''
                                    }`}
                                    placeholder="76000"
                                />
                                {errors.zip_code && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.zip_code}</p>
                                )}
                            </div>
                            
                            {/* Latitud */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Latitud
                                </label>
                                <input
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.latitude ? 'border-red-500' : ''
                                    }`}
                                    placeholder="20.5931"
                                />
                                {errors.latitude && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.latitude}</p>
                                )}
                            </div>
                            
                            {/* Longitud */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Longitud
                                </label>
                                <input
                                    type="text"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.length ? 'border-red-500' : ''
                                    }`}
                                    placeholder="-100.3851"
                                />
                                {errors.length && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.length}</p>
                                )}
                            </div>
                            
                            {/* Link Google Maps */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Enlace de Google Maps
                                </label>
                                <input
                                    type="text"
                                    name="link_google_maps"
                                    value={formData.link_google_maps}
                                    onChange={handleChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.link_google_maps ? 'border-red-500' : ''
                                    }`}
                                    placeholder="https://maps.google.com/?q=..."
                                />
                                {errors.link_google_maps && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.link_google_maps}</p>
                                )}
                            </div>
                            
                            {/* Estado Activo */}
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700 text-sm font-bold">Ubicación Activa</span>
                                </label>
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex items-center justify-end mt-6 space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Guardando...' : 'Guardar Ubicación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;