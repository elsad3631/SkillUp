// Import all function registrations

// Existing functions
import './functions/applicationuser';
import './functions/appointment';
import './functions/asset';
import './functions/auth';
import './functions/blobstorage';
import './functions/azureSearch';
import './functions/extractCVData';
import './functions/notification';
import './functions/userActivityLog';
import './functions/project';
import './functions/projectSkill';
import './functions/skillTraining';
import './functions/skill';
import './functions/experience';
import './functions/user';
import './functions/roles';

// All functions are automatically registered when their modules are imported
// The @azure/functions app.http() calls in each function file handle the registration 