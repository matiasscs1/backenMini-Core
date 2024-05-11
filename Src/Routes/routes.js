import { Router } from "express";
import { createPaciente, deletePacienteById, getPacientesByDoctorId, getPacientes, updatePacienteById } from "../Controller/user.controller.js";
import { postDoctor, login, deleteDoctorId, logout, profile, getDoctor, deleteDoctorEmail, updateDoctorId, getDoctorId } from "../Controller/doctor.controller.js"
import {authRequired} from "../middlewares/validateToken.js"
const router = Router();
// rutas para los usuarios 
router.get("/user",  getPacientes );
router.post("/user", createPaciente);
router.put("/user/:id",  updatePacienteById);
router.get("/user/:id",   getPacientesByDoctorId);
router.delete("/user",   deletePacienteById);
/// ruta para los doctores 
router.post("/logout", logout)
router.post("/login",  login );
router.post("/doctors",  postDoctor);
router.get("/doctors", getDoctor);
router.get("/doctors/:id", getDoctorId);
router.delete("/doctors", deleteDoctorEmail);
router.put("/doctors/:id",  updateDoctorId);

router.delete("/doctors",authRequired, deleteDoctorId);

/// ruta para proteger las rutas
router.get("/profile", authRequired ,profile);





export default router;
 
