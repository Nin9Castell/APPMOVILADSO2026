/**
 * Pantalla de cuenta pestaña 1
 * pantalla principal Tienda muestra el catalogo de productos
 * con un banner hero tarjetas de caracteristicas buscador de texto
 * chips de categorias lista de productos a 2 columnas paginacion y un modal de detalle de producto
 */

/** importar componentes de React native para construir la pantalla: 
 * hooks de react:
 * useEffect ejecuta el codigo al montar el componente o cuando cambian las dependencias
 * useMemo memoriza valores calculados para evitar recalculos inecesarios
 * useState maneja variables de estado local
 */


// manejo de variables de estdo local
import { useState, useEffect, useMemo } from 'react';
//importar componentes
//Dimensions obtiene al ancho y alto de la pantalla para hacer diseños responsivos
//flatlist lista optimizada con virtializacion para mostrar grandes cantidades de datos
//modal moestrar detalles de contenido en ventana emergente

import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, Pressable, Image, RefreshControl, ScrollView, StyleSheet, TextInput, View } from "react-native";

// Ionicons libera de icono vectoriales para react native
import { Ionicons } from "@expo/vector-icons";
//CatalogoService servicio que hace las llamadas HTTP (API) del backend para productos y categorias
import catalogoService from "../../scr/services/catalogoService";
//themedText : texto q aplica colores colores del tema del dispositivo de manera automatica claro u oscuro
import { ThemedText } from '@/components/themed-text';
//themedView : color de fonde automatico segun el tema del dispositivo
import { ThemedView } from '@/components/themed-View';
//useCarrito hook del context del carrito para agregar productos
import { useCarrito } from '../../scr/context/CarritoContext';

/**
 * Tipo carrito CTX
 * describe los campos que se usan de useCarrito en pantalla
 */

type CarritoCtx = {
    //agregarProducto: agrega producto al carrito con la cantidad indicada
    agregarProducto: (producto: unknown, cantidad: number) => Promise<void>;
    // totalItems numero total de items en el carrito
    totalItems: number;
};

/**
 * Contantes globales
 * 
 * 
 */
//
const {width: SCREEN_WIDTH} = Dimensions.get('window');
//Card_gap espacio horizontal entre las 2 columanos de la tarjeta de producto
const CARD_GAP = 10;
//Card_width ancho de cada tarjera alculando para que quepan exactamente 2 por fila 
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) /2;
//Items por pagina
const ITEMS_POR_PAGINA = 15;

const FEATURES = [
  { icon: 'cube-outline', title: 'Envío Rápido', desc: 'Recibe en tu hogar', color: '#6366f1', bg: '#eef2ff' },
  { icon: 'shield-checkmark', title: 'Compra Segura', desc: 'Datos protegidos', color: '#10b981', bg: '#d1fae5' },
  { icon: 'headset', title: 'Atención 24/7', desc: 'Siempre disponibles', color: '#06b6d4', bg: '#cffafe' },
] as const;

/**
 * 
 */

export default function HomeScreen() {
    //extrae las funciones del carrito necesarias para la pantalla
    const { agregarProducto, totalItems } = useCarrito() as CarritoCtx;

    /**
     * Estado de datos
     * productos lista completa de productos traida del backend
     */
    const [productos, Setproductos] = useState<any[]>([]);
    // categoria lista de categorias traido del backend
    const [categoria, SetCategoria] = useState<any[]>([]);

    //Estados de UI
    //loading true mientras cargan los datos por primera vez.
    const [loading, setLoading] = useState(true);
    //refreshing true mientras el usuario hace pull to refresh 
    const [refreshing, setRefreshing] = useState(false);
    //error mensaje de error si falla la carga
    const [error, setError] = useState('');
    //busqueda texto de campo de busqueda filtra productos en tiempo real
    const [busqueda, setBusqueda] = useState('');
    //categoriaActiva id de la categoria seleccionada o all para ver todas
    const [categoriaActiva, setCategoriaActiva] = useState<any>('all');
    //productoDetalle producto seleccionado para ver el modal
    const [productoDetalle, setProductoDetalle] = useState<any>(null);
    //paginaActual numero de la pagina activa para paginacion empieza en 1
    const [paginaActual, setPaginaActual] = useState(1);
    //ITEMS_POR_PAGINA numero de productos por pagina
    const ITEMS_POR_PAGINA = 15;

    
}


