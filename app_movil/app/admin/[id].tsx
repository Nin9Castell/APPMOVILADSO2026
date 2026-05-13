/**
 * Este archivo y pantalla de detalle de un pedido especifico para el administrador
 * recibe el parametro dinamico id desde la url
 * consulta el backend para traer los datos del pedido
 * muestra los datos del cliente estado actual total fecha y lista productos
 * permite cambiar el estado del pedido pendiente -> enviado -> entregado o cancelar si esta en pendiente
 */

// manejo de variables de estdo local
import { useState, useEffect } from 'react';
//importar componentes
//Dimensions obtiene al ancho y alto de la pantalla para hacer diseños responsivos
//flatlist lista optimizada con virtializacion para mostrar grandes cantidades de datos
//modal moestrar detalles de contenido en ventana emergente

import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from "react-native";

// lee los parametros de la url para obtener el id del pedido
import { useLocalSearchParams } from "expo-router";
//themedText : texto q aplica colores colores del tema del dispositivo de manera automatica claro u oscuro
import { ThemedText } from '@/components/themed-text';
//cliente http axios con JWT
import apiClient from '../../scr/api/apiClient';

/**
 * TIPOS
 * representa en items de la lista de productos el pedido
 * todos los campos son opcionales ? porque el backend puede enviarlos todos 
 */
type Detalle ={
    producto?: { nombre?: string };//solo del los productos comprados
    cantidad?: number;
    precio?: number; //precio unitario del prducto
};

// representa el pedido completo tal como lo devuelve el backend
type Pedido = {
    _id: string;
    estado?: string;
    total?: number;
    createdAt?: string;
    usuario?: {
        nombre?: string;
        apellido?: string;
        email?: string;
    };
    detalles?: Detalle[]; //arreglo de productos incluidos en el pedido
};

/**
 * Componente principal
 * 
 */
export default function AdminPedidoDetalleScreen() {
    /**
     * parametros de ruta
     * useLocalSearchParams lee los segmoentos dinamicos de la url 
     * como el archivo se llama [id].txs el parametro se llama id es decir si un pedido se llama 38 el id es 38
     */

    const { id } = useLocalSearchParams <{ id: string }>();

    // estado local
    const [pedido, setPedido] = useState <Pedido | null>(null);// Datos del pedido null = aun no cargado
    const [loading, setLoading] = useState(true);// activo mientras se hace una peticion api
    const [errorMessage, setErrorMessage] = useState(''); // mensaje de error
    const [cambiando, setCambiando] = useState(false); // si se cambio el estado del pedido

    /**
     * funcion fetchPedido
     * llama el endpoint get/admin/pedidos/:id y guarda el resultado en estado
     * se usa tanto en el montaje inicial useEffect como despues de cambiar estado
     */

    const fetchPedido = async () => {
        setLoading(true); // muestra el spinner
        setErrorMessage('');
        try {
            //peticion get autenticada el tojen JWT lo agrega el apiClient automaticamente
            const res = await apiClient.get(`/admin/pedidos/${id}`);
            // la respuesta tiene estructura { data : data: { pedido...
            // el operador ? evita errores si algun nivel es undefined
            setPedido(res.data?.data?.pedido || null);
        } catch (error: unknown) {
            // si la peticion falla guarda el mensaje de error para mostrarlo
            setErrorMessage((error as { message: string }).message || 'no se pudo cargar el pedido');
        } finally {
            setLoading(false); //oculta el spinner siempre q haya un error o no
        }
    };

    /**
     * efecto carga inicial
     * se ejecuta cada vez q cambie el parametro id de la url
     * en la practica solo se ejecuta el montar porque no se navega entre ids diferentes
     */

    useEffect(() => {
        fetchPedido();
        /**
         * eslint-disable-next-line react-hooks/exhaustive-deps
         * fechPedido no se incluye en el array de dependencias para evitar bucles infinitos
         * el lint warning se suprime con el comentario de arriba
         */
    }, [id]);

    /**
     * funcion cambiar estado
     * envia un PACH a la api para actualizar el estado del pedido
     * parametro: nuevoEstado el estado al que se requiere transicionar
     * enviado, entregado o cancelado
     */
    const cambiarEstado = async (nuevoEstado: string) => {
        setCambiando(true); //bloquea los botones para evitar clicks multiples
        try {
            //PATCH /admin/pedidos/:id/estado
            await apiClient.patch(`/admin/pedidos/${id}/estado`, { estado: nuevoEstado });
        } catch {
            //si falla muestra un alert nativo con el mensaje de error
            Alert.alert('Error', 'No se pudo cambiar el estado del pedido');
        } finally {
            setCambiando(false); //desbloquea los botones
        }
    };

}