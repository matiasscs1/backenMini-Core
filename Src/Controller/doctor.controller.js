import bcrypt from 'bcrypt';
import Doctor from '../Model/doctor.user.js';
import { createAcessToken } from '../libs/jwt.js';

// Registrar un nuevo doctor
export const postDoctor = async (req, res) => {

    try {
     
        const doctor = req.body; // Se obtiene el objeto 'doctor' desde el cuerpo de la solicitud
        // Se busca un doctor en la base de datos por su correo electrónico
        const userFound = await Doctor.findOne({ email: doctor.email });
        if (userFound) {
            return res.status(400).json( ['El usuario ya existe'] ); // Si el usuario ya existe, se devuelve un mensaje de error
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

// metodo para que no se pueda entrar a las rutas sin permiso 

export const profile = async (req, res) => {
    const doctorFound = await Doctor.findById(req.user.id);
    if (!doctorFound) return res.status(404).json({ message: " Token, no autirzado} " });
    res.json({
        id: doctorFound._id,
        email: doctorFound.email,
    });
    

}





