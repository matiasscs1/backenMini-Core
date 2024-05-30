import { Router } from "express";
import { createPaciente, deletePacienteById, getPacientesByDoctorId, getPacientes, updatePacienteById, getPacienteById, getPacienteByIdDiagnostico  } from "../Controller/user.controller.js";
import {updateDiagnostico} from '../Controller/reglas.diagnostico.js'
import {postSignosVitales, getSignosVitalesId, getSignosVitalesIdDiagnostico} from "../Controller/signos_vitales.controller.js"
import { postPatologia, getPatologias,getPatologiasByIdPaciente, updatePatologiaById } from "../Controller/patologias_personales.controller.js";
import { postDoctor, login, deleteDoctorId, logout, profile, getDoctor, deleteDoctorEmail, updateDoctorId, getDoctorId, verifyToken } from "../Controller/doctor.controller.js"
import {authRequired} from "../middlewares/validateToken.js"
const router = Router();
// rutas para los usuarios 
router.get("/user",  getPacientes );
router.post("/user", createPaciente);
router.put("/user/:id",  updatePacienteById);
// diagnostioc 
router.get("/signos_vitalesD/:id", getSignosVitalesIdDiagnostico);
router.get("/user/propio/:id",   getPacienteByIdDiagnostico);
///
router.get("/user/paciente:id",   getPacienteById);
router.get("/user/:id",   getPacientesByDoctorId);
router.delete("/user",   deletePacienteById);
router.post("/patologia", postPatologia);
router.post("/diagnosticado", updateDiagnostico);
router.get("/patologia", getPatologias);
router.get("/patologia/:id", getPatologiasByIdPaciente);
router.put("/patologia/:id", updatePatologiaById);
router.post("/signos_vitales", postSignosVitales);
router.get("/signos_vitales/:id", getSignosVitalesId);
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

///

router.get("/verify", verifyToken)





export default router;
 
