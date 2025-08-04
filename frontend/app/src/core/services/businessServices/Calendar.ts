import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { useAuthStore } from "@/stores/auth";
import type { CalendarEvent, CreateCalendarEventDto, UpdateCalendarEventDto, CalendarEventFilter } from "@/core/models/Calendar";

const store = useAuthStore();

const getAllEvents = (): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEventById = (id: string): Promise<CalendarEvent | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar/${id}`)
    .then(({ data }) => data as CalendarEvent)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createEvent = (formData: CreateCalendarEventDto): Promise<CalendarEvent | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`calendar`, formData)
    .then(({ data }) => data as CalendarEvent)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateEvent = (id: string, formData: UpdateCalendarEventDto): Promise<CalendarEvent | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`calendar/${id}`, formData)
    .then(({ data }) => data as CalendarEvent)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteEvent = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`calendar/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getEventsByFilter = (filter: CalendarEventFilter): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  const params = new URLSearchParams();
  
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  return ApiService.get(`calendar?${params.toString()}`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEventsByType = (eventType: string): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar?eventType=${encodeURIComponent(eventType)}`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEventsByStatus = (status: string): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar?status=${encodeURIComponent(status)}`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEventsByUser = (userId: string): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar?userId=${encodeURIComponent(userId)}`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEventsByDateRange = (startDate: string, endDate: string): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMyEvents = (): Promise<Array<CalendarEvent> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`calendar?createdBy=me`)
    .then(({ data }) => data as CalendarEvent[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByFilter,
  getEventsByType,
  getEventsByStatus,
  getEventsByUser,
  getEventsByDateRange,
  getMyEvents
}; 