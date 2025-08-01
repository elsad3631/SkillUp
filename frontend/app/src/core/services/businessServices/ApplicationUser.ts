import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface ApplicationUser {
  id: string;
  username: string;
  email: string;
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
  company?: string | null; // ID dell'utente Super Admin che rappresenta la società
  userRoles?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const getApplicationUsers = (filterRequest?: string): Promise<Array<ApplicationUser> | undefined> => {
  ApiService.setHeader();
  const endpoint = filterRequest
    ? `applicationuser?filter=${encodeURIComponent(filterRequest)}`
    : `applicationuser`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getApplicationUserById = (id: string): Promise<ApplicationUser | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`applicationuser/${id}`)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getApplicationUsersByRole = (roleName: string, companyId?: string): Promise<Array<ApplicationUser> | undefined> => {
  ApiService.setHeader();
  const url = companyId 
    ? `applicationuser/role/${roleName}?company=${encodeURIComponent(companyId)}`
    : `applicationuser/role/${roleName}`;
    
  return ApiService.get(url)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getNonSuperAdminUsers = (companyId?: string): Promise<Array<ApplicationUser> | undefined> => {
  ApiService.setHeader();
  const url = companyId 
    ? `applicationuser/filter/non-superadmin?company=${encodeURIComponent(companyId)}`
    : `applicationuser/filter/non-superadmin`;
    
  return ApiService.get(url)
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAvailableApplicationUsers = (): Promise<Array<ApplicationUser> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("applicationuser/filter/available")
    .then(({ data }) => data as ApplicationUser[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createApplicationUser = (applicationUser: Partial<ApplicationUser>): Promise<ApplicationUser | undefined> => {
  ApiService.setHeader();
  return ApiService.post("applicationuser", applicationUser)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateApplicationUser = (id: string, applicationUser: Partial<ApplicationUser>): Promise<ApplicationUser | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`applicationuser/${id}`, applicationUser)
    .then(({ data }) => data as ApplicationUser)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteApplicationUser = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`applicationuser/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const bulkDeleteApplicationUsers = (userIds: string[]): Promise<{
  deletedUsers: number;
  deletedFiles: number;
  totalUsers: number;
} | undefined> => {
  ApiService.setHeader();
  return ApiService.post('applicationuser/bulk/delete', { userIds })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const searchApplicationUsers = (params: {
  query?: string;
  roleName?: string;
  department?: string;
  isAvailable?: boolean;
}): Promise<Array<ApplicationUser> | undefined> => {
  ApiService.setHeader();
  const queryParams = new URLSearchParams();
  
  if (params.query) queryParams.append('query', params.query);
  if (params.roleName) queryParams.append('role', params.roleName);
  if (params.department) queryParams.append('department', params.department);
  if (params.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());

  return ApiService.get(`applicationuser/admin/search?${queryParams.toString()}`)
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
  getNonSuperAdminUsers,
  getAvailableApplicationUsers,
  createApplicationUser,
  updateApplicationUser,
  deleteApplicationUser,
  bulkDeleteApplicationUsers,
  searchApplicationUsers,
}; 