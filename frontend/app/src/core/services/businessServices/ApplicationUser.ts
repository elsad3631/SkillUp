import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface ApplicationUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  placeOfBirth?: string | null;
  address?: string | null;
  phone?: string | null;
  currentRole?: string | null;
  department?: string | null;
  position?: string | null;
  isAvailable: boolean;
}

const getApplicationUsers = (filterRequest?: string): Promise<Array<ApplicationUser> | undefined> => {
  const endpoint = filterRequest
    ? `applicationusers?filter=${encodeURIComponent(filterRequest)}`
    : `applicationusers`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getApplicationUserById = (id: string): Promise<ApplicationUser | undefined> => {
  return ApiService.get(`applicationusers/${id}`)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getApplicationUsersByRole = (role: string): Promise<Array<ApplicationUser> | undefined> => {
  return ApiService.get(`applicationusers/role/${role}`)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAvailableApplicationUsers = (): Promise<Array<ApplicationUser> | undefined> => {
  return ApiService.get("applicationusers/available")
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createApplicationUser = (applicationUser: Partial<ApplicationUser>): Promise<ApplicationUser | undefined> => {
  return ApiService.post("applicationusers", applicationUser)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateApplicationUser = (id: string, applicationUser: Partial<ApplicationUser>): Promise<ApplicationUser | undefined> => {
  return ApiService.put(`applicationusers/${id}`, applicationUser)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteApplicationUser = (id: string): Promise<boolean> => {
  return ApiService.delete(`applicationusers/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const searchApplicationUsers = (params: {
  query?: string;
  role?: string;
  department?: string;
  isAvailable?: boolean;
}): Promise<Array<ApplicationUser> | undefined> => {
  const queryParams = new URLSearchParams();
  
  if (params.query) queryParams.append('query', params.query);
  if (params.role) queryParams.append('role', params.role);
  if (params.department) queryParams.append('department', params.department);
  if (params.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());

  return ApiService.get(`applicationusers/search?${queryParams.toString()}`)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getApplicationUsers,
  getApplicationUserById,
  getApplicationUsersByRole,
  getAvailableApplicationUsers,
  createApplicationUser,
  updateApplicationUser,
  deleteApplicationUser,
  searchApplicationUsers,
}; 