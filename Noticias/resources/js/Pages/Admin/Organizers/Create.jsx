import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminOrganizerService from '../../../Services/adminOrganizerService';

const OrganizersCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
        web_site: '',
        social_media: '',
        direction: '',
        city: '',
        active: true
    });
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Limpiar error del campo
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const dataToSend = { ...formData };
            if (logo) {
                dataToSend.logo = logo;
            }

            const response = await adminOrganizerService.createOrganizer(dataToSend);
            
            if (response.status === 'success') {
                alert('Organizador creado exitosamente');
                router.visit('/admin/organizers');
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert('Error al crear el organizador');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Crear Nuevo Organizador</h1>
                <Link
                    href="/admin/organizers"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Volver
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información básica */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sitio Web
                            </label>
                            <input
                                type="url"
                                name="web_site"
                                value={formData.web_site}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.web_site ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.web_site && (
                                <p className="text-red-500 text-xs mt-1">{errors.web_site[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Redes Sociales
                            </label>
                            <input
                                type="text"
                                name="social_media"
                                value={formData.social_media}
                                onChange={handleChange}
                                placeholder="@usuario o enlaces"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.social_media ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.social_media && (
                                <p className="text-red-500 text-xs mt-1">{errors.social_media[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">{errors.city[0]}</p>
                            )}
                        </div>

                        {/* Dirección - campo completo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.direction ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.direction && (
                                <p className="text-red-500 text-xs mt-1">{errors.direction[0]}</p>
                            )}
                        </div>

                        {/* Descripción - campo completo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
                            )}
                        </div>

                        {/* Logo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo
                            </label>
                            <div className="flex items-center space-x-4">
                                {logoPreview && (
                                    <img
                                        src={logoPreview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded-full"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="flex-1"
                                />
                            </div>
                            {errors.logo && (
                                <p className="text-red-500 text-xs mt-1">{errors.logo[0]}</p>
                            )}
                        </div>

                        {/* Estado activo */}
                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Organizador activo
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <Link
                            href="/admin/organizers"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`font-bold py-2 px-4 rounded text-white ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Guardando...' : 'Guardar Organizador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

OrganizersCreate.layout = page => <AdminLayout>{page}</AdminLayout>;

export default OrganizersCreate;