// user.controller.js

import { json } from "express";
import Paciente from "../Model/user.model.js";



// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
    const { id_doctor, nombres, apellidos, cedula, edad, contacto_emergencia, motivo_consulta, sintomas, alergias, diagnostico, medicamentoAtomar } = req.body;
    const newPaciente = new Paciente({ id_doctor, nombres, apellidos, cedula, edad, contacto_emergencia, motivo_consulta, sintomas, alergias, diagnostico, medicamentoAtomar });
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

//
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

        // Verificar si el Número_de_matriculaMedica ya existe en la base de datos
        const existingPacienteMatricula = await Paciente.findOne({ Número_de_matriculaMedica: updatedPaciente.Número_de_matriculaMedica });
        if (existingPacienteMatricula && existingPacienteMatricula._id.toString() !== pacienteId) {
            return res.status(400).json({ message: "El Número_de_matriculaMedica ya está en uso" });
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
