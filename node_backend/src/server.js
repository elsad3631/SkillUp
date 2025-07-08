"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
// import employeeRoutes from './routes/employee.routes'; // Removed - replaced by ApplicationUser
const applicationuser_routes_1 = __importDefault(require("./routes/applicationuser.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const experience_routes_1 = __importDefault(require("./routes/experience.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const skill_requirement_routes_1 = __importDefault(require("./routes/skill-requirement.routes"));
const cvdata_routes_1 = __importDefault(require("./routes/cvdata.routes"));
const skill_training_routes_1 = __importDefault(require("./routes/skill-training.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const asset_routes_1 = __importDefault(require("./routes/asset.routes"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
// Qui verranno importate e usate le route dei microservizi
// esempio: app.use('/api/employees', employeeRoutes);
// app.use('/api/employees', employeeRoutes); // Removed - replaced by ApplicationUser
app.use('/api/applicationusers', applicationuser_routes_1.default); // New unified route
app.use('/api/projects', project_routes_1.default);
app.use('/api/appointments', appointment_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/experiences', experience_routes_1.default);
app.use('/api/skills', skill_routes_1.default);
app.use('/api/skill-requirements', skill_requirement_routes_1.default);
app.use('/api/cvdata', cvdata_routes_1.default);
app.use('/api/skill-trainings', skill_training_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/assets', asset_routes_1.default);
// Esempio di protezione route:
// app.use('/api/admin', authenticateJWT, authorizeRoles('Admin'), adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SkillUp API server running on port ${PORT}`);
});
