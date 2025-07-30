# Customer and Calendar Implementation

## Overview

I have successfully added two new tables to the SkillUp application:

1. **Customer (Clienti)** - For managing clients/customers
2. **Calendar (Calendario)** - For managing appointments, permissions, sick leave, holidays, etc.

## Database Schema Changes

### Customer Table
The Customer table includes the following fields:

- `id` (String, UUID) - Primary key
- `name` (String) - Customer name (required)
- `companyName` (String?) - Company name
- `email` (String?) - Email address
- `phone` (String?) - Phone number
- `address` (String?) - Address
- `city` (String?) - City
- `country` (String?) - Country
- `vatNumber` (String?) - Partita IVA
- `fiscalCode` (String?) - Codice Fiscale
- `contactPerson` (String?) - Contact person name
- `contactPhone` (String?) - Contact person phone
- `contactEmail` (String?) - Contact person email
- `notes` (String?) - Additional notes
- `status` (String) - ACTIVE, INACTIVE, PROSPECT (default: ACTIVE)
- `industry` (String?) - Industry sector
- `website` (String?) - Website URL
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relationships:**
- One-to-many with Project (customers can have multiple projects)
- One-to-many with CalendarEvent (customers can have multiple calendar events)

### CalendarEvent Table
The CalendarEvent table includes the following fields:

- `id` (String, UUID) - Primary key
- `title` (String) - Event title (required)
- `description` (String?) - Event description
- `startDate` (DateTime) - Start date and time (required)
- `endDate` (DateTime) - End date and time (required)
- `allDay` (Boolean) - Whether it's an all-day event (default: false)
- `eventType` (String) - Type of event: APPOINTMENT, PERMISSION, SICK_LEAVE, HOLIDAY, MEETING, TASK, OTHER
- `status` (String) - CONFIRMED, PENDING, CANCELLED, COMPLETED (default: CONFIRMED)
- `priority` (String) - LOW, MEDIUM, HIGH, URGENT (default: MEDIUM)
- `location` (String?) - Event location
- `attendees` (String[]) - Array of user IDs attending the event
- `createdBy` (String) - ID of user who created the event (required)
- `customerId` (String?) - Optional link to customer
- `projectId` (String?) - Optional link to project
- `userId` (String?) - User associated with the event (for permissions, holidays, etc.)
- `color` (String?) - Color for calendar display
- `recurrence` (String?) - Recurrence pattern: DAILY, WEEKLY, MONTHLY, YEARLY
- `recurrenceEndDate` (DateTime?) - End date for recurring events
- `isPrivate` (Boolean) - Whether the event is private (default: false)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relationships:**
- Many-to-one with Customer (optional)
- Many-to-one with Project (optional)
- Many-to-one with ApplicationUser (for user-specific events)
- Many-to-one with ApplicationUser (for event creator)

### Project Table Updates
The Project table has been updated to include:
- `customerId` (String?) - Optional link to customer
- Relationship with Customer (many-to-one)
- Relationship with CalendarEvent (one-to-many)

### ApplicationUser Table Updates
The ApplicationUser table has been updated to include:
- Relationship with CalendarEvent (one-to-many) for user-specific events
- Relationship with CalendarEvent (one-to-many) for events created by the user

## Services Created

### CustomerService (`src/services/customer.service.ts`)
Provides the following methods:
- `createCustomer(data)` - Create a new customer
- `getAllCustomers()` - Get all customers with related data
- `getCustomerById(id)` - Get customer by ID with full details
- `updateCustomer(id, data)` - Update customer information
- `deleteCustomer(id)` - Delete a customer
- `getCustomersByStatus(status)` - Get customers by status
- `searchCustomers(query)` - Search customers by name, company, email, or contact person
- `getCustomersWithProjects()` - Get customers that have associated projects

### CalendarService (`src/services/calendar.service.ts`)
Provides the following methods:
- `createEvent(data)` - Create a new calendar event
- `getAllEvents()` - Get all events
- `getEventById(id)` - Get event by ID
- `updateEvent(id, data)` - Update an event
- `deleteEvent(id)` - Delete an event
- `getEventsByDateRange(startDate, endDate)` - Get events within a date range
- `getEventsByType(eventType)` - Get events by type
- `getEventsByUser(userId)` - Get events for a specific user
- `getEventsByCustomer(customerId)` - Get events for a specific customer
- `getEventsByProject(projectId)` - Get events for a specific project
- `getEventsByFilter(filter)` - Get events with complex filtering
- `getUpcomingEvents(days)` - Get upcoming events (default 7 days)
- `getTodayEvents()` - Get today's events
- `getEventsByStatus(status)` - Get events by status

