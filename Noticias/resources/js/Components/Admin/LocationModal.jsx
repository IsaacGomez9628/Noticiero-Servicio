import React, { useState, useEffect } from 'react';
import locationService from '../../Services/locationService';

const LocationModal = ({ isOpen, onClose, onLocationCreated, estates, cities }) => {
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
    const [estatesData, setEstatesData] = useState(estates || []);
    const [citiesData, setCitiesData] = useState(cities || []);
    const [loadingData, setLoadingData] = useState(false);
    
    // Si no recibimos estates o cities, los obtenemos del backend
    useEffect(() => {
        if (isOpen && (!estatesData || estatesData.length === 0 || !citiesData || citiesData.length === 0)) {
            setLoadingData(true);
            locationService.getFormData()
                .then(response => {
                    console.log('Datos recibidos del backend:', response); // Debug
                    if (response.data) {
                        setEstatesData(response.data.estates || []);
                        setCitiesData(response.data.cities || []);
                        console.log('Estados cargados:', response.data.estates); // Debug
                        console.log('Ciudades cargadas:', response.data.cities); // Debug
                    }
                })
                .catch(error => {
                    console.error('Error al cargar datos del formulario:', error);
                })
                .finally(() => {
                    setLoadingData(false);
                });
        }
    }, [isOpen]);
    
    // Filtrar ciudades basado en el estado seleccionado
    useEffect(() => {
        console.log('Estado seleccionado ID:', formData.estate_id); // Debug
        console.log('Ciudades disponibles:', citiesData); // Debug
        
        if (formData.estate_id && citiesData && citiesData.length > 0) {
            const filtered = citiesData.filter(city => 
                String(city.estate_id) === String(formData.estate_id)
            );
            console.log('Ciudades filtradas:', filtered); // Debug
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    }, [formData.estate_id, citiesData]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Limpiar ciudad si cambia el estado
        if (name === 'estate_id') {
            setFormData(prev => ({
                ...prev,
                city_id: ''
            }));
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
        
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.direction) newErrors.direction = 'La dirección es requerida';
        if (!formData.estate_id) newErrors.estate_id = 'El estado es requerido';
        if (!formData.city_id) newErrors.city_id = 'La ciudad es requerida';
        if (!formData.zip_code) newErrors.zip_code = 'El código postal es requerido';
        
        // Validar formato de código postal (5 dígitos para México)
        if (formData.zip_code && !/^\d{5}$/.test(formData.zip_code)) {
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
        if (formData.link_google_maps && !formData.link_google_maps.includes('maps.google.com')) {
            newErrors.link_google_maps = 'Debe ser un enlace válido de Google Maps';
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
            const dataToSend = {
                ...formData,
                estate_id: parseInt(formData.estate_id),
                city_id: parseInt(formData.city_id),
                active: formData.active ? 1 : 0,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                length: formData.length ? parseFloat(formData.length) : null
            };
            
            const response = await locationService.createLocation(dataToSend);
            
            if (response.status === 'success') {
                alert('Ubicación creada exitosamente');
                onLocationCreated(response.data);
                handleClose();
            }
        } catch (error) {
            console.error('Error al crear ubicación:', error);
            
            if (error.errors) {
                setErrors(error.errors);
            } else {
                alert('Error al crear la ubicación. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = () => {
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
        setErrors({});
        onClose();
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            Añadir Nueva Ubicación
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
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
                                    disabled={!formData.estate_id}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.city_id ? 'border-red-500' : ''
                                    } ${!formData.estate_id ? 'bg-gray-100' : ''}`}
                                >
                                    <option value="">
                                        {formData.estate_id ? 'Seleccionar ciudad...' : 'Primero selecciona un estado'}
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
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
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