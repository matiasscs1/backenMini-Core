import bcrypt from 'bcrypt';
import Doctor from '../Model/doctor.user.js';
import { createAcessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken'

import { TOKEN_SECRET } from "../config.js"
// Registrar un nuevo doctor
export const postDoctor = async (req, res) => {

    try {

        const doctor = req.body; // Se obtiene el objeto 'doctor' desde el cuerpo de la solicitud
        // Se busca un doctor en la base de datos por su correo electrónico
        const userFound = await Doctor.findOne({ email: doctor.email });
        if (userFound) {
            return res.status(400).json(['El usuario ya existe']); // Si el usuario ya existe, se devuelve un mensaje de error
        }
        // Encriptar la contraseña antes de guardarla en la base de datos
        doctor.password = await bcrypt.hash(doctor.password, 10); // Se encripta la contraseña usando bcrypt
        const newDoctor = new Doctor(doctor); // Se crea una nueva instancia de Doctor con los datos del 'doctor'

        await newDoctor.save(); // Se guarda el nuevo doctor en la base de datos
        const token = await createAcessToken( // Se crea un token de acceso
            {
                id: newDoctor._id, // Se usa el ID del nuevo doctor para el token
            }
        );
        res.cookie('token', token); // Se establece una cookie en la respuesta con el token
        res.json({
            id: newDoctor._id, // Se devuelve el ID del nuevo doctor en la respuesta
            email: newDoctor.email, // Se devuelve el correo electrónico del nuevo doctor en la respuesta
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Se maneja cualquier error devolviendo un mensaje de error en formato JSON
    }

};

////  Login Doctor 
export const login = async (req, res) => {
    // la contante tiene el email y el passsword del body del 
    // usuario en el front 
    const { email, password } = req.body; // Se obtienen el email y la contraseña desde el cuerpo de la solicitud
    try {
        const userFound = await Doctor.findOne({ email }); // Se busca un doctor en la base de datos por su correo electrónico
        if (!userFound) {
            return res.status(400).json({ message: 'Usuario no encontrado' }); // Si no se encuentra el usuario, se devuelve un mensaje de error
        }
        const isMatch = await bcrypt.compare(password, userFound.password); // Se compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' }); // Si las contraseñas no coinciden, se devuelve un mensaje de error
        }
        const token = await createAcessToken( // Se crea un token de acceso
            {
                // el token de usuario que encontro en la base 
                // si es que coincide 
                id: userFound._id, // Se usa el ID del usuario encontrado para el token
            }
        );
        res.cookie('token', token); // Se establece una cookie en la respuesta con el token
        res.json({
            id: userFound._id, // Se devuelve el ID del usuario en la respuesta
            email: userFound.email, // Se devuelve el correo electrónico del usuario en la respuesta
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Se maneja cualquier error devolviendo un mensaje de error en formato JSON
    }
};

/// logout Doctor 

export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0), // Se establece la fecha de expiración de la cookie en el pasado
    });
    res.json({ message: 'Logout exitoso' }); // Se devuelve un mensaje de éxito en formato JSON
}


// eliminar doctores por id
export const deleteDoctorId = async (req, res) => {
    try {
        const doctorId = req.body.id; // ID del usuario desde el body
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
        if (!deletedDoctor) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// eliminar por correo 
export const deleteDoctorEmail = async (req, res) => {
    try {
        const doctorEmail = req.body.email; // Correo del usuario desde el body
        const deletedDoctor = await Doctor.findOneAndDelete({ email: doctorEmail });
        if (!deletedDoctor) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// obtener todos los doctores 
export const getDoctor = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//actualizar los doctores por _id, el password no se podra actualizar y no se debe enviar para actualizar 
export const updateDoctorId = async (req, res) => {
    try {
        const doctorId = req.body._id; // ID del usuario desde el body
        let doctor = req.body; // Datos del usuario desde el body

        // Verificar si se está actualizando la contraseña
        if (doctor.password) {
            // Encriptar la contraseña antes de guardarla en la base de datos
            doctor.password = await bcrypt.hash(doctor.password, 10); // Se encripta la contraseña usando bcrypt
        }

        // Verificar si el teléfono, el correo electrónico o el número de matrícula médica ya existen
        const existingDoctor = await Doctor.findOne({ $or: [{ telefono: doctor.telefono }, { email: doctor.email }, { numeroMatricula: doctor.numeroMatricula }] });
        if (existingDoctor && existingDoctor._id.toString() !== doctorId) {
            return res.status(400).json({ message: "El teléfono, el correo electrónico o el número de matrícula médica ya existen" });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// obtener doctor por id 

export const getDoctorId = async (req, res) => {
    try {
        const doctorId = req.params.id; // ID del usuario desde la URL
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.set('Cache-Control', 'no-store');
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// metodo para que no se pueda entrar a las rutas sin permiso 

export const profile = async (req, res) => {
    const doctorFound = await Doctor.findById(req.user.id);
    if (!doctorFound) return res.status(404).json({ message: " Token, no autirzado} " });
    res.json({
        id: doctorFound._id,
        email: doctorFound.email,
    });
}

export const verifyToken = async (req, res) => {
    console.log("Verifying token")

    const { token } = req.cookies

    console.log(token)

    if (!token) return res.status(401).json({ message: "no token" })

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {

        if (err) return res.status(500).json({ message: "no token" });

        const userFound = await Doctor.findById(user.id);

        if (!userFound) return res.status(404).json({ message: "no user found" })

        return res.json({
            id: userFound._id,
            email: userFound.email,
        })
    })
}






