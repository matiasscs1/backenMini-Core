// user.controller.js

import { json } from "express";
import User from "../Model/user.model.js";

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const {username, email,  nacimiento, genero, telefono, nombre, direccion, ciudad} = req.body;
    const newUser = new User({ username, email, nacimiento, genero, telefono, nombre, direccion, ciudad });
    await newUser.save();
    res.status(200).json({message: "Usuario creado exitosamene"});
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Actualizar un usuario por ID
export const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id; // ID del usuario desde la URL
        const updatedUser = req.body; // Datos actualizados del usuario
        const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // ID del usuario desde la URL
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Eliminar un usuario por ID
export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id; // ID del usuario desde la URL
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

