/**
 * Pantalla del carrito de compras y sus respectivas gestiones no requiere que este autenticado para hacer compras
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

import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
// Ionicons libera de icono vectoriales para react native
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../scr/context/AuthContext';
import { useCarrito } from "../../scr/context/CarritoContext";

// carritoCtx define la forma de los datos que devuelve usecarrito
//TypeScript necesita esto porque CarritoContext.js esta en javaScript
type CarritoCtx = {
    //items lista de productos en el carrito
    items: { id: string, nombre?: string, precio?: number, cantidad: number, imagen?: string }[];
    // total suma total en pesos colombianos de todos los items
    total: number;
    //Total items numero total de items del carrito
    totalItems: number;
    //loading true mientras el contexto carga los datos iniciales
    loading: boolean;
    //cambiar cantidad actualiza la cantidad de un producto
    cambiarCantidad: (id: string, cantidad: number) => Promise<void>;
    //eliminar item elimina un producto del carrito
    eliminarItem: (id: string) => Promise<void>;
    //vaciar carrito elimina todos los productos del carrito
    vaciarCarrito: () => Promise<void>;
};

// HELPERS de navegacion
//expo Router tipifica touter de forma extricta y expone .push/replace
//Directamente en typescript, se usa as unknown as .... para forzar el tipo
// y poder llamar a las funciones de navegacion sin errores de copilador

//routerPush navega a una nueva pantalla apilandola es decir se puede volver atras
const routerPush = (path: string) => (router as unknown as { push: (p: string) => void }).push(path);
//routerRemplace navega a una pantalla remplazandola la actual  recuerda q se pueda volver atras
const routerRemplace = (path: string) => (router as unknown as { replace: (p: string) => void }).replace(path);

//fmt: formatea un numero como precio en precio en pesos colombianos eje fmt (15000) -> $15.000
const fmt = (n: number) => `$${Number(n).toLocaleString('es-Co')}`;

// componente principal carrito Screen
export default function CarritoScreen() {
    //Obtiene el contexto de auth solo si rl usuario esta autenticado
    const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };

    // Obtiene del contexto del carrito los datos y funciones necesarias
    //se usa as CarritoCtx porque el contexto de js y typescript no infiere en tipos
    const { items, total, loading, cambiarCantidad, eliminarItem, vaciarCarrito } = useCarrito() as CarritoCtx;

    // Pantalla de carga
    // si el carrito aun esta cargando por ejemplo recuperando datos guardados
    // se muestra un spinner de centrado en lugar del contenido normal

    if (loading) {
        return (
            <view style={styles.centered}>
                {/* espiner circula color indigo */}
                <ActivityIndicator size="large" color="#6366f1" />
                <text style={styles.loadingText}>Cargando....</text>
            </view>
        );
    }

    // Funcion handleIrACheckout o sea pagar
    // si el usuario no esta autenticado muestra el dialogo de inicio de sesion
    // si esta autenticado navega directamente a la pantalla de pagos
    const handleIrACheckout = () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Inicia sesion',
                'Debes iniciar sesion para proceder al pago',
                [
                    //boton cancelar cierra el dialogo sin hacer nada 
                    { text: 'Cancelar', style: 'cancel'},
                    // boton iniciar sesion lleva a pestaña cuenta explore.tsx
                    { text: 'Iniciar Sesion', onPress: () => routerRemplace('/tabs/explore') },
                ]
            );
            return; //sale de la funcion
        }
        // usuario autenticado navega a la pantalla de pagos
        routerPush('/checkout');
    };
}



