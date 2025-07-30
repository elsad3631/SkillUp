import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { UserTheme, UserLanguage, UserTimeFormat, UserDateFormat } from "@/core/models/enums";

const store = useAuthStore();

export interface UserSetting {
  id: string;
  userId: string;
  theme: UserTheme;
  language: UserLanguage;
  timezone: string;
  dateFormat: UserDateFormat;
  timeFormat: UserTimeFormat;
  notificationPreferences?: any;
  dashboardLayout?: any;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
}

const getUserSettings = (): Promise<Array<UserSetting> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("user-setting")
    .then(({ data }) => data as UserSetting[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUserSettingById = (id: string): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`user-setting/${id}`)
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUserSettingByUserId = (userId: string): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`user-setting/user/${userId}`)
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMyUserSetting = (): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.get("user-setting/my-settings")
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createUserSetting = (userSetting: Partial<UserSetting>): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.post("user-setting", userSetting)
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateUserSetting = (id: string, userSetting: Partial<UserSetting>): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.update("user-setting", id, userSetting)
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteUserSetting = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`user-setting/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const updateTheme = (userId: string, theme: string): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`user-setting/${userId}/theme`, { theme })
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateLanguage = (userId: string, language: string): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`user-setting/${userId}/language`, { language })
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateNotificationPreferences = (userId: string, preferences: any): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`user-setting/${userId}/notifications`, { preferences })
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateDashboardLayout = (userId: string, layout: any): Promise<UserSetting | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`user-setting/${userId}/dashboard-layout`, { layout })
    .then(({ data }) => data as UserSetting)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUserSettingStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("user-setting/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getThemeStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("user-setting/stats/themes")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getLanguageStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("user-setting/stats/languages")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getUserSettings,
  getUserSettingById,
  getUserSettingByUserId,
  getMyUserSetting,
  createUserSetting,
  updateUserSetting,
  deleteUserSetting,
  updateTheme,
  updateLanguage,
  updateNotificationPreferences,
  updateDashboardLayout,
  getUserSettingStats,
  getThemeStats,
  getLanguageStats,
}; 