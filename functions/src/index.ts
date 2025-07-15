// Import all function registrations

// Existing functions
import './TestFunction';
import './CVExtractorFunction';

// Consolidated Authentication functions
import './AuthFunction';

// Consolidated Application User functions
import './ApplicationUserCRUDFunction';

// Consolidated Project functions
import './ProjectCRUDFunction';

// Consolidated Skill functions
import './SkillCRUDFunction';

// Consolidated Asset functions
import './AssetCRUDFunction';

// Consolidated Experience functions
import './ExperienceFunction';

// Consolidated Skill training functions
import './SkillTrainingFunction';

// Consolidated Appointment functions
import './AppointmentCRUDFunction';

// Consolidated Project Skill functions
import './ProjectSkillCRUDFunction';

// Blob storage functions (already consolidated)
import './BlobStorageFunction';
import './BlobStorageAdditionalFunction';

// All functions are automatically registered when their modules are imported
// The @azure/functions app.http() calls in each function file handle the registration 