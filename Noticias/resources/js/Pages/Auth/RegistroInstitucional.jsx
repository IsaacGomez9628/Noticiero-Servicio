import React, { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function RegistroInstitucional({ institucion }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const totalSteps = 3;
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Estados para validar cada paso
    const [paso1Valido, setPaso1Valido] = useState(false);
    const [paso2Valido, setPaso2Valido] = useState(false);
    const [paso3Valido, setPaso3Valido] = useState(false);

    // Pre-rellenar el nombre de la empresa si viene de la selección previa
    const institucionNombre = institucion
        ? typeof institucion === "string"
            ? institucion
            : ""
        : "";

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre_empresa: institucionNombre,
        descripcion: "",
        nombre_responsable: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        telefono: "",
        password: "",
        password_confirmation: "",
        terms: false,
    });

    // Lista de instituciones educativas
    const instituciones = [
        { id: "UPSRJ", nombre: "Universidad Politécnica de San Rosa Jáuregui" },
        { id: "UPQ", nombre: "Universidad Politécnica de Querétaro" },
        { id: "SEDEQ", nombre: "SEDEQ. Coordinación de Educación Superior" },
        {
            id: "UNAQ",
            nombre: "Universidad Nacional de Aeronáutica del Estado de Querétaro",
        },
        {
            id: "UTEQ",
            nombre: "Universidad Tecnológica del Estado de Querétaro",
        },
        { id: "UTC", nombre: "Universidad Tecnológica de corregidora" },
        { id: "UTSJR", nombre: "Universidad Tecnológica de San Juan del Río" },
        { id: "UAQ", nombre: "Universidad Autónoma de Querétaro" },
        { id: "TECNM", nombre: "Tecnológico Nacional de México" },
        {
            id: "ENES",
            nombre: "Escuela Nacional de Estudios Superiores campus Juriquilla",
        },
        { id: "OTRO", nombre: "Otra institución o empresa" },
    ];

    // Validar el paso 1
    useEffect(() => {
        if (data.nombre_empresa) {
            setPaso1Valido(true);
        } else {
            setPaso1Valido(false);
        }
    }, [data.nombre_empresa]);

    // Validar el paso 2
    useEffect(() => {
        if (data.nombre_responsable && data.apellido_paterno && data.email) {
            setPaso2Valido(true);
        } else {
            setPaso2Valido(false);
        }
    }, [data.nombre_responsable, data.apellido_paterno, data.email]);

    // Función para validar que la contraseña tenga al menos 8 caracteres, letras y números
    const validarPassword = (password) => {
        const regexLetras = /[a-zA-Z]/;
        const regexNumeros = /[0-9]/;

        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres";
        }

        if (!regexLetras.test(password)) {
            return "La contraseña debe incluir al menos una letra";
        }

        if (!regexNumeros.test(password)) {
            return "La contraseña debe incluir al menos un número";
        }

        return "";
    };

    // Validar el paso 3
    useEffect(() => {
        const passwordValidationError = validarPassword(data.password);
        setPasswordError(passwordValidationError);

        if (
            data.password &&
            data.password_confirmation &&
            data.terms &&
            data.password === data.password_confirmation &&
            passwordValidationError === ""
        ) {
            setPaso3Valido(true);
        } else {
            setPaso3Valido(false);
        }
    }, [data.password, data.password_confirmation, data.terms]);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const onHandleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleInstitucionSelect = (event) => {
        const selectedId = event.target.value;
        if (selectedId !== "OTRO") {
            const selected = instituciones.find(
                (inst) => inst.id === selectedId
            );
            if (selected) {
                setData("nombre_empresa", selected.nombre);
            }
        } else {
            setData("nombre_empresa", "");
        }
    };

    const nextStep = () => {
        if (
            (currentStep === 1 && paso1Valido) ||
            (currentStep === 2 && paso2Valido) ||
            (currentStep === 3 && paso3Valido)
        ) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const submit = (e) => {
        e.preventDefault();

        // Validar la contraseña antes de enviar
        const passwordValidationError = validarPassword(data.password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        post(route("registro.institucional.store"), {
            onSuccess: () => {
                reset();
                window.location.href = route("verification.notice");
            },
        });
    };

    if (registroExitoso) {
        return (
            <LoginLayout title="Registro Exitoso">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline h-4 w-4 mr-1 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Después de registrarte, recibirás un código de
                            verificación en tu correo electrónico que deberás
                            ingresar para activar tu cuenta.
                        </p>
                    </div>
                    <Link
                        href={route("verification.notice")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Verificar mi correo
                    </Link>
                </div>
            </LoginLayout>
        );
    }

    return (
        <LoginLayout title="Registro Institucional">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
                {/* Barra de progreso con pasos más juntos */}
                <div className="px-8 pt-8">
                    <div className="flex justify-center mb-4">
                        {[...Array(totalSteps)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                        i + 1 === currentStep
                                            ? "bg-blue-600 text-white"
                                            : i + 1 < currentStep
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {i + 1 < currentStep ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                {i < totalSteps - 1 && (
                                    <div
                                        className={`h-1 ${
                                            i + 1 < currentStep
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                        }`}
                                        style={{ width: "60px" }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center text-sm text-gray-600 mb-6 space-x-5">
                        <div className="text-center">Institución</div>
                        <div className="text-center">Responsable</div>
                        <div className="text-center">Cuenta</div>
                    </div>
                </div>

                <form onSubmit={submit} className="px-8 pb-8">
                    {/* Paso 1: Información de la institución */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Información de la Institución
                            </h3>

                            <div className="space-y-4">
                                {/* Selección de institución */}
                                <div>
                                    <InputLabel
                                        forInput="institucion_id"
                                        value="Selecciona tu institución"
                                    />
                                    <select
                                        id="institucion_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        onChange={handleInstitucionSelect}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            -- Selecciona una institución --
                                        </option>
                                        {instituciones.map((inst) => (
                                            <option
                                                key={inst.id}
                                                value={inst.id}
                                            >
                                                {inst.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nombre de la empresa/institución */}
                                <div>
                                    <InputLabel
                                        forInput="nombre_empresa"
                                        value="Nombre de la institución o empresa"
                                        required
                                    />
                                    <TextInput
                                        id="nombre_empresa"
                                        name="nombre_empresa"
                                        type="text"
                                        value={data.nombre_empresa}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        handleChange={onHandleChange}
                                        required
                                    />
                                    <InputError
                                        message={errors.nombre_empresa}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <InputLabel
                                        forInput="descripcion"
                                        value="Descripción"
                                    />
                                    <Textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={data.descripcion}
                                        className="mt-1 block w-full"
                                        handleChange={onHandleChange}
                                        rows={3}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Breve descripción de la institución o
                                        actividad principal.
                                    </p>
                                    <InputError
                                        message={errors.descripcion}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Datos del responsable */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Datos del Responsable
                            </h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nombre del responsable */}
                                <div>
                                    <InputLabel
                                        htmlFor="nombre_responsable"
                                        value="Nombres"
                                        required
                                    />
                                    <TextInput
                                        id="nombre_responsable"
                                        name="nombre_responsable"
                                        type="text"
                                        value={data.nombre_responsable}
                                        className="mt-1 block w-full"
                                        autoComplete="given-name"
                                        handleChange={onHandleChange}
                                        required
                                    />
                                    <InputError
                                        message={errors.nombre_responsable}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Apellido paterno */}
                                <div>
                                    <InputLabel
                                        forInput="apellido_paterno"
                                        value="Apellido paterno"
                                        required
                                    />
                                    <TextInput
                                        id="apellido_paterno"
                                        name="apellido_paterno"
                                        type="text"
                                        value={data.apellido_paterno}
                                        className="mt-1 block w-full"
                                        autoComplete="family-name"
                                        handleChange={onHandleChange}
                                        required
                                    />
                                    <InputError
                                        message={errors.apellido_paterno}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Apellido materno */}
                                <div>
                                    <InputLabel
                                        forInput="apellido_materno"
                                        value="Apellido materno"
                                    />
                                    <TextInput
                                        id="apellido_materno"
                                        name="apellido_materno"
                                        type="text"
                                        value={data.apellido_materno}
                                        className="mt-1 block w-full"
                                        handleChange={onHandleChange}
                                    />
                                    <InputError
                                        message={errors.apellido_materno}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <InputLabel
                                        forInput="email"
                                        value="Correo electrónico"
                                        required
                                    />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            className="block w-full pl-10"
                                            autoComplete="email"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Teléfono */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        forInput="telefono"
                                        value="Teléfono"
                                    />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="telefono"
                                            name="telefono"
                                            type="tel"
                                            value={data.telefono}
                                            className="block w-full md:w-1/2 pl-10"
                                            autoComplete="tel"
                                            placeholder="(123) 456-7890"
                                            handleChange={onHandleChange}
                                        />
                                    </div>
                                    <InputError
                                        message={errors.telefono}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Credenciales */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Credenciales de Acceso
                            </h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Contraseña */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        forInput="password"
                                        value="Contraseña"
                                        required
                                    />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password}
                                            className="block w-full pl-10 pr-10"
                                            autoComplete="new-password"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        La contraseña debe tener al menos 8
                                        caracteres, incluyendo letras y números.
                                    </p>
                                    <InputError
                                        message={
                                            errors.password || passwordError
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        forInput="password_confirmation"
                                        value="Confirmar contraseña"
                                        required
                                    />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            className="block w-full pl-10"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={
                                            errors.password_confirmation ||
                                            (data.password !==
                                                data.password_confirmation &&
                                            data.password_confirmation
                                                ? "Las contraseñas no coinciden"
                                                : "")
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Términos y condiciones */}
                            <div className="mt-8">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Checkbox
                                            id="terms"
                                            name="terms"
                                            checked={data.terms}
                                            onChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="terms"
                                            className="font-medium text-gray-700"
                                        >
                                            Acepto los{" "}
                                            <a
                                                href="#"
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                términos y condiciones
                                            </a>{" "}
                                            de uso.
                                        </label>
                                    </div>
                                </div>
                                <InputError
                                    message={errors.terms}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Botones de navegación */}
                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                        <div>
                            {currentStep > 1 && (
                                <SecondaryButton
                                    type="button"
                                    onClick={prevStep}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="-ml-0.5 mr-1 h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    Anterior
                                </SecondaryButton>
                            )}
                            {currentStep === 1 && (
                                <Link href={route("registro")}>
                                    <SecondaryButton type="button">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="-ml-0.5 mr-1 h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                            />
                                        </svg>
                                        Volver
                                    </SecondaryButton>
                                </Link>
                            )}
                        </div>

                        <div>
                            {currentStep < totalSteps && (
                                <PrimaryButton
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-3"
                                    disabled={
                                        (currentStep === 1 && !paso1Valido) ||
                                        (currentStep === 2 && !paso2Valido)
                                    }
                                >
                                    Siguiente
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-1 -mr-0.5 h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </PrimaryButton>
                            )}
                            {currentStep === totalSteps && (
                                <PrimaryButton
                                    className="ml-3"
                                    processing={processing}
                                    disabled={!paso3Valido}
                                >
                                    {processing
                                        ? "Procesando..."
                                        : "Registrar institución"}
                                </PrimaryButton>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Ya tienes una cuenta? */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href={route("login")}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </LoginLayout>
    );
}
