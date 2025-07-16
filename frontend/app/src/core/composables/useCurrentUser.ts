import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import JwtService from '@/core/services/JwtService';
import ApiService from '@/core/services/ApiService';

export interface CurrentUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username: string;
  roles: string[];
  avatar?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  phone?: string;
  currentRole?: string;
  department?: string;
  isAvailable: boolean;
  cvData?: {
    id: string;
    fileName: string;
    storageUrl: string;
    uploadDate: string;
  };
  hardSkills?: Array<{
    id: string;
    name: string;
    proficiencyLevel: number;
    certification?: string;
  }>;
  softSkills?: Array<{
    id: string;
    name: string;
    proficiencyLevel: number;
    certification?: string;
  }>;
  experiences?: Array<{
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    description?: string;
    technologiesUsed: string[];
  }>;
}

const currentUser = ref<CurrentUser | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useCurrentUser() {
  const authStore = useAuthStore();

  const fetchCurrentUser = async () => {
    if (!authStore.isAuthenticated || !JwtService.getToken()) {
      currentUser.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.post('auth/verify_token', { 
        api_token: JwtService.getToken() 
      });
      
      if (response.data) {
        currentUser.value = response.data;
      }
    } catch (err: any) {
      console.error('Failed to fetch current user:', err);
      error.value = 'Failed to load user data';
      
      // If token is invalid, logout the user
      if (err.response?.status === 401) {
        authStore.logout();
      }
    } finally {
      loading.value = false;
    }
  };

  const updateCurrentUser = async (userData: Partial<CurrentUser>) => {
    if (!currentUser.value?.id) {
      throw new Error('No current user to update');
    }

    loading.value = true;
    error.value = null;

    try {
      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/applicationuser/${currentUser.value.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JwtService.getToken()}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const updatedUser = await response.json();
      currentUser.value = updatedUser;
      
      return updatedUser;
    } catch (err: any) {
      console.error('Failed to update current user:', err);
      error.value = 'Failed to update user data';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refreshCurrentUser = () => {
    return fetchCurrentUser();
  };

  // Computed properties for common user data
  const userDisplayName = computed(() => {
    if (!currentUser.value) return '';
    const { firstName, lastName } = currentUser.value;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName || lastName || currentUser.value.username || '';
  });

  const userEmail = computed(() => {
    return currentUser.value?.email || '';
  });

  const userAvatar = computed(() => {
    return currentUser.value?.avatar || '';
  });

  return {
    currentUser: computed(() => currentUser.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchCurrentUser,
    updateCurrentUser,
    refreshCurrentUser,
    userDisplayName,
    userEmail,
    userAvatar,
  };
} 