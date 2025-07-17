import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

// Notification type
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: string;
  state?: string;
  type?: string;
  priority?: string;
  recipientId?: string;
  isRead?: boolean;
  createdAt?: string;
}

// Log type
export interface UserActivityLog {
  id: string;
  code: string;
  state: string;
  message: string;
  time: string;
  date?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  status?: string;
  createdAt?: string;
}

// NOTIFICATIONS
export const getNotifications = (limit?: number): Promise<Notification[] | undefined> => {
  let endpoint = "notification";
  if (limit) endpoint += `?limit=${limit}`;
  return ApiService.get(endpoint)
    .then(({ data }) => data as Notification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export const getNotificationsByRecipient = (recipientId: string, limit?: number): Promise<Notification[] | undefined> => {
  let endpoint = `notification/recipient/${recipientId}`;
  if (limit) endpoint += `?limit=${limit}`;
  return ApiService.get(endpoint)
    .then(({ data }) => data as Notification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export const getUnreadNotificationsByRecipient = (recipientId: string, limit?: number): Promise<Notification[] | undefined> => {
  let endpoint = `notification/unread/${recipientId}`;
  if (limit) endpoint += `?limit=${limit}`;
  return ApiService.get(endpoint)
    .then(({ data }) => data as Notification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// LOGS
export const getLogs = (limit?: number): Promise<UserActivityLog[] | undefined> => {
  let endpoint = "userActivityLog";
  if (limit) endpoint += `?limit=${limit}`;
  return ApiService.get(endpoint)
    .then(({ data }) => data as UserActivityLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export const getLogsByUser = (userId: string, limit?: number): Promise<UserActivityLog[] | undefined> => {
  let endpoint = `userActivityLog/user/${userId}`;
  if (limit) endpoint += `?limit=${limit}`;
  return ApiService.get(endpoint)
    .then(({ data }) => data as UserActivityLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
}; 