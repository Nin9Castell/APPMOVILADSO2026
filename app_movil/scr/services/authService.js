/**
 * Centralizar todas las operaciones realcionadas con autenticacion
 * inicia sesion guarda token/usuario en almacenamiento local
 * cierra sesion aliminando los datos 
 * restaura la sesion guardada
 * actualizar el perfil del usuario autenticado
 */

import apiCient from '../api/apiCient';
import { STORAGE_KEY } from '../utils/constants';
import { storageGetItem, storageMultiSet, storageSetItem } from '../utils/storage';

const authService = {
    //envia credenciales al backend y persiste token + usuario si son validos
    login: async (email, password) => {
        const response = await apiCient.post('/auth/login', { email, password });
        const payload = response.data?.data || response.data;

        if (payload?.token) {
            await storageSetItem(STORAGE_KEY.token, payload.token);
        }

        if (payload?.usuario) {
            await storageSetItem(STORAGE_KEY.usuario, payload.usuario);
        }

        return response.data;

    },

    //cerrar sesion
    register: async (data) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    //cerrar sesion
    logout: async () => {
        await storageMultiRemove([STORAGE_KEY.token, STORAGE_KEY.user]);
    },

    //lee el almacenamiento local la sesion previamente guardada
    getSession: async () => {
        const token = await storageGetItem(STORAGE_KEY.token);
        const userRaw = await storageGetItem(STORAGE_KEY.user);
        const user = userRaw ? JSON.parse(userRaw) : null;
        return { token, user };
    },

    //actualiza el usuario en el almacenamiento local
    updatePerfil: async (data) => {
        const response = await apiClient.put('/auth/me', data);
        const usuario = response.data?.data?.usuario || response.data.usuario || null;
        if (usuario) {
            await storageSetItem(STORAGE_KEY.user, JSON.stringify(usuario));
        }
        return response.data;
    },

};

export default authService;