// Performance Review Enums
export enum PerformanceReviewStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED'
}

export enum PerformanceReviewPeriod {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
  ANNUAL = 'ANNUAL',
  BIANNUAL = 'BIANNUAL'
}

export enum PerformanceReviewScore {
  ONE = 1,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
  TWO_POINT_FIVE = 2.5,
  THREE = 3,
  THREE_POINT_FIVE = 3.5,
  FOUR = 4,
  FOUR_POINT_FIVE = 4.5,
  FIVE = 5
}

export enum PerformanceReviewCategory {
  TECHNICAL_SKILLS = 'TECHNICAL_SKILLS',
  SOFT_SKILLS = 'SOFT_SKILLS',
  LEADERSHIP = 'LEADERSHIP',
  COMMUNICATION = 'COMMUNICATION',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
  TEAMWORK = 'TEAMWORK',
  INITIATIVE = 'INITIATIVE',
  ADAPTABILITY = 'ADAPTABILITY',
  TIME_MANAGEMENT = 'TIME_MANAGEMENT',
  QUALITY_OF_WORK = 'QUALITY_OF_WORK'
}

// Training & Certification Enums
export enum TrainingEnrollmentStatus {
  ENROLLED = 'ENROLLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum CertificationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING'
}

export enum TrainingDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum TrainingCategory {
  TECHNICAL = 'TECHNICAL',
  SOFT_SKILLS = 'SOFT_SKILLS',
  LEADERSHIP = 'LEADERSHIP',
  MANAGEMENT = 'MANAGEMENT',
  COMPLIANCE = 'COMPLIANCE',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER'
}

// Task Management Enums
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

// Mentorship Enums
export enum MentorshipStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

// Objective & KPI Enums
export enum ObjectiveStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK'
}

export enum ObjectivePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ObjectiveCategory {
  PERSONAL = 'PERSONAL',
  TEAM = 'TEAM',
  COMPANY = 'COMPANY',
  PROJECT = 'PROJECT',
  DEPARTMENT = 'DEPARTMENT'
}

// Document Management Enums
export enum DocumentCategory {
  CONTRACT = 'CONTRACT',
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  REPORT = 'REPORT',
  PRESENTATION = 'PRESENTATION',
  TRAINING = 'TRAINING',
  COMPLIANCE = 'COMPLIANCE',
  FINANCIAL = 'FINANCIAL',
  HR = 'HR',
  TECHNICAL = 'TECHNICAL',
  OTHER = 'OTHER'
}

export enum DocumentMimeType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',
  CSV = 'text/csv',
  JSON = 'application/json',
  XML = 'application/xml',
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_GIF = 'image/gif',
  IMAGE_SVG = 'image/svg+xml'
}

// Audit Log Enums
export enum AuditLogSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum AuditLogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  SHARE = 'SHARE',
  ASSIGN = 'ASSIGN',
  COMPLETE = 'COMPLETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

export enum AuditLogEntityType {
  USER = 'USER',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  DOCUMENT = 'DOCUMENT',
  PERFORMANCE_REVIEW = 'PERFORMANCE_REVIEW',
  TRAINING_ENROLLMENT = 'TRAINING_ENROLLMENT',
  CERTIFICATION = 'CERTIFICATION',
  MENTORSHIP = 'MENTORSHIP',
  OBJECTIVE = 'OBJECTIVE',
  COMMENT = 'COMMENT',
  USER_SETTING = 'USER_SETTING'
}

// User Settings Enums
export enum UserTheme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  AUTO = 'AUTO'
}

export enum UserLanguage {
  IT = 'IT',
  EN = 'EN',
  ES = 'ES',
  FR = 'FR',
  DE = 'DE',
  PT = 'PT'
}

export enum UserTimeFormat {
  H12 = '12H',
  H24 = '24H'
}

export enum UserDateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YYYY = 'MM/DD/YYYY',
  YYYY_MM_DD = 'YYYY/MM/DD',
  DD_MM_YY = 'DD/MM/YY',
  MM_DD_YY = 'MM/DD/YY'
}

// Common Enums
export enum CommonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum CommonPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

// Notification Enums
export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  REMINDER = 'REMINDER',
  ASSIGNMENT = 'ASSIGNMENT',
  DEADLINE = 'DEADLINE',
  APPROVAL = 'APPROVAL'
}

// Project Enums
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// User Role Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST'
}

export enum UserDepartment {
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  OPERATIONS = 'OPERATIONS',
  LEGAL = 'LEGAL',
  FACILITIES = 'FACILITIES',
  OTHER = 'OTHER'
} 