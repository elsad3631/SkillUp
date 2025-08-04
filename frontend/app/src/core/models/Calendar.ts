export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  eventType: 'APPOINTMENT' | 'PERMISSION' | 'SICK_LEAVE' | 'HOLIDAY' | 'MEETING' | 'TASK' | 'OTHER';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  location?: string;
  attendees: string[];
  createdBy: string;
  customerId?: string;
  projectId?: string;
  userId?: string;
  color?: string;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Related entities
  customer?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdByUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  eventType: 'APPOINTMENT' | 'PERMISSION' | 'SICK_LEAVE' | 'HOLIDAY' | 'MEETING' | 'TASK' | 'OTHER';
  status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  location?: string;
  attendees?: string[];
  createdBy: string;
  customerId?: string;
  projectId?: string;
  userId?: string;
  color?: string;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  isPrivate?: boolean;
}

export interface UpdateCalendarEventDto extends Partial<CreateCalendarEventDto> {
  id: string;
}

export interface CalendarEventFilter {
  eventType?: string;
  status?: string;
  userId?: string;
  customerId?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
} 