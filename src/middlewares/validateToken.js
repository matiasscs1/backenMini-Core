import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
export const authRequired = (req, res, next) => {
    const token = req.headers.cookie;
    if(!req.headers.cookie) 
        return res.status(401).json({
        message: 'Debe inciar sesion de nuevo, por temas de seguridad'
    });
    const parsedToken = token.split('=')[1];
    if(!parsedToken) 
        return res.status(401).json({
        message: 'No Autorizado'
    });
    jwt.verify(parsedToken,TOKEN_SECRET, (err, user) => {
        if(err) return res.status(err).json({ message: "Token invalid" });
        req.user = user;
        next();

    });


}