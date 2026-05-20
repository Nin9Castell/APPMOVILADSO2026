/**
 * Define la barra de navegacion inferior (tab bar) de app
 * expo Router usa este archivo como el contenedor de todals las
 * pantallas que viven de la carpeta (TABS)
 */

//tabs componente de expo router que genera la barra de pestañas inferior
import { Tabs } from 'expo-router';
//React necesario para que JSX funcione correctamente
import React from 'react';
//hapticTab version personalizada del boton de la pestaña que agrega vibracion tactil (haptic feedback) al precionar el tab
import { HapticTab } from '../../components/haptic-tab';
//IconoSymbols componente que muestra iconos SF Symbols IOS y material de android
import { IconSymbol } from '../../components/ui/icon-symbol';
// colors objeto de colores del tema de app modo claro y oscuro
import { Colors } from '../../constants/theme';
// useColorShema hook que dtecta si el dispositivo esta en modo claro o oscuro
import { useColorScheme } from '../../hooks/use-color-scheme';

// TabLayaout componente principal que configura todas la barra de navegacion
// expo Router lo exporta como default y lo monta automaticamente
export default function TabLayout() {
    //ColorScheme valor 'light' o 'dark' segun la preferencia del sistema
    const colorScheme = useColorScheme();

    return (
        //tabs renderiza la barra de pestañas inferior y gestiona que la pantalla este activa en cada momento
        <Tabs
            screenOptions={{
                //tabBarActiveTintColor color del icono y texto de la pestaña activa
                // si colorScheme es null (no detectado) usa light por defecto
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                //headerShown false oculta el encabezado superior en todas las pantallas
                headerShown: false,
                //tabBarButton remplaza el botón estándar por HapticTab con vibración
                tabBarButton: HapticTab,
            }}>

            {/** pestaña 1 tienda
             * name=index -> apunta al archivo /index.tsx (pantalla principal)
             */}
            <Tabs.Screen 
                name="index" 
                options={{
                    //Texto que aparece debajo del icono de la barra 
                    title: 'Tienda Adso',
                    //tabBarIcon funcion que recibe el color activo o inactivo y devuekve el icono
                    //house.fill = icono de casa rellena (representa el icono de la tienda)
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, 
                }}
                />

            {/** pestaña 2 carrito
             * name=carrito -> apunta al archivo /carrito.tsx
             */}
            <Tabs.Screen 
                name="carrito" 
                options={{
                    //Texto que aparece debajo del icono de la barra 
                    title: 'Carrito',
                    //tabBarIcon funcion que recibe el color activo o inactivo y devuekve el icono
                    //house.fill = icono de casa rellena (representa el icono de la tienda)
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />, 
                }}
                />

            {/** pestaña 3 carrito
             * name=explore -> apunta al archivo /explore.tsx
             */}
            <Tabs.Screen 
                name="explore" 
                options={{
                    //Texto que aparece debajo del icono de la barra 
                    title: 'cuenta',
                    //tabBarIcon funcion que recibe el color activo o inactivo y devuekve el icono
                    //house.fill = icono de casa rellena (representa el icono de la tienda)
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle" color={color} />, 
                }}
                />  



        </Tabs>
    );
}