// user.controller.js

import { json } from "express";
import Paciente from "../Model/user.model.js";

// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
    try {
        const { id_doctor, nombres, apellidos, email, cedula, edad, contacto_emergencia, motivo_consulta, sintomas, alergias, diagnostico, medicamentoAtomar } = req.body;
        const newPaciente = new Paciente({
            id_doctor,
            nombres,
            apellidos,
            email,
            cedula,
            edad,
            contacto_emergencia,
            motivo_consulta,
            sintomas: Array.isArray(sintomas) ? sintomas : [],
            alergias: Array.isArray(alergias) ? alergias : [],
            diagnostico: diagnostico || '', 
            medicamentoAtomar: medicamentoAtomar || '' 
        });
        await newPaciente.save();
        res.status(200).json({ message: "Paciente creado exitosamente" });
    } catch (error) {
        throw error; // Propagar error para que el test lo capture
    }
};

// ✅ FUNCIÓN DE SERVICIO - NO maneja respuestas HTTP
export const getPacientesD = async () => {
    try {
        const pacientes = await Paciente.find();
        return pacientes;
    } catch (error) {
        throw error; // ✅ Solo propagar el error, no usar res
    }
};

// ✅ FUNCIÓN DE CONTROLADOR - SÍ maneja respuestas HTTP
export const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar paciente
export const updatePacienteById = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const updatedPaciente = req.body;

        // Verificar cédula
        if (updatedPaciente.cedula) {
            const existingPacienteCedula = await Paciente.findOne({ cedula: updatedPaciente.cedula });
            if (existingPacienteCedula && existingPacienteCedula._id.toString() !== pacienteId) {
                return res.status(400).json({ message: "La cédula ya está en uso" });
            }
        }

        // Verificar email
        if (updatedPaciente.email) {
            const existingPacienteEmail = await Paciente.findOne({ email: updatedPaciente.email });
            if (existingPacienteEmail && existingPacienteEmail._id.toString() !== pacienteId) {
                return res.status(400).json({ message: "El email ya está en uso" });
            }
        }

        // Actualizar arrays
        if (updatedPaciente.sintomas) {
            updatedPaciente.sintomas = Array.isArray(updatedPaciente.sintomas) ? updatedPaciente.sintomas : [updatedPaciente.sintomas];
        }

        if (updatedPaciente.alergias) {
            updatedPaciente.alergias = Array.isArray(updatedPaciente.alergias) ? updatedPaciente.alergias : [updatedPaciente.alergias];
        }

        const paciente = await Paciente.findByIdAndUpdate(pacienteId, updatedPaciente, { new: true });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json(paciente);
    } catch (error) {
        console.error("Error en updatePacienteById:", error); // Log para debug
        res.status(500).json({ message: "Error de servidor" }); // Mensaje consistente
    }
};

// Actualizar solo sintomas y alergias 
export const updatePacienteByIdSintomasAlergias = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const updatedPaciente = req.body;

        // Actualizar los campos de sintomas y alergias
        if (updatedPaciente.sintomas) {
            updatedPaciente.sintomas = Array.isArray(updatedPaciente.sintomas) ? updatedPaciente.sintomas : [updatedPaciente.sintomas];
        }

        if (updatedPaciente.alergias) {
            updatedPaciente.alergias = Array.isArray(updatedPaciente.alergias) ? updatedPaciente.alergias : [updatedPaciente.alergias];
        }

        const paciente = await Paciente.findByIdAndUpdate(pacienteId, updatedPaciente, { new: true });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar solo medicamentosAtomar
export const updatePacienteByIdMedicamentosAtomar = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const updatedPaciente = req.body;

        // Actualizar los campos de medicamentoAtomar
        if (updatedPaciente.medicamentoAtomar) {
            updatedPaciente.medicamentoAtomar = Array.isArray(updatedPaciente.medicamentoAtomar) ? updatedPaciente.medicamentoAtomar : [updatedPaciente.medicamentoAtomar];
        }
        
        const paciente = await Paciente.findByIdAndUpdate(pacienteId, updatedPaciente, { new: true });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los pacientes por ID del doctor
export const getPacientesByDoctorId = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const pacientes = await Paciente.find({ id_doctor: doctorId });
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ FUNCIÓN DE SERVICIO - para diagnóstico (NO maneja respuestas HTTP)
export const getPacienteByIdDiagnostico = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const paciente = await Paciente.findById(pacienteId);
        
        if (!paciente) {
            throw new Error("Paciente no encontrado");
        }
        return paciente; // ✅ Solo retorna el paciente
        
    } catch (error) {
        throw error; // ✅ Propaga el error sin usar res
    }
};

// ✅ FUNCIÓN DE CONTROLADOR - obtener un paciente por su id
export const getPacienteById = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const paciente = await Paciente.findById(pacienteId);
        
        if (!paciente) {
            throw new Error("Paciente no encontrado");
        }
        res.status(200).json(paciente);
        
    } catch (error) {
        throw error; // ✅ Propaga el error para que el test lo capture
    }
};

// Eliminar un paciente por cedula
export const deletePacienteById = async (req, res) => {
    try {
        const cedula = req.body.cedula;
        const paciente = await Paciente.findOneAndDelete({ cedula: cedula });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json({ message: "Paciente eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener pacientes filtrados
export const getPacientesFiltered = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, porcentajeMin, porcentajeMax } = req.body;

        const pacientes = await getPacientesD(); // ✅ Ahora funciona correctamente

        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        const pacientesFiltrados = pacientes.filter(paciente => {
            const fechaPaciente = new Date(paciente.fecha);
            return (
                fechaPaciente >= fechaInicioObj &&
                fechaPaciente <= fechaFinObj &&
                paciente.porcentajeCoincidencia >= porcentajeMin &&
                paciente.porcentajeCoincidencia <= porcentajeMax
            );
        });

        res.status(200).json(pacientesFiltrados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};