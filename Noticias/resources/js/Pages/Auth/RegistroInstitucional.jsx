import React, { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import InputError from "@/Components/ui/InputError";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/ui/TextInput";
import Textarea from "@/Components/ui/Textarea";
import Checkbox from "@/Components/ui/Checkbox";
import PrimaryButton from "@/Components/ui/PrimaryButton";
import SecondaryButton from "@/Components/ui/SecondaryButton";
import Notification from "@/Components/ui/Notification";
import VerificationModal from "@/Components/ui/VerificationModal";

export default function RegistroInstitucional({
    institucion,
    institucionId = "",
    institucionesList = [],
    errors: pageErrors = {},
    success: pageSuccess = null,
    error: pageError = null,
    show_verification_modal = false,
    registered_email = null,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const totalSteps = 3;
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [notification, setNotification] = useState({
        message: pageSuccess || pageError || "",
        type: pageSuccess ? "success" : pageError ? "error" : "",
        visible: !!(pageSuccess || pageError),
    });

    // Estados para validación frontend
    const [formErrors, setFormErrors] = useState({});
    const [validationTimer, setValidationTimer] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(
        show_verification_modal
    );

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
        institucion_id: institucionId || "",
        descripcion: "",
        nombre_responsable: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: registered_email || "",
        telefono: "",
        password: "",
        password_confirmation: "",
        terms: false,
        // Nuevos campos para la tabla persons
        birth_date: "", // Fecha de nacimiento
        gender_id: "1", // ID de género (por defecto 1 para masculino)
    });

    // Definir instituciones como una lista de respaldo o usar la recibida
    const instituciones =
        institucionesList.length > 0
            ? institucionesList
            : [
                  {
                      id: "UPSRJ",
                      nombre: "Universidad Politécnica de San Rosa Jáuregui",
                  },
                  { id: "UPQ", nombre: "Universidad Politécnica de Querétaro" },
                  {
                      id: "SEDEQ",
                      nombre: "SEDEQ. Coordinación de Educación Superior",
                  },
                  {
                      id: "UNAQ",
                      nombre: "Universidad Nacional de Aeronáutica del Estado de Querétaro",
                  },
                  {
                      id: "UTEQ",
                      nombre: "Universidad Tecnológica del Estado de Querétaro",
                  },
                  {
                      id: "UTC",
                      nombre: "Universidad Tecnológica de corregidora",
                  },
                  {
                      id: "UTSJR",
                      nombre: "Universidad Tecnológica de San Juan del Río",
                  },
                  { id: "UAQ", nombre: "Universidad Autónoma de Querétaro" },
                  { id: "TECNM", nombre: "Tecnológico Nacional de México" },
                  {
                      id: "ENES",
                      nombre: "Escuela Nacional de Estudios Superiores campus Juriquilla",
                  },
                  { id: "OTRO", nombre: "Otra institución o empresa" },
              ];

    // Funciones de validación frontend
    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        if (!phone) return true; // Si no hay teléfono (es opcional)
        const digitsOnly = phone.replace(/\D/g, "");
        return digitsOnly.length === 10;
    };

    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        return password.length >= 8 && hasLetter && hasNumber;
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return 0;

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "nombre_empresa":
                if (!value) error = "El nombre de la empresa es obligatorio";
                break;
            case "nombre_responsable":
                if (!value) error = "El nombre del responsable es obligatorio";
                break;
            case "apellido_paterno":
                if (!value) error = "El apellido paterno es obligatorio";
                break;
            case "email":
                if (!value) {
                    error = "El correo electrónico es obligatorio";
                } else if (!validateEmail(value)) {
                    error = "El formato del correo electrónico no es válido";
                }
                break;
            case "telefono":
                if (value && !validatePhone(value)) {
                    error = "El número telefónico debe tener 10 dígitos";
                }
                break;
            case "password":
                if (!value) {
                    error = "La contraseña es obligatoria";
                } else if (value.length < 8) {
                    error = "La contraseña debe tener al menos 8 caracteres";
                } else if (!validatePassword(value)) {
                    error =
                        "La contraseña debe incluir al menos una letra y un número";
                }
                break;
            case "password_confirmation":
                if (value !== data.password) {
                    error = "Las contraseñas no coinciden";
                }
                break;
            case "terms":
                if (!value) {
                    error = "Debes aceptar los términos y condiciones";
                }
                break;
            default:
                break;
        }

        return error;
    };

    // Validar el paso 1
    useEffect(() => {
        const errors = {};

        // Solo validar los campos del paso actual
        if (data.nombre_empresa === "") {
            errors.nombre_empresa = "El nombre de la empresa es obligatorio";
        }

        if (data.nombre_responsable === "") {
            errors.nombre_responsable =
                "El nombre del responsable es obligatorio";
        }

        if (data.apellido_paterno === "") {
            errors.apellido_paterno = "El apellido paterno es obligatorio";
        }

        if (data.email === "") {
            errors.email = "El correo electrónico es obligatorio";
        } else if (!validateEmail(data.email)) {
            errors.email = "El formato del correo electrónico no es válido";
        }

        if (data.telefono && !validatePhone(data.telefono)) {
            errors.telefono = "El número telefónico debe tener 10 dígitos";
        }

        // Validación para los nuevos campos
        if (!data.birth_date) {
            errors.birth_date = "La fecha de nacimiento es obligatoria";
        }

        if (!data.gender_id) {
            errors.gender_id = "Debes seleccionar un género";
        }

        setFormErrors((prev) => ({ ...prev, ...errors }));

        if (data.nombre_empresa && !errors.nombre_empresa) {
            setPaso1Valido(true);
        } else {
            setPaso1Valido(false);
        }

        if (
            data.nombre_responsable &&
            data.apellido_paterno &&
            data.email &&
            validateEmail(data.email) &&
            (data.telefono === "" || validatePhone(data.telefono)) &&
            data.birth_date &&
            data.gender_id
        ) {
            setPaso2Valido(true);
        } else {
            setPaso2Valido(false);
        }
    }, [
        data.nombre_empresa,
        data.nombre_responsable,
        data.apellido_paterno,
        data.email,
        data.telefono,
        data.birth_date,
        data.gender_id,
    ]);

    // Validar el paso 2
    useEffect(() => {
        const errors = {};

        if (data.nombre_responsable === "") {
            errors.nombre_responsable =
                "El nombre del responsable es obligatorio";
        }

        if (data.apellido_paterno === "") {
            errors.apellido_paterno = "El apellido paterno es obligatorio";
        }

        if (data.email === "") {
            errors.email = "El correo electrónico es obligatorio";
        } else if (!validateEmail(data.email)) {
            errors.email = "El formato del correo electrónico no es válido";
        }

        if (data.telefono && !validatePhone(data.telefono)) {
            errors.telefono = "El número telefónico debe tener 10 dígitos";
        }

        setFormErrors((prev) => ({ ...prev, ...errors }));

        if (
            data.nombre_responsable &&
            data.apellido_paterno &&
            data.email &&
            validateEmail(data.email) &&
            (data.telefono === "" || validatePhone(data.telefono))
        ) {
            setPaso2Valido(true);
        } else {
            setPaso2Valido(false);
        }
    }, [
        data.nombre_responsable,
        data.apellido_paterno,
        data.email,
        data.telefono,
    ]);

    // Validar el paso 3
    useEffect(() => {
        const errors = {};

        if (data.password === "") {
            errors.password = "La contraseña es obligatoria";
        } else if (data.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        } else if (!validatePassword(data.password)) {
            errors.password =
                "La contraseña debe incluir al menos una letra y un número";
        }

        if (data.password !== data.password_confirmation) {
            errors.password_confirmation = "Las contraseñas no coinciden";
        }

        if (!data.terms) {
            errors.terms = "Debes aceptar los términos y condiciones";
        }

        setFormErrors((prev) => ({ ...prev, ...errors }));

        if (
            data.password &&
            data.password_confirmation &&
            data.terms &&
            data.password === data.password_confirmation &&
            validatePassword(data.password)
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

    // Manejar errores del backend
    useEffect(() => {
        const errorMessages = Object.values(pageErrors).flat();
        if (errorMessages.length > 0) {
            setNotification({
                message: errorMessages.join(", "),
                type: "error",
                visible: true,
            });
        }
    }, [pageErrors]);

    const onHandleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setData(name, newValue);

        // Validación en tiempo real con pequeño delay
        if (validationTimer) {
            clearTimeout(validationTimer);
        }

        setValidationTimer(
            setTimeout(() => {
                const error = validateField(name, newValue);
                setFormErrors((prev) => ({
                    ...prev,
                    [name]: error,
                }));
            }, 300)
        );
    };

    const handleInstitucionSelect = (event) => {
        const selectedId = event.target.value;
        setData("institucion_id", selectedId);

        if (selectedId !== "OTRO") {
            const selectedInst = instituciones.find(
                (inst) => inst.id === selectedId
            );
            if (selectedInst) {
                setData("nombre_empresa", selectedInst.nombre);
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

    const formatPhoneNumber = (value) => {
        // Eliminar todos los caracteres no numéricos
        const cleaned = value.replace(/\D/g, "");

        // Limitar a 10 dígitos
        const truncated = cleaned.substring(0, 10);

        // Formatear como (XXX) XXX-XXXX si hay suficientes dígitos
        if (truncated.length >= 10) {
            return `(${truncated.substring(0, 3)}) ${truncated.substring(
                3,
                6
            )}-${truncated.substring(6, 10)}`;
        } else if (truncated.length >= 6) {
            return `(${truncated.substring(0, 3)}) ${truncated.substring(
                3,
                6
            )}-${truncated.substring(6)}`;
        } else if (truncated.length >= 3) {
            return `(${truncated.substring(0, 3)}) ${truncated.substring(3)}`;
        }

        return truncated;
    };

    // En handlePhoneChange
    const handlePhoneChange = (e) => {
        const cleaned = e.target.value.replace(/\D/g, "");
        // Limitar a 10 dígitos
        const limited = cleaned.substring(0, 10);
        setData("telefono", limited);
    };

    // Reemplazar la función submit existente con esta versión corregida
    const submit = (e) => {
        e.preventDefault();

        // Preparar los datos del formulario
        const formData = {
            ...data,
            telefono: data.telefono ? data.telefono.replace(/\D/g, "") : "",
            age: calculateAge(data.birth_date),
        };

        post(route("registro.institucional.store"), formData, {
            onSuccess: (response) => {
                console.log("Respuesta de registro exitoso:", response);

                // Alternativa: redireccionar a la página de verificación
                window.location.href =
                    route("verification.notice") +
                    "?email=" +
                    encodeURIComponent(data.email);
            },
            onError: (errors) => {
                console.error("Errores de respuesta:", errors);
                const errorMessages = Object.values(errors).flat();
                setNotification({
                    message: errorMessages.join(", "),
                    type: "error",
                    visible: true,
                });
            },
        });
    };

    if (registroExitoso) {
        return (
            <LoginLayout title="Registro Exitoso">
                {notification.visible && (
                    <div
                        className={`fixed top-0 right-0 m-8 p-4 rounded-lg shadow-lg ${
                            notification.type === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        <div className="flex items-center">
                            {notification.type === "success" ? (
                                <svg
                                    className="h-6 w-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                            <span>{notification.message}</span>
                            <button
                                onClick={() =>
                                    setNotification({
                                        ...notification,
                                        visible: false,
                                    })
                                }
                                className="ml-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¡Registro Completado!
                    </h2>
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
                            Tu cuenta ha sido creada exitosamente. Serás
                            redirigido al inicio de sesión en unos momentos.
                        </p>
                    </div>
                    <Link
                        href={route("login")}
                        className="inline-flex items-center px-4 py-2 mt-6 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Ir al inicio de sesión
                    </Link>
                </div>
            </LoginLayout>
        );
    }

    return (
        <LoginLayout title="Registro Institucional">
            {notification.visible && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() =>
                        setNotification({ ...notification, visible: false })
                    }
                />
            )}

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
                                        name="institucion_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        onChange={handleInstitucionSelect}
                                        value={data.institucion_id}
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
                                        message={
                                            formErrors.nombre_empresa ||
                                            errors.nombre_empresa
                                        }
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
                                        message={
                                            formErrors.descripcion ||
                                            errors.descripcion
                                        }
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
                                {/* Nombre del responsable - Ya existente */}
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
                                        message={
                                            formErrors.nombre_responsable ||
                                            errors.nombre_responsable
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Apellido paterno - Ya existente */}
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
                                        message={
                                            formErrors.apellido_paterno ||
                                            errors.apellido_paterno
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Apellido materno - Ya existente */}
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
                                        message={
                                            formErrors.apellido_materno ||
                                            errors.apellido_materno
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Fecha de nacimiento - NUEVO */}
                                <div>
                                    <InputLabel
                                        forInput="birth_date"
                                        value="Fecha de nacimiento"
                                        required
                                    />
                                    <TextInput
                                        id="birth_date"
                                        name="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        className="mt-1 block w-full"
                                        handleChange={onHandleChange}
                                        required
                                    />
                                    <InputError
                                        message={
                                            formErrors.birth_date ||
                                            errors.birth_date
                                        }
                                        className="mt-2"
                                    />
                                    {data.birth_date && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Edad calculada:{" "}
                                            {calculateAge(data.birth_date)} años
                                        </p>
                                    )}
                                </div>

                                {/* Género - NUEVO */}
                                <div>
                                    <InputLabel
                                        forInput="gender_id"
                                        value="Género"
                                        required
                                    />
                                    <select
                                        id="gender_id"
                                        name="gender_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        value={data.gender_id}
                                        onChange={onHandleChange}
                                        required
                                    >
                                        <option value="1">Masculino</option>
                                        <option value="2">Femenino</option>
                                        <option value="3">Otro</option>
                                    </select>
                                    <InputError
                                        message={
                                            formErrors.gender_id ||
                                            errors.gender_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email - Ya existente */}
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
                                        message={
                                            formErrors.email || errors.email
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Teléfono - Ya existente pero modificado */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        forInput="telefono"
                                        value="Teléfono (10 dígitos)"
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
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="10"
                                            value={data.telefono.replace(
                                                /\D/g,
                                                ""
                                            )}
                                            className="block w-full md:w-1/2 pl-10"
                                            autoComplete="tel"
                                            placeholder="1234567890"
                                            handleChange={(e) => {
                                                const cleaned =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                setData("telefono", cleaned);
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Ingresa un número telefónico de 10
                                        dígitos (solo números).
                                    </p>
                                    <InputError
                                        message={
                                            formErrors.telefono ||
                                            errors.telefono
                                        }
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
                                            formErrors.password ||
                                            errors.password
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
                                            formErrors.password_confirmation ||
                                            errors.password_confirmation
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowVerificationModal(true)}
                                className="bg-blue-500 text-white p-2 mt-4 rounded"
                            >
                                Abrir Modal de Verificación (Prueba)
                            </button>

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
                                    message={formErrors.terms || errors.terms}
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
                                    disabled={!paso3Valido || processing}
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
            {/* Modal de verificación */}
            {showVerificationModal && (
                <VerificationModal
                    isOpen={true} // Forzar a que esté abierto para probar
                    email={data.email}
                    onClose={() => {
                        console.log("Cerrando modal");
                        setShowVerificationModal(false);
                    }}
                    onSuccess={() => {
                        console.log("Éxito en la verificación");
                        setShowVerificationModal(false);
                        window.location.href = route("login");
                    }}
                />
            )}
        </LoginLayout>
    );
}