## Azure Functions Created

### Customer Functions (`src/functions/customer.ts`)
- `customerGetAll` - GET /api/customer - Get all customers or search
- `customerGetById` - GET /api/customer/{id} - Get customer by ID
- `customerCreate` - POST /api/customer - Create new customer
- `customerUpdate` - PUT /api/customer/{id} - Update customer
- `customerDelete` - DELETE /api/customer/{id} - Delete customer

### Calendar Functions (`src/functions/calendar.ts`)
- `calendarGetAll` - GET /api/calendar - Get all events or filtered events
- `calendarGetById` - GET /api/calendar/{id} - Get event by ID
- `calendarCreate` - POST /api/calendar - Create new event
- `calendarUpdate` - PUT /api/calendar/{id} - Update event
- `calendarDelete` - DELETE /api/calendar/{id} - Delete event
- `calendarGetUpcoming` - GET /api/calendar/upcoming - Get upcoming events
- `calendarGetToday` - GET /api/calendar/today - Get today's events

## API Endpoints

### Customer Endpoints
- `GET /api/customer` - Get all customers
- `GET /api/customer?status=ACTIVE` - Get customers by status
- `GET /api/customer?search=company` - Search customers
- `GET /api/customer?withProjects=true` - Get customers with projects
- `GET /api/customer/{id}` - Get customer by ID
- `POST /api/customer` - Create new customer
- `PUT /api/customer/{id}` - Update customer
- `DELETE /api/customer/{id}` - Delete customer

### Calendar Endpoints
- `GET /api/calendar` - Get all events
- `GET /api/calendar?eventType=MEETING` - Get events by type
- `GET /api/calendar?status=CONFIRMED` - Get events by status
- `GET /api/calendar?userId={id}` - Get events for user
- `GET /api/calendar?customerId={id}` - Get events for customer
- `GET /api/calendar?projectId={id}` - Get events for project
- `GET /api/calendar?startDate=2024-01-01&endDate=2024-01-31` - Get events by date range
- `GET /api/calendar/{id}` - Get event by ID
- `POST /api/calendar` - Create new event
- `PUT /api/calendar/{id}` - Update event
- `DELETE /api/calendar/{id}` - Delete event
- `GET /api/calendar/upcoming?days=7` - Get upcoming events
- `GET /api/calendar/today` - Get today's events

## Key Features

### Customer Management
- Complete CRUD operations for customers
- Search functionality across multiple fields
- Status-based filtering (ACTIVE, INACTIVE, PROSPECT)
- Optional linking to projects
- Comprehensive contact information storage

### Calendar Management
- Support for various event types (appointments, permissions, sick leave, holidays, meetings, tasks)
- Optional linking to customers and projects
- Date range filtering
- User-specific event management
- Recurring event support
- Priority and status management
- Private event support
- Color coding for calendar display

### Integration
- Projects can optionally be linked to customers
- Calendar events can be linked to customers, projects, or users
- Maintains data integrity with proper foreign key relationships
- Supports both internal projects (no customer) and client projects

## Next Steps

1. **Database Migration**: Run the Prisma migration to create the new tables
2. **Frontend Integration**: Create frontend components for customer and calendar management
3. **Authorization**: Implement proper authorization rules for the new endpoints
4. **Testing**: Add comprehensive tests for the new functionality
5. **Documentation**: Update API documentation with the new endpoints

## Usage Examples

### Creating a Customer
```json
POST /api/customer
{
  "name": "Acme Corporation",
  "companyName": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+39 123 456 789",
  "address": "Via Roma 123",
  "city": "Milano",
  "country": "Italy",
  "vatNumber": "IT12345678901",
  "contactPerson": "Mario Rossi",
  "contactPhone": "+39 987 654 321",
  "contactEmail": "mario.rossi@acme.com",
  "status": "ACTIVE",
  "industry": "Technology"
}
```

### Creating a Calendar Event
```json
POST /api/calendar
{
  "title": "Client Meeting",
  "description": "Discuss project requirements",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T11:00:00Z",
  "eventType": "MEETING",
  "status": "CONFIRMED",
  "priority": "HIGH",
  "location": "Conference Room A",
  "attendees": ["user1", "user2"],
  "createdBy": "user1",
  "customerId": "customer123",
  "projectId": "project456"
}
```

This implementation provides a robust foundation for managing customers and calendar events in the SkillUp application, with full CRUD operations and flexible filtering options. 