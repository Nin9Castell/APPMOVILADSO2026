/**
 * Este archivo gestion de productos de administracion
 * lista de todos los productos  del sistema con imagen descripcion precio y estado 
 * Permite buscar en tiempo real y navega entre paginas 10 por pagina
 * product-form con los datos de editar
 * Al precionar el producto navega a sus caracteristicas y edicion
 * Solo administradores isAdmin puede activar desactivar y eliminar productos
 * El auxiliar solo puede ver y navegar
 */

// manejo de variables de estado local
import { useState, useEffect } from 'react';

// importar componentes 
// Dimensions obtiene el ancho y alto de la pantalla para hacer diseños responsivos
// flatlist lista optimizada con virtualizacion para mostrar grandes cantidades de datos
// Modal mostrar detalles de contenido en ventana emergente

import { ActivityIndicator, Alert, FlatList, Image, Pressable,  ScrollView, StyleSheet, TextInput, View } from "react-native";



// Lee los parametros de la url para obtener el id del pedido 
import { router } from 'expo-router'; //navegacion y parametros de ruta

//themedText: texto q aplica colores del tea del dispositivo de manera automatica claro u oscuro
import { ThemedText } from '@/components/themed-text';

import  apiClient  from '../../scr/api/apiClient';

import { activarProducto, desactivarProducto, deleteProduct } from '../../scr/services/adminService';
import { useAuth } from'../../scr/context/AuthContext';

/**
 * tipo de producto
 * estuctura del producto recibido como parametro cuando edita 
 */

type Producto = {
    id?: string;
    nombre?: string;
    descripcion?: string;
    precio?: string;
    stock?: string;
    imagen?: string;
    activo?: boolean;
};

type AuthUser = {rol?: string};

/**
 * helpers de navegacion 
 * cats de router para navegar con string simple sin parametros
 */

const push = (path: string) => 
(router as unknown as {push: (p: string) => void}).push(path);

//cast de router para navegar con pathname + params (para pasar el objeto a producto)
const pushParams = (pathname: string, params: Record<string, string>) =>
(router as unknown as { push: (p: {pathname: string; params: Record<string, string>}) => void }).push({ pathname, params});

export default function AdminProductosScreen() {



    const { user } = useAuth( as {user: AuthUser | null });
    /**
     * navegacion 
     * use routerpermite navegar programaticamente
     */

    const router = useRouter();
    /**
     * Parametros de ruta 
     * el parametro de producto es opcional solo si existe en modo editar
     * expo Router son strings 
     */

    const params = useLocalSearchParams <{ producto? : string } > ()

    /**
     * Producto recibido 
     * si existe el parametro intenta pasearlo como un json 
     * si falla el parse (JSON malformado), lo deja como undefined (modo creacion)
     */

    let producto: Producto | undefined;
    if (params.producto) {
        try{
            producto = JSON .parse(params.producto) as Producto;
        } catch {
            producto = undefined; // fallo siencioso : se trata como formulario vacio
        }
    }

    /**
     * modo formulario
     * editing = true modo edicion (producto recibido)
     * editing = false modo creacion 
     */

    const editing = !!producto;
     
    /**
     * Estado local campos del formulario 
     * los campos se inicializan con los valores del producto si se esta editando
     * o en cadena si vacia se esta creando 
     * El operador ?? devuelve el lado derecho solo si el lado izquierdo es null / undefined
     */

    const [nombre, setNombre] = useState(producto?.nombre ?? '');
     const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
      const [precio, setPrecio] = useState(producto?.precio?.toString ??'');
       const [stock, setStock] = useState(producto?.stock?.toString() ?? '');
        const [imagen, setImagen] = useState(producto?.imagen ?? '');
         const [loading, SetLoading] = useState(false);

         /**
          * funcion de handleSubmit
          * valida los campos llama al servicio correspondiente (crear o actualizar)
          * y regresa a la pantalla anterior si fue exitoso 
          */

         const handleSubmit  = async () => {
            // validacion basica los 4 campos obligatorios no pueden estar vacios 
            if (!nombre || !descripcion || !precio || !stock) {
                Alert.alert('Error', 'Todos los campos son obligatorios');
                return; //detiene la ejecucion sin hacer la peticion HTTP
            }

            SetLoading(true); // Deshabilita el boton durante la peticion 
            try {
                // construye el objeto de datos convirtiendo precio y stock a numericos

                const data = {
                    nombre, 
                    descripcion,
                    precio: parseFloat(precio),
                    stock: parseInt(stock, 10),
                    imagen,
                };

                if (editing && producto) {
                   // modo edicion llama updateProduct con el id del producto
                   // se usa id como fallback
                   await updateProduct(producto.id || producto.id, data)
                   Alert.alert('Exito', 'Producto actualizado') 
                } else {
                    // cuando el formulario este vacio se comporta como creacion
                    await createProduct(data);
                    Alert.alert('Exito', 'Producto creado');
                }
                router.back();

            } catch {
                Alert.alert('Error', ' No se pudo guardar el producto');
            }finally{
                SetLoading(false);//Habilita el boton nuevamente
            }
         }
    }

