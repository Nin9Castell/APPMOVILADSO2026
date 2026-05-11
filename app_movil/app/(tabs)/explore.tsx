/**
 * Pantalla de cuenta pestaña 3 tiene 2 metodos
 * no autenticado muestra formulario login y registro
 * autenticado muestra perfil de usuario con opciones de editar datos
 * acceder al panel admin/aux ver pedidos segun rol
 */

/** importar componentes de React native para construir la pantalla: 
 * ActivityIndicator, spiner carga circular
 * alert, dialogos emergentes nativos del sistema
 * Image, muestra las imagenes
 * Pressable, area tactil
 * ScrollView, contenedor con scroll vertical
 * StyleSheet, crea los estilos de forma optimizada
 * Text, muestra texto plano en pantalla
 * View, contenedor generico equivale a un div en html y css
 * 
 */
// manejo de variables de estdo local
import { useState } from 'react';
//importar componentes 
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { router } from "expo-router";
// Ionicons libera de icono vectoriales para react native
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../scr/context/AuthContext';
//themedText : texto q aplica colores colores del tema del dispositivo de manera automatica claro u oscuro
import { themedText } from '@/components/themed-text';
//themedView : color de fonde automatico segun el tema del dispositivo
import { themedView } from '@/components/themed-View';

/**
 * AuthCtx define la forma del objeto devuelto por useAuth es necesario
 * porque AuthContext.js esta en javasrcript y no en typescript y el copilador no los reconoce
 */
type AuthCtx = {
    //User datos del usario autenticado, null si no inicio sesion
    user: { nombre?: string, email?: string, rol?: string } | null;
    //isAuthenticated: true si hay sesion activa
    isAuthenticated: boolean;
    // isLoading: true mientras se verifica si hay sesion guardada al abrir la app
    isLoading: boolean;
    //login: funcion que recibe el email y contraseña lanza error si falla
    login: (email: string, password: string) => Promise<unknown>;
    //register funcion que registra un nuevo usuario lanza error si falla
    register: (data: {nombre: string, apellido: string, email: string, password: string, telefono?: string, direccion?: string} ) => Promise<unknown>;
    //logout: funcio de cerrar la sesion del usuario
    logout: () => Promise<void>;
    //updatePerfil: funcion que actualiza los datos del usuario
    updatePerfil: (data: {nombre?: string, email?: string, password?: string, }) => Promise<unknown>;
};

//routerPush navega apilando la nueva pantalla permite volver atras con la opcion de atras
//se usa as unkonwn para evitar errores de typescript con contextos router

const routerPush = (path: string) => (router as unknown as { push: (p: string) => void }).push(path);

// componente principal del tad de cuenta

export default  function TabTwoScreen() {
    const { user, isAuthenticated, logout, login, register, isLoading, updatePerfil } = useAuth() as AuthCtx;
    // estado del formulario login y registro
    //isRegisterMode true mostrar formulario de registro false mostrar login
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    //Campos del formulario de registro y login
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    //loadingSubmit true mientras se procesa el login o register evita el doble envio
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    // mensaje de retroalimentaacion al usuario (error o exito)
    const [ErrorMessage, setErrorMessage] = useState('');
    const [succesMessage, setSuccesMessage] = useState('');

    // Estado de edicion de perfil
    //editMode true mostrar campos editables false modo lectura
    const [editMode, setEditMode] = useState(false);

    //Campos editables del perfil
    const [editNombre, setEditNombre] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    //savingPerfil true mientras se guarda el perfil en backend
    const [savingPerfil, setSavingPerfil] = useState(false);
    // mensaje del formulario de edicion de perfil
    const [perfilError, setPerfilError] = useState('');
    const [perfilSucces, setPerfilSucces] = useState('');

    // funcion resetFeedback
    //Limpia los mensajes de error y exito del formulario login y registro
    const resetFeedback = () => {
        setErrorMessage('');
        setSuccesMessage('');
    };

    // Funcion: handleLogout
    //cierra la sesion y resetea todos los campos del formulario para que
    // la pantalla quede limpia cuando el usuario vuelva a ver formulario 
    const handleLogout = async () => {
        await logout(); // llama el contexto de cerrar sesion
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNombre('');
        setApellido('');
        setTelefono('');
        setDireccion('');
        setIsRegisterMode(false);
        setErrorMessage('');
        setSuccesMessage('');
    };

    // funcion handleSubmit
    // valida y envia el formulario de login o registro segun el modo activo
    const handleSubmit = async () => {
        resetFeedback(); //limpia mensajes anterioires de validar

        if (isRegisterMode) {
            //validaciones de registro
            //todos los campos marcados con * son obligatorios
            if (!nombre || !apellido || !email || !password || !confirmPassword || !telefono || !direccion) {
                setErrorMessage('Completa todos los campos obligatorio *.');
                return;
            }

            // las contraseñas deben coincidir
            if (password !== confirmPassword) {
                setErrorMessage('Las contraseñas no coinciden.');
                return;
            }

            // las contraseñas deben tener minimo 6 caracteres
            if (password.length < 6) {
                setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            // Telefono si se proporciona debe ser colombiano (10 digitos y debe empezar con 3)
            if (telefono && !/^3\d{9}$/.test(telefono)) {
                setErrorMessage('Telefono invalido: 10 digitos iniciando con 3');
                return;
            }
        } else {
            // validaciones de login
            if (!email || !password) {
                setErrorMessage('Ingresa tu correo y contraseña');
                return;
            }
        }

        // activa el spiner y bloquea el boton para evitar multiples envios
        setLoadingSubmit(true);
        try {
            if (isRegisterMode) {
                // LLama a register() del contexto con los datos del formulario
                // el operador spread condicional ... solo incluye telefono/direccion si no estan vacios
                await register({ nombre, apellido, email, password, 
                    ...(telefono ? { telefono } : {}),
                    ...(direccion ? { direccion } : {}),
                });
                setSuccesMessage('Registro exitoso! ahora inicia sesion');
                setIsRegisterMode(false); //vuelve al modo login tras el registro exitoso
                //limpia los campos que no se comparten en el formulario login
                setPassword('');
                setConfirmPassword('');
                setNombre('');
                setApellido('');
                setTelefono('');
                setDireccion('');
            } else {
                // llama a login del conteto con el email y contraseña
                await login({ email, password });
                setSuccesMessage('sesion iniciado axitosamente')
            }
        } catch (error: unknown) {
            // si la backend se devuelve error muestra su mensaje. sino muestra uno generico
            setErrorMessage((error as { message?: string})?.message || 'No fue posible completar la accion');
        } finally {
            // siempre desactiva el spniner al terminar exito y error
            setLoadingSubmit(false);
        }
    };

    /**
     * funcion handleGuardarPerfil
     * valida y envia los cambio al perfil del usuario autenticado
     */

    const handleGuardarPerfil = async () => {
        setPerfilError('');
        setPerfilSucces('');
        //al menos uno de los 3 campos debe estar modificado
        if (!editNombre.trim() && !editEmail.trim() && !editPassword.trim()) {
            setPerfilError('modifica al menos un campo');
            return;
        }
    }
}