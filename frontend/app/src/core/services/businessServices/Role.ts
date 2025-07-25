import ApiService from '@/core/services/ApiService';
import { useAuthStore } from '@/stores/auth';

const store = useAuthStore();

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const getAllRoles = (): Promise<Role[]> => {
  // Non inviamo il token dato che le API non richiedono autenticazione
  return ApiService.get('roles/available')
    .then(({ data }) => data as Role[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const getRoleById = (id: string): Promise<Role> => {
  ApiService.setHeader();
  return ApiService.get(`roles/${id}`)
    .then(({ data }) => data as Role)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const createRole = (roleData: { name: string; description?: string }): Promise<Role> => {
  ApiService.setHeader();
  return ApiService.post('roles', roleData)
    .then(({ data }) => data as Role)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateRole = (id: string, roleData: { name?: string; description?: string }): Promise<Role> => {
  ApiService.setHeader();
  return ApiService.put(`roles/${id}`, roleData)
    .then(({ data }) => data as Role)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteRole = (id: string): Promise<void> => {
  ApiService.setHeader();
  return ApiService.delete(`roles/${id}`)
    .then(() => {})
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const getUserRoles = (userId: string): Promise<Role[]> => {
  // Non inviamo il token dato che le API non richiedono autenticazione
  return ApiService.get(`users/${userId}/roles`)
    .then(({ data }) => data as Role[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const assignRoleToUser = (data: { userId: string; roleId: string; expiresAt?: string }): Promise<any> => {
  // Non inviamo il token dato che le API non richiedono autenticazione
  return ApiService.post('roles/assign', data)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const removeRoleFromUser = (userId: string, roleId: string): Promise<any> => {
  // Non inviamo il token dato che le API non richiedono autenticazione
  return ApiService.delete(`roles/assign/${userId}/${roleId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

export {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser
}; 