import { Router } from "express";
import { getUsers,  createUser, deleteUserById, updateUserById, getUserById } from "../Controller/user.controller.js";
import { postDoctor, login, deleteDoctorId, logout, profile } from "../Controller/doctor.controller.js"
import {authRequired} from "../middlewares/validateToken.js"
import { getStudents, postCompute  } from "../Controller/minicore.controller.js"
const router = Router();
// rutas para los usuarios 
router.get("/user",authRequired, getUsers  );
router.post("/user", authRequired, createUser);
router.put("/user/:id", authRequired,  updateUserById);
router.get("/user/:id", authRequired,  getUserById);
router.delete("/user/:id", authRequired,  deleteUserById);
/// ruta para los doctores 
router.post("/logout", logout)
router.post("/login",  login );
router.post("/doctors",  postDoctor);

router.delete("/doctors",authRequired, deleteDoctorId);

/// ruta para proteger las rutas
router.get("/profile", authRequired ,profile);


/// ruta del mini core 
router.post("/compute", postCompute);
router.get("/students", getStudents);


export default router;
 
