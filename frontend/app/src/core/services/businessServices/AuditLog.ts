import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { AuditLogAction, AuditLogEntityType, AuditLogSeverity } from "@/core/models/enums";

const store = useAuthStore();

export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  description?: string;
  severity: AuditLogSeverity;
  timestamp: Date;
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

const getAuditLogs = (): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("audit-log")
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogById = (id: string): Promise<AuditLog | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/${id}`)
    .then(({ data }) => data as AuditLog)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogsByUser = (userId: string): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/user/${userId}`)
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogsByAction = (action: string): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/action/${action}`)
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogsByEntity = (entityType: string, entityId: string): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/entity/${entityType}/${entityId}`)
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogsByDateRange = (startDate: Date, endDate: Date): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getRecentAuditLogs = (days: number = 7): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/recent?days=${days}`)
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCriticalAuditLogs = (): Promise<Array<AuditLog> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("audit-log/critical")
    .then(({ data }) => data as AuditLog[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createAuditLog = (auditLog: Partial<AuditLog>): Promise<AuditLog | undefined> => {
  ApiService.setHeader();
  return ApiService.post("audit-log", auditLog)
    .then(({ data }) => data as AuditLog)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteAuditLog = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`audit-log/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const exportAuditLogs = (startDate: Date, endDate: Date, format: string = 'csv'): Promise<any> => {
  ApiService.setHeader();
  return ApiService.post("audit-log/export", { startDate, endDate, format })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuditLogStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("audit-log/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUserAuditLogStats = (userId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/stats/user/${userId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getActionAuditLogStats = (action: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`audit-log/stats/action/${action}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByAction,
  getAuditLogsByEntity,
  getAuditLogsByDateRange,
  getRecentAuditLogs,
  getCriticalAuditLogs,
  createAuditLog,
  deleteAuditLog,
  exportAuditLogs,
  getAuditLogStats,
  getUserAuditLogStats,
  getActionAuditLogStats,
}; 