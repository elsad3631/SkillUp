import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name?: string;
  surname?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  api_token?: string;
  sector?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User, token?: string) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    if (token) {
      JwtService.saveToken(token);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
    }
    // Set the authorization header for future requests
    ApiService.setHeader();
  }

  function setError(error: any, status?: number) {
    if(status == 400){
      errors.value = "Si è verificato un errore. Assicurati di aver inserito i campi obbligatori!";
    } else if (status == 500) {
      errors.value = error;
    } else {
      errors.value = "Si è verificato un errore";
    }
    
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
    localStorage.removeItem('currentUser');
  }

  function login(credentials: { email: string; password: string }) {
    return ApiService.post("auth/login", credentials)
      .then(({ data }) => {
        setAuth(data.user, data.token);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: { first_name: string; last_name: string; email: string; password: string; sector?: string; roles?: string[] }) {
    return ApiService.post("auth/register", credentials)
      .then(({ data }) => {
        // Dopo la registrazione, effettua il login per ottenere il token
        login({ email: credentials.email, password: credentials.password });
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function resetPassword(email: string, newPassword: string) {
    return ApiService.post("auth/reset-password", { email, newPassword })
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("auth/verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
    verifyAuth,
    setError
  };
});
