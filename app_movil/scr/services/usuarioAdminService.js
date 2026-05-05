/**
 * administra la funciones de usuario
 * activa desactiva y eliminar desde el panel del admin
 */

import api from '../api';

// activa un usuario

export async function activarUsuario(id, data) {
    const res = await api.patch (`/admin/usuarios/${id}/activar`);
    return res.data;
}

// desactiva un usuario

export async function desactivarUsuario(id, data) {
    const res = await api.patch (`/admin/usuarios/${id}/desactivar`);
    return res.data;
}

// eliminar un usuario

export async function deleteUser(id) {
    const res = await api.delete (`/admin/usuarios/${id}`);
    return res.data;
}