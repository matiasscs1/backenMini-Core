import { Router } from "express";
import { createPaciente, deletePacienteById, getPacientesByDoctorId, getPacientes, updatePacienteById, getPacienteById, getPacienteByIdDiagnostico, updatePacienteByIdSintomasAlergias, updatePacienteByIdMedicamentosAtomar, getPacientesFiltered  } from "../Controller/user.controller.js";
import {updateDiagnostico} from '../Controller/reglas.diagnostico.js'
import {recetasDiagnostico} from '../Controller/Recetas.diagnostico.js'
import {postSignosVitales, getSignosVitalesId, getSignosVitalesIdDiagnostico, updateSignosVitales, getSignosVitales} from "../Controller/signos_vitales.controller.js"
import { postDoctor, login, deleteDoctorId, logout, profile, getDoctor, deleteDoctorEmail, updateDoctorId, getDoctorId, verifyToken } from "../Controller/doctor.controller.js"
import {authRequired} from "../middlewares/validateToken.js"
const router = Router();
 
router.get("/user",  getPacientes );
router.post("/user", createPaciente);
router.put("/user/:id",  updatePacienteById);
// diagnostioc 
router.put("/userEditarM/:id", updatePacienteByIdMedicamentosAtomar);
router.put("/userEditarSA/:id", updatePacienteByIdSintomasAlergias);
router.get("/signos_vitalesD/:id", getSignosVitalesIdDiagnostico);
router.get("/user/propio/:id",   getPacienteByIdDiagnostico);
router.put("/Editarsignos_vitales/:id", updateSignosVitales);
router.get("/signos_vitalesGet", getSignosVitales);
// ver medicamentos 
router.get("/receta/:id", recetasDiagnostico);

//filtro 
router.post("/filtro", getPacientesFiltered);
//
router.get("/user/:id",   getPacientesByDoctorId);
router.delete("/user",   deletePacienteById);
router.post("/diagnosticado/:id", updateDiagnostico);
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
 
