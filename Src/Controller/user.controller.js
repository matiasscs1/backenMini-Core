// user.controller.js

import { json } from "express";
import Paciente from "../Model/user.model.js";



// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
    const { id_doctor, nombres, apellidos,email, cedula, edad, contacto_emergencia, motivo_consulta, sintomas, alergias, diagnostico, medicamentoAtomar } = req.body;
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
};

// Obtener todos los pacientes
export const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// actualizar 
export const updatePacienteById = async (req, res) => {
    try {
        const pacienteId = req.params.id; // ID del paciente desde la URL
        const updatedPaciente = req.body; // Datos actualizados del paciente

        // Verificar si la cédula ya existe en la base de datos
        const existingPacienteCedula = await Paciente.findOne({ cedula: updatedPaciente.cedula });
        if (existingPacienteCedula && existingPacienteCedula._id.toString() !== pacienteId) {
            return res.status(400).json({ message: "La cédula ya está en uso" });
        }
        // Verificar si el email ya existe en la base de datos
        const existingPacienteEmail = await Paciente.findOne({ email: updatedPaciente.email });
        if (existingPacienteEmail && existingPacienteEmail._id.toString() !== pacienteId) {
            return res.status(400).json({ message: "El email ya está en uso" });
        }

        // Actualizar los campos de sintomas y alergias
        updatedPaciente.sintomas = Array.isArray(updatedPaciente.sintomas) ? updatedPaciente.sintomas : [updatedPaciente.sintomas];

        updatedPaciente.alergias = Array.isArray(updatedPaciente.alergias) ? updatedPaciente.alergias : [updatedPaciente.alergias];

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


// Eliminar un paciente por cedula
export const deletePacienteById = async (req, res) => {
    try {
        const cedula = req.body.cedula;
        const paciente = await Paciente.findOneAndDelete({ cedula: cedula });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json({ message: "Paciente eliminado exitosamente" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// funcionalidad para comparar las emfermdades y dar un diagnostico con ml js 
export const getDiagnostico = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const paciente = await Paciente.findById
            (pacienteId);
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        // Enfermedades
        const enfermedades = ["Gripe", "Resfriado", "Fiebre", "Dolor de cabeza", "Dolor de estómago", "Dolor de garganta", "Dolor de espalda", "Dolor de oído", "Dolor de muelas"];

        // Síntomas del paciente
        const sintomas = paciente.sintomas;
        let diagnostico = "";
        let enfermedadesEncontradas = [];
        for (let i = 0; i < enfermedades.length; i++) {
            const enfermedad = enfermedades[i];
            for (let j = 0; j < sintomas.length; j++) {
                const sintoma = sintomas[j];
                if (enfermedad.toLowerCase().includes(sintoma.toLowerCase())) {
                    enfermedadesEncontradas.push(enfermedad);
                }
            }
        }
        if (enfermedadesEncontradas.length > 0) {
            diagnostico = "El paciente tiene: " + enfermedadesEncontradas.join(", ");
        } else {
            diagnostico = "No se encontraron enfermedades";
        }
        res.status(200).json({ diagnostico });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}